import { NextRequest, NextResponse } from 'next/server';
import { connectDatabase, AppDataSource } from '../../../utils/db';
import { User } from '../../../models/user';
import { Issue } from '@/models/issue';
import { Not } from 'typeorm';
import { IssueStatus } from '@/models/IssueStatus';

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
export async function DELETE(req: NextRequest) {
  const { id } = await req.json();

  if (!id) {
    return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
  }

  await connectDatabase();
  const userRepo = AppDataSource.getRepository(User);
  const issueRepo = AppDataSource.getRepository(Issue);

  const openIssues = await issueRepo.find({ where: { assignee: id, status: Not(IssueStatus.CLOSED) } });

  if (openIssues.length > 0) {
    const user = await userRepo.findOne({ where: { id } });
    return NextResponse.json({ message: `Issues associated with ${user?.name} are not yet closed.` }, { status: 400 });
  }

  await issueRepo.delete({ assignee: id });

  await userRepo.delete(id);

  return NextResponse.json({ message: 'User deleted successfully' });
}
