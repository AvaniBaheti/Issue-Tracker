'use client'
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '../../../components/navbar';
import { supabase } from '../../../utils/supabaseClient';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';

const IssueDetail: React.FC = () => {
  const params = useParams();
  const id = params?.id; // Accessing the dynamic route parameter
  const [issue, setIssue] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchIssue = async () => {
      try {
        if (!id) {
          setError('ID not found in URL');
          return;
        }
        console.log('Fetching issue with ID:', id);
        const { data, error } = await supabase.from('issues').select('*').eq('id', id).single();
        console.log('Fetched data:', data);
        if (error || !data) {
          setError('Issue not found');
        } else {
          setIssue(data);
        }
      } catch (error) {
        console.error('Error fetching issue:', error);
        setError('An error occurred while fetching the issue.');
      } finally {
        setLoading(false);
      }
    };
    fetchIssue();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!issue) return <div>Issue not found</div>;

  return (
    <div>
      <div className="container mx-auto mt-4">
        <h1 className="text-2xl font-bold mb-4">Name: {issue.title}</h1>
        <div className="prose mb-4">
          <strong>Description:</strong>
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw, rehypeSanitize]}>
            {issue.description}
          </ReactMarkdown>
        </div>
        <p className="mb-4"><strong>Status:</strong> {issue.status}</p>
      </div>
    </div>
  );
};

export default IssueDetail;
