'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import './globals.css';

const Home: React.FC = () => {
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
    <div>
      <p>Loading...</p>
    </div>
  );
  if (error) return (
    <div>Error: {error}</div>
  );

  return (
    <div>
      <div className="container mx-auto mt-4">
        <h1 className="text-2xl font-bold mb-4">Issues</h1>
        <ul>
          {issues.map((issue) => (
            <li key={issue.id} className="mb-2 flex justify-between items-center">
              <Link href={`/issue/${issue.id}`} className="text-blue-500">
                {issue.title}
              </Link>
              <div>
                <button
                  className="text-blue-500 mr-4"
                  onClick={() => router.push(`/new-issue?id=${issue.id}`)}
                >
                  Edit
                </button>
                <button
                  className="text-red-500"
                  onClick={() => handleDelete(issue.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;
