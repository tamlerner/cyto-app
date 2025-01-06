// app/api/document-upload/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const formData = await request.formData();
  const file = formData.get('file') as File;
  const documentType = formData.get('type') as string;

  const fileName = `${documentType}-${Date.now()}`;
  const { data, error } = await supabase.storage
    .from('user-documents')
    .upload(fileName, file);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data });
}