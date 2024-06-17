import { NextRequest, NextResponse } from 'next/server';
import { connectDatabase, AppDataSource } from '../../../utils/db';
import { User } from '../../../models/user';

export async function GET() {
  try {
    await connectDatabase();
    const users = await AppDataSource.getRepository(User).find();
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ message: 'Error fetching users' }, { status: 500 });
  }
}
