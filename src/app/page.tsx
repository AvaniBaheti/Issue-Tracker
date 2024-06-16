'use client'
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/navbar';
import { supabase } from '../utils/supabaseClient';
import './globals.css'

const Home: React.FC = () => {
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const { data, error } = await supabase.from('issues').select('*');
        if (error) {
          setError(error.message);
        } else {
          setIssues(data);
        }
      } catch (error) {
        setError('An error occurred while fetching issues.');
      } finally {
        setLoading(false);
      }
    };
    fetchIssues();
  }, []);

  if (loading) return (
    <div>
    
      <p>Loading...</p>
    </div>
  )
  if (error) return (
    <>

    <div>Error: {error}</div>;
    </>
  )

  return (
    <div>
      <div className="container mx-auto mt-4">
        <h1 className="text-2xl font-bold mb-4">Issues</h1>
        <ul>
          {issues.map((issue) => (
            <li key={issue.id} className="mb-2">
              <Link href={`/issue/${issue.id}`} className="text-blue-500">
                {issue.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;
