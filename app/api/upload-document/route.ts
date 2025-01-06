// app/api/document-upload/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${type}-${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('user-documents')
      .upload(fileName, file);

    if (error) throw error;
    return NextResponse.json({ data });
    
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message }, 
      { status: 500 }
    );
  }
}