import { NextRequest, NextResponse } from 'next/server';
import { connectDatabase, AppDataSource } from '../../../utils/db';
import { User } from '../../../models/user';

export async function POST(req: NextRequest) {
  const { name, email } = await req.json();

  if (!name || !email) {
    return NextResponse.json({ message: 'Name and email are required' }, { status: 400 });
  }

  try {
    await connectDatabase();
    const userRepository = AppDataSource.getRepository(User);
    const user = new User();
    user.name = name;
    user.email = email;
    const savedUser = await userRepository.save(user);

    return NextResponse.json({ message: 'User added successfully', user: savedUser }, { status: 200 });
  } catch (error) {
    console.error('Error adding user:', error);
    return NextResponse.json({ message: 'Unexpected error occurred' }, { status: 500 });
  }
}
