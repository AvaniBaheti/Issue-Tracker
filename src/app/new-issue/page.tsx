'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../utils/supabaseClient';
import MarkdownEditor from '../../components/MarkdownEditor';
import { IssueStatus } from '../../models/IssueStatus';
import { Button, TextField } from '@radix-ui/themes';
import StatusDropdown from '../../components/StatusDropdown';
import IssueChart from '../../components/IssueChart'; // Import the IssueChart component

const NewIssue: React.FC = () => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<IssueStatus>(IssueStatus.OPEN);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted');
    console.log({ title, description, status });
    try {
      const { data, error } = await supabase.from('issues').insert([{ title, description, status }]);
      if (error) {
        console.error('Error inserting issue:', error);
        setError(error.message);
      } else {
        console.log('Issue created:', data);
        router.push('/');
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('Unexpected error occurred');
    }
  };

  return (
    <div className="container mx-auto mt-4 flex">
      <div className="w-2/3 ml-12">
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <div className='max-w-xl mb-4'>
              <TextField.Root placeholder='Title' onChange={(e) => setTitle(e.target.value)}>
              </TextField.Root>
            </div>
          </div>
          <div className="mb-4 max-w-xl max-h-md">
            <MarkdownEditor value={description} onChange={setDescription} />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Status</label>
            <StatusDropdown status={status} onChange={setStatus} />
          </div>
          <Button type="submit" className="px-6 py-4 font-bold text-md bg-black text-white rounded-md">
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
