'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../utils/supabaseClient';
import MarkdownEditor from '../../components/MarkdownEditor';
import { IssueStatus } from '../../models/IssueStatus';
import { Button, TextField } from '@radix-ui/themes';
import StatusDropdown from '../../components/StatusDropdown';
import IssueChart from '../../components/IssueChart';
import { notifySuccess, notifyError } from '../../utils/toast';

const NewIssue: React.FC = () => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<IssueStatus>(IssueStatus.OPEN);
  const [priority, setPriority] = useState(2); // Default to medium priority
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted');
    console.log({ title, description, status, email, priority });

    try {
      // Send email to the assigned user
      const response = await fetch('/api/sendEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, title, description: `You have been assigned an issue.\n\n${description}` }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || 'Failed to send email');
      }

      notifySuccess('Email to user sent successfully');

      const { data, error } = await supabase.from('issues').insert([{ title, description, status, priority }]);
      if (error) {
        console.error('Error inserting issue:', error);
        setError(error.message);
        notifyError(`Error creating issue: ${error.message}`);
        return;
      }

      console.log('Issue created:', data);
      router.push('/');
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('Unexpected error occurred');
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
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <div className="max-w-xl mb-4">
              <TextField.Root placeholder="Title" onChange={(e) => setTitle(e.target.value)} />
            </div>
          </div>
          <div className="mb-4 max-w-xl max-h-md">
            <MarkdownEditor value={description} onChange={setDescription} />
          </div>
          <div className="mb-4 max-w-xl">
            <label className="block text-gray-700">Assignee Email</label>
            <TextField.Root placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
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
      </div>
      <div className="w-1/3 mr-40">
        <IssueChart />
      </div>
    </div>
  );
};

export default NewIssue;
