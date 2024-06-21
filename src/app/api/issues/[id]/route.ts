import { NextRequest, NextResponse } from 'next/server';
import { connectDatabase, AppDataSource } from '../../../../utils/db';
import { Issue } from '../../../../models/issue';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDatabase();
  const issue = await AppDataSource.getRepository(Issue).findOne({
    where: { id: parseInt(params.id) },
    relations: ['assigneeUser'],
  });
  if (!issue) {
    return NextResponse.json({ message: 'Issue not found' }, { status: 404 });
  }
  return NextResponse.json(issue);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { title, description, status, priority, assignee } = await req.json();
  await connectDatabase();
  const issueRepo = AppDataSource.getRepository(Issue);
  let issue = await issueRepo.findOne({ where: { id: parseInt(params.id) } });
  if (!issue) {
    return NextResponse.json({ message: 'Issue not found' }, { status: 404 });
  }
  issue.title = title;
  issue.description = description;
  issue.status = status;
  issue.priority = priority;
  issue.assignee = assignee;
  const savedIssue = await issueRepo.save(issue);
  return NextResponse.json(savedIssue);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDatabase();
  const issueRepo = AppDataSource.getRepository(Issue);
  const result = await issueRepo.delete({ id: parseInt(params.id) });
  if (result.affected === 0) {
    return NextResponse.json({ message: 'Issue not found' }, { status: 404 });
  }
  return NextResponse.json({ message: 'Issue deleted successfully' }, { status: 200 });
}
