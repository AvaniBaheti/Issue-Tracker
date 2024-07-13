'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import dynamic from 'next/dynamic';
import { IssueStatus } from '../../models/IssueStatus';
import { Button, TextField } from '@radix-ui/themes';
import { notifySuccess, notifyError } from '../../utils/toast';
import React, { Suspense } from 'react';

const MarkdownEditor = dynamic(() => import('../../components/MarkdownEditor'), { ssr: false });
const StatusDropdown = dynamic(() => import('../../components/StatusDropdown'), { ssr: false });
const IssueChart = dynamic(() => import('../../components/IssueChart'), { ssr: false });

const schema = z.object({
  title: z.string().nonempty('Title is required'),
  description: z.string().nonempty('Description is required'),
  assignee: z.string().nonempty('Assignee is required'),
});

type FormData = z.infer<typeof schema>;

const NewIssue = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const issueId = searchParams.get('id');
  const { control, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const [status, setStatus] = useState<IssueStatus>(IssueStatus.OPEN);
  const [priority, setPriority] = useState('Medium'); 
  const [users, setUsers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [oldAssignee, setOldAssignee] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true); 
  const [isClient, setIsClient] = useState(false);


  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Error fetching users');
      }
    };

    fetchUsers();
  }, [isClient]);

  useEffect(() => {
    if (!isClient) return;

    if (issueId) {
      const fetchIssue = async () => {
        try {
          const response = await fetch(`/api/issues/${issueId}`);
          const data = await response.json();
          reset({
            title: data.title,
            description: data.description,
            assignee: data.assignee.toString(),
          });
          setStatus(data.status);
          setPriority(data.priority);
          setOldAssignee(data.assignee);
        } catch (error) {
          console.error('Error fetching issue:', error);
          setError('Error fetching issue');
        } finally {
          setLoading(false); 
        }
      };

      fetchIssue();
    } else {
      setLoading(false); 
    }
  }, [isClient, issueId, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      const assignee = users.find(user => user.id === parseInt(data.assignee));
      if (!assignee) {
        notifyError('Selected user not found');
        return;
      }

      const emailRequests = [];

      if (issueId) {
        if (oldAssignee === assignee.id) {
          emailRequests.push(fetch('/api/sendEmail', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: assignee.email,
              title: `Updated Issue: ${data.title}`,
              description: `Your issue has been updated.\n\n Title: ${data.title}\n\n Description:\n\n ${data.description}\n\n Status: ${status}\n\n Priority: ${priority}`,
            }),
          }));
        } else {
          emailRequests.push(fetch('/api/sendEmail', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: assignee.email,
              title: `New Issue Assigned: ${data.title}`,
              description: `You have been assigned an issue.\n\n Title: ${data.title}\n\n Description:\n\n ${data.description}\n\n Status: ${status}\n\n Priority: ${priority}`,
            }),
          }));

          const oldAssigneeData = users.find(user => user.id === oldAssignee);
          if (oldAssigneeData) {
            emailRequests.push(fetch('/api/sendEmail', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: oldAssigneeData.email,
                title: `Updated Issue: ${data.title}`,
                description: `You are no longer assigned to this issue. Please work on other issues assigned to you.`,
              }),
            }));
          }
        }
      } else {
        emailRequests.push(fetch('/api/sendEmail', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: assignee.email,
            title: `New Issue Assigned: ${data.title}`,
            description: `You have been assigned an issue.\n\n Title: ${data.title}\n\n Description:\n\n ${data.description}\n\n Status: ${status}\n\n Priority: ${priority}`,
          }),
        }));
      }

      const emailResponses = await Promise.all(emailRequests);
      const emailErrors = emailResponses.filter(res => !res.ok);
      if (emailErrors.length > 0) {
        throw new Error('Failed to send one or more emails');
      }

      notifySuccess('Email sent successfully');
      const method = issueId ? 'PATCH' : 'POST';
      const endpoint = issueId ? `/api/issues/${issueId}` : '/api/issues';

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          status,
          priority,
          assignee: assignee.id,
        }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || `Failed to ${issueId ? 'update' : 'create'} issue`);
      }

      const issueData = await response.json();
      const successMessage = issueId ? 'Issue updated successfully' : 'Issue created successfully';
      notifySuccess(successMessage);
      router.push('/');
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('Unexpected error occurred');
      notifyError(`Unexpected error: ${err.message}`);
    }
  };

  const getPriorityColor = () => {
    switch (priority) {
      case 'Low':
        return 'text-blue-500';
      case 'Medium':
        return 'text-green-500';
      case 'High':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  if (!isClient) {
    return null; 
  }

  return (
    <div className="container mx-auto mt-4 flex">
      {loading ? ( 
        <div className="w-full flex justify-center items-center">
          <div className="spinner"></div> 
        </div>
      ) : (
        <div className="flex w-full">
          <div className="w-2/3 ml-12">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4 max-w-xl">
                <Controller
                  name="title"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <div>
                      <TextField.Root placeholder="Title" {...field} />
                      {errors.title && <p className="text-red-500">{errors.title.message}</p>}
                    </div>
                  )}
                />
              </div>
              <div className="mb-4 max-w-xl max-h-md">
                <Controller
                  name="description"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <div>
                      <MarkdownEditor {...field} />
                      {errors.description && <p className="text-red-500">{errors.description.message}</p>}
                    </div>
                  )}
                />
              </div>
              <div className="mb-4 max-w-xl">
                <label className="block text-gray-700">Assignee</label>
                <Controller
                  name="assignee"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <div>
                      {users.length > 0 ? (
                        <select {...field} className="w-full px-4 py-2 border rounded-md">
                          <option value="" disabled>Select Assignee</option>
                          {users.map(user => (
                            <option key={user.id} value={user.id}>{user.name}</option>
                          ))}
                        </select>
                      ) : (
                        <div>
                          <p>No users found. Please <a href="/add-user" className="text-blue-500">add a user</a>.</p>
                        </div>
                      )}
                      {errors.assignee && <p className="text-red-500">{errors.assignee.message}</p>}
                    </div>
                  )}
                />
              </div>
              <div className='flex'>
                <div className="mb-4 mr-16">
                  <label className="block text-gray-700">Status</label>
                  <StatusDropdown status={status} onChange={setStatus} />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Priority</label>
                  <div className="flex items-center">
                    <input
                      type="range"
                      min="1"
                      max="3"
                      value={priority === 'Low' ? 1 : priority === 'Medium' ? 2 : 3}
                      onChange={(e) => setPriority(e.target.value === '1' ? 'Low' : e.target.value === '2' ? 'Medium' : 'High')}
                      className={`w-full h-2 rounded-lg cursor-pointer ${getPriorityColor()}`}
                    />
                    <div className={`ml-4 ${getPriorityColor()}`}>
                      {priority}
                    </div>
                  </div>
                </div>
              </div>
              <Button type="submit" className="px-6 py-4 font-bold text-md hover:bg-gray-500 bg-black text-white rounded-md hover:cursor-pointer">
                {issueId ? 'Update' : 'Create'}
              </Button>
            </form>
            {error && <p className="text-red-500">{error}</p>}
          </div>
          {!loading && (
            <div className="w-1/3 mr-40">
              <IssueChart />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default function SuspendedNewIssue() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewIssue />
    </Suspense>
  );
}
