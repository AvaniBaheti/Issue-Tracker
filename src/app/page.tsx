'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import './globals.css';
import RollingPhrases from '@/components/rollingPhrases';

const Home = () => {
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await fetch('/api/issues');
        if (!response.ok) {
          throw new Error('Failed to fetch issues');
        }
        const data = await response.json();
        setIssues(data);
      } catch (error) {
        setError('An error occurred while fetching issues.');
      } finally {
        setLoading(false);
      }
    };
    fetchIssues();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this issue?')) return;
    try {
      const response = await fetch(`/api/issues/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed to delete issue');
      }
      setIssues(issues.filter(issue => issue.id !== id));
    } catch (error) {
      setError('An error occurred while deleting the issue.');
    }
  };

  if (loading) return (
    <div className="w-full flex justify-center items-center">
      <div className="spinner"></div> 
    </div>
  );
  if (error) return (
    <div>Error: {error}</div>
  );

  return (
    <>
    <h1 className="font-heading font-medium pt-2 w-[95%] lg:w-full text-[70px] flex flex-col justify-center text-black mt-2 mb-8 mx-0"
                id="lp-intro-text-roll">
                <RollingPhrases />
    </h1>
    <div className="container mx-auto mt-4 px-4 md:px-8 lg:px-24">
      <div className="overflow-x-auto">
        <div className="max-w-full mx-auto border border-gray-300 rounded-lg">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-2 md:px-4 text-left">Sr No.</th>
                <th className="py-2 px-2 md:px-4 text-left">Issue Name</th>
                <th className="py-2 px-2 md:px-4 text-left">Assigned To</th>
                <th className="py-2 px-2 md:px-4 text-left">Created At</th>
                <th className="py-2 px-2 md:px-4 text-left">Status</th>
                <th className="py-2 px-2 md:px-4 text-left">Priority</th>
                <th className="py-2 px-2 md:px-4 text-left"></th>
              </tr>
            </thead>
            <tbody>
              {issues.map((issue, index) => (
                <tr key={issue.id} className="border-b last:border-none">
                  <td className="py-2 px-2 md:px-4">{index + 1}</td>
                  <td className="py-2 px-2 md:px-4">{issue.title}</td>
                  <td className="py-2 px-2 md:px-4">{issue.assigneeUser ? issue.assigneeUser.name : 'Unassigned'}</td>
                  <td className="py-2 px-2 md:px-4">{new Date(issue.createdAt).toLocaleString()}</td>
                  <td className="py-2 px-2 md:px-4">{issue.status}</td>
                  <td className="py-2 px-2 md:px-4">{issue.priority}</td>
                  <td className="py-2 px-2 md:px-4 text-right">
                    <div className="relative">
                      <DropdownMenu.Root>
                        <DropdownMenu.Trigger asChild>
                          <button className="text-gray-500">
                            •••
                          </button>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Content className="bg-white shadow-lg rounded-md p-2 absolute right-0">
                          <DropdownMenu.Item asChild>
                            <button
                              className="text-blue-500 w-full text-left"
                              onClick={() => router.push(`/issue/${issue.id}`)}
                            >
                              View
                            </button>
                          </DropdownMenu.Item>
                          <DropdownMenu.Item asChild>
                            <button
                              className={`w-full text-left ${issue.status === 'CLOSED' ? 'text-gray-300 cursor-not-allowed' : 'text-blue-500'}`}
                              onClick={() => {
                                if (issue.status !== 'CLOSED') {
                                  router.push(`/new-issue?id=${issue.id}`);
                                }
                              }}
                              disabled={issue.status === 'CLOSED'}
                            >
                              Edit
                            </button>
                          </DropdownMenu.Item>
                          <DropdownMenu.Item asChild>
                            <button
                              className={`w-full text-left ${issue.status !== 'CLOSED' ? 'text-gray-300 cursor-not-allowed' : 'text-red-500'}`}
                              onClick={() => {
                                if (issue.status === 'CLOSED') {
                                  handleDelete(issue.id);
                                }
                              }}
                              disabled={issue.status !== 'CLOSED'}
                            >
                              Delete
                            </button>
                          </DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu.Root>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </>
  );
};

export default Home;
