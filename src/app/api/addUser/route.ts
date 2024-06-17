import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../utils/supabaseClient';

export async function POST(req: NextRequest) {
  const { name, email } = await req.json();

  if (!name || !email) {
    return NextResponse.json({ message: 'Name and email are required' }, { status: 400 });
  }

  try {
    const { error } = await supabase.from('users').insert([{ name, email }]);

    if (error) {
      return NextResponse.json({ message: `Error adding user: ${error.message}` }, { status: 500 });
    }

    return NextResponse.json({ message: 'User added successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Unexpected error occurred' }, { status: 500 });
  }
}
