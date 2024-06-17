'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '../../utils/supabaseClient';
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
  email: z.string().email('Invalid email format').nonempty('Assignee email is required'),
});

type FormData = z.infer<typeof schema>;

const NewIssue: React.FC = () => {
  const router = useRouter();
  const [status, setStatus] = useState<IssueStatus>(IssueStatus.OPEN);
  const [priority, setPriority] = useState(2); // Default to medium priority
  const [generalError, setGeneralError] = useState<string | null>(null);
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    console.log('Form submitted', data);

    try {
      // Send email to the assigned user
      const response = await fetch('/api/sendEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          title: data.title,
          description: `You have been assigned an issue.\n\n${data.description} \n\n Status:${status} \n\n Priority: ${priority}`,
          priority,
          status,
        }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || 'Failed to send email');
      }

      notifySuccess('Email to user sent successfully');

      const createdAt = new Date().toISOString();

      const { data: insertedData, error } = await supabase.from('issues').insert([{ title: data.title, description: data.description, status, priority, createdAt }]);
      if (error) {
        console.error('Error inserting issue:', error);
        notifyError(`Error creating issue: ${error.message}`);
        return;
      }

      console.log('Issue created:', insertedData);
      router.push('/');
    } catch (err) {
      console.error('Unexpected error:', err);
      setGeneralError('Unexpected error occurred');
      notifyError(`Unexpected error: ${err.message}`);
    }
  };

  const getPriorityColor = () => {
    switch (priority) {
      case 1:
        return 'bg-blue-500';
      case 2:
        return 'bg-green-500';
      case 3:
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
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
            <Controller
              name="email"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <div>
                  <TextField.Root placeholder="Email" {...field} />
                  {errors.email && <p className="text-red-500">{errors.email.message}</p>}
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
                  value={priority}
                  onChange={(e) => setPriority(Number(e.target.value))}
                  className={`w-full h-2 rounded-lg cursor-pointer ${getPriorityColor()}`}
                />
                <div className="ml-4">
                  {priority === 1 && <span className="text-blue-500">Low</span>}
                  {priority === 2 && <span className="text-green-500">Medium</span>}
                  {priority === 3 && <span className="text-red-500">High</span>}
                </div>
              </div>
            </div>
          </div>
          <Button type="submit" className="px-6 py-4 font-bold text-md bg-black text-white rounded-md hover:cursor-pointer">
            Create
          </Button>
        </form>
        {generalError && <p className="text-red-500">{generalError}</p>}
      </div>
      <div className="w-1/3 mr-40">
        <IssueChart />
      </div>
    </div>
  );
};

export default NewIssue;
