import { NextRequest, NextResponse } from 'next/server';
import { connectDatabase, AppDataSource } from '../../../utils/db';
import { Issue } from '../../../models/issue';

export async function GET() {
  await connectDatabase();
  const issues = await AppDataSource.getRepository(Issue).find();
  return NextResponse.json(issues);
}

export async function POST(req: NextRequest) {
  const { title, description, status } = await req.json();
  await connectDatabase();
  const issue = new Issue();
  issue.title = title;
  issue.description = description;
  issue.status = status;
  const savedIssue = await AppDataSource.getRepository(Issue).save(issue);
  return NextResponse.json(savedIssue);
}
