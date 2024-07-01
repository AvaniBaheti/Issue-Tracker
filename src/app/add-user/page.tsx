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

const AddUser=() => {
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
    <div className="mt-8 justify-center items-center text-center mx-auto">
      <h1 className="text-3xl font-bold mb-12 ">Add User to Assignee List</h1>
      <p className='text-center text-md mb-16 max-w-2xl ml-96 pl-20'>Add user to assignee list so that you can directly select user while creating an issue. Our app will help you create issue in an efficient manner.</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4 max-w-xl ml-96 pl-40">
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
        <div className="mb-4 max-w-xl ml-96 pl-40">
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
        <Button type="submit" className="px-4 py-2  bg-blue-500 text-white rounded-md hover:bg-[#90ee90] hover:text-black hover:cursor-pointer">
          Add User
        </Button>
      </form>
    </div>
  );
};

export default AddUser;
