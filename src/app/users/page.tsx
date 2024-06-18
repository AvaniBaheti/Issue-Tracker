'use client';

import { useState, useEffect } from 'react';
import { Button } from '@radix-ui/themes';
import { notifySuccess, notifyError } from '../../utils/toast';

const Users: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        setError('An error occurred while fetching users.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (userId: number) => {
    try {
      const response = await fetch('/api/users', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: userId }),
      });

      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(errorMessage.message || 'Failed to delete user');
      }

      notifySuccess('User deleted successfully');
      setUsers(users.filter(user => user.id !== userId));
    } catch (err) {
      console.error('Unexpected error:', err);
      notifyError(`${err.message}`);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto mt-4">
      <table className="min-w-full">
        <thead className='bg-gray-300'>
          <tr>
            <th className="py-2 px-4 border-2">Sr No</th>
            <th className="py-2 px-4 border-2">Name</th>
            <th className="py-2 px-4 border-2">Email</th>
            <th className="py-2 px-4 border-2">Delete</th>
          </tr>
        </thead>
        <tbody className='bg-gray-100'>
          {users.map((user, index) => (
            <tr key={user.id}>
              <td className="py-2 px-4 border text-center">{index + 1}</td>
              <td className="py-2 px-4 border text-center">{user.name}</td>
              <td className="py-2 px-4 border text-center">{user.email}</td>
              <td className="py-2 px-4 border text-center">
                <button onClick={() => handleDelete(user.id)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-red-500 hover:text-red-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
