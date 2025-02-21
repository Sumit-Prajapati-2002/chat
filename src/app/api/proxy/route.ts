import { NextRequest, NextResponse } from 'next/server';

const API_URL = "http://23.132.28.30:8000";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const path = searchParams.get('path') || '';
  
  try {
    const response = await fetch(`${API_URL}/${path}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-ID': request.headers.get('User-ID') || '',
      },
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error('Proxy GET error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch data' }, 
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const path = searchParams.get('path') || '';
  
  try {
    let body;
    const contentType = request.headers.get('Content-Type') || '';
    
    if (contentType.includes('multipart/form-data')) {
      // Handle file upload
      const formData = await request.formData();
      body = formData;
    } else {
      // Handle JSON data
      body = await request.json();
    }

    const response = await fetch(`${API_URL}/${path}`, {
      method: 'POST',
      headers: {
        'User-ID': request.headers.get('User-ID') || '',
        'Session-ID': request.headers.get('Session-ID') || '',
        // Don't set Content-Type for FormData, let fetch set it automatically
        ...(contentType.includes('application/json') && {
          'Content-Type': 'application/json'
        })
      },
      body: contentType.includes('application/json') ? JSON.stringify(body) : body,
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error('Proxy POST error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to post data' }, 
      { status: 500 }
    );
  }
} 