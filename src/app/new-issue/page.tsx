'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import MarkdownEditor from '../../components/MarkdownEditor';
import { IssueStatus } from '../../models/IssueStatus';
import { Button, TextField } from '@radix-ui/themes';
import StatusDropdown from '../../components/StatusDropdown';
import IssueChart from '../../components/IssueChart';
import { notifySuccess, notifyError } from '../../utils/toast';

// Define the validation schema
const schema = z.object({
  title: z.string().nonempty('Title is required'),
  description: z.string().nonempty('Description is required'),
  assignee: z.string().nonempty('Assignee is required'),
});

type FormData = z.infer<typeof schema>;

const NewIssue: React.FC = () => {
  const router = useRouter();
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const [status, setStatus] = useState<IssueStatus>(IssueStatus.OPEN);
  const [priority, setPriority] = useState('Medium'); // Default to Medium priority
  const [users, setUsers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      const assignee = users.find(user => user.id === parseInt(data.assignee));
      if (!assignee) {
        notifyError('Selected user not found');
        return;
      }

      // Send email to the assigned user
      const emailResponse = await fetch('/api/sendEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: assignee.email,
          title: data.title,
          description: `You have been assigned an issue.\n\n${data.description} \n\n Status:${status} \n\n Priority: ${priority}`,
          priority,
          status,
        }),
      });

      if (!emailResponse.ok) {
        const errorMessage = await emailResponse.text();
        throw new Error(errorMessage || 'Failed to send email');
      }

      notifySuccess('Email to user sent successfully');

      // Add the issue using the API
      const issueResponse = await fetch('/api/issues', {
        method: 'POST',
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

      if (!issueResponse.ok) {
        const errorMessage = await issueResponse.text();
        throw new Error(errorMessage || 'Failed to create issue');
      }

      const insertedData = await issueResponse.json();
      console.log('Issue created:', insertedData);
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

  return (
    <div className="container mx-auto mt-4 flex">
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
          <Button type="submit" className="px-6 py-4 font-bold text-md bg-black text-white rounded-md hover:cursor-pointer">
            Create
          </Button>
        </form>
        {error && <p className="text-red-500">{error}</p>}
      </div>
      <div className="w-1/3 mr-40">
        <IssueChart />
      </div>
    </div>
  );
};

export default NewIssue;
