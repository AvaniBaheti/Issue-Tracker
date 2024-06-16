'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/navbar';
import { supabase } from '../../utils/supabaseClient';
import MarkdownEditor from '../../components/MarkdownEditor';

const NewIssue: React.FC = () => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');
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
    <div>
      <div className="container mx-auto mt-4">
        <h1 className="text-2xl font-bold mb-4 mx-16">Add Issue</h1>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 border border-black">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-black rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Description</label>
            <MarkdownEditor value={description} onChange={setDescription} />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Status</label>
            <input
              type="text"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">
            Create
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewIssue;
