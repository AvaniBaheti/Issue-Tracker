import { NextRequest, NextResponse } from 'next/server';
import { connectDatabase, AppDataSource } from '../../../../utils/db';
import { Issue } from '../../../../models/issue';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDatabase();
  const issue = await AppDataSource.getRepository(Issue).findOne({ where: { id: parseInt(params.id) } });
  return NextResponse.json(issue);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { title, description, status } = await req.json();
  await connectDatabase();
  const issueRepo = AppDataSource.getRepository(Issue);
  let issue = await issueRepo.findOne({ where: { id: parseInt(params.id) } });
  if (issue) {
    issue.title = title;
    issue.description = description;
    issue.status = status;
    issue = await issueRepo.save(issue);
    return NextResponse.json(issue);
  } else {
    return NextResponse.json({ message: 'Issue not found' }, { status: 404 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDatabase();
  const issueRepo = AppDataSource.getRepository(Issue);
  const result = await issueRepo.delete({ id: parseInt(params.id) });
  return NextResponse.json(result);
}
