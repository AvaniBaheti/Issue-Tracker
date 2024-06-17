'use client';

import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, TextField } from '@radix-ui/themes';
import { notifySuccess, notifyError } from '../../utils/toast';

const schema = z.object({
  name: z.string().nonempty('Name is required'),
  email: z.string().email('Invalid email format').nonempty('Email is required'),
});

type FormData = z.infer<typeof schema>;

const AddUser: React.FC = () => {
  const router = useRouter();
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch('/api/addUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }

      notifySuccess('User added successfully');
      router.push('/new-issue');
    } catch (error) {
      console.error('Error adding user:', error);
      notifyError('Error adding user');
    }
  };

  return (
    <div className="container mt-4 justify-center items-center ml-96">
      <h1 className="text-2xl font-bold mb-4">Add User</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4 max-w-xl">
          <Controller
            name="name"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <div>
                <TextField.Root placeholder="Name" {...field} />
                {errors.name && <p className="text-red-500">{errors.name.message}</p>}
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
        <Button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-[#90ee90] hover:text-black hover:cursor-pointer">
          Add User
        </Button>
      </form>
    </div>
  );
};

export default AddUser;
