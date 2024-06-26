import { NextRequest, NextResponse } from 'next/server';
import { connectDatabase, AppDataSource } from '../../../utils/db';
import { Issue } from '../../../models/issue';
import { User } from '../../../models/user';

export async function GET() {
  await connectDatabase();
  const issues = await AppDataSource.getRepository(Issue).find({ relations: ['assigneeUser'] });
  return NextResponse.json(issues);
}

export async function POST(req: NextRequest) {
  const { title, description, status, priority, assignee } = await req.json();
  await connectDatabase();
  const issue = new Issue();
  issue.title = title;
  issue.description = description;
  issue.status = status;
  issue.priority = priority;
  issue.assignee = assignee;
  const savedIssue = await AppDataSource.getRepository(Issue).save(issue);
  return NextResponse.json(savedIssue);
}
