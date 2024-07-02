'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';

const IssueDetail = () => {
  const params = useParams();
  const id = params?.id; 
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
        const response = await fetch(`/api/issues/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch issue');
        }
        const data = await response.json();
        setIssue(data);
      } catch (error) {
        setError('An error occurred while fetching the issue.');
      } finally {
        setLoading(false);
      }
    };
    fetchIssue();
  }, [id]);

 


  if (loading) return (
    <div className="w-full flex justify-center items-center">
          <div className="spinner"></div> 
        </div>
  );
  if (error) return <div className="w-full flex justify-center items-center min-h-screen text-red-500 font-bold text-center">{error}</div>;
  if (!issue) return <div className="w-full flex justify-center items-center min-h-screen text-gray-500 font-bold text-center">Issue not found</div>;

  return (
    <div className="w-full my-8 min-h-screen bg-white">
      <div className="container mx-auto p-4 shadow-lg rounded-lg w-[85%] bg-white">
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-gray-800">{issue.title}</h1>
          <div className="flex items-center mt-2 space-x-2">
            <span className="bg-purple-600 text-white text-sm font-semibold py-1 px-3 rounded-full">{issue.status}</span>
            <span className="bg-gray-200 text-gray-800 text-sm font-semibold py-1 px-3 rounded-full">Comprehensive Issue Tracker</span>
            <span className="bg-[#90ee90] text-black text-sm font-semibold py-1 px-3 rounded-full">{issue.priority}</span>
          </div>
        </div>
        <div className="border-gray-400 border-2 rounded-xs">
          <div className="bg-gray-100 p-4 rounded-t-lg border-b-2 border-gray-400 relative">
            <div className="absolute left-0 top-0 h-full w-4 bg-gray-100 before:absolute before:content-[''] before:h-0 before:w-0 before:border-l-[8px] before:border-l-transparent before:border-t-[16px] before:border-t-gray-100 before:border-r-[8px] before:border-r-transparent before:top-1/2 before:-translate-y-1/2"></div>
            <p className="text-black font-semibold">{issue.assigneeUser ? issue.assigneeUser.name : 'Unassigned'}</p>
          </div>
          <div className="bg-white p-4 rounded-b-lg prose prose-img:inline prose-a:text-blue-600 prose-a:underline">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]} 
              rehypePlugins={[rehypeRaw, rehypeSanitize]}
            >
              {issue.description}
            </ReactMarkdown>
          </div>

        </div>
      </div>
    </div>
  );
};

export default IssueDetail;
