// app/api/external/route.ts
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {

  try {
    // Parse the request body to get the URL
    const { url } = await request.json();

    // Validate the URL
    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'URL is required and must be a string' },
        { status: 400 }
      );
    }

    console.log('Fetching URL:', url); // Debugging: Log the URL

    // Fetch data from the external API
    const response = await fetch(url);

    // Debugging: Log the response status
    console.log('Response status:', response.status, response.statusText);

    // Check if the response is OK
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    // Parse the JSON response
    const data = await response.json();

    // Return the JSON response
    return NextResponse.json(data);
  } catch (error) {
    // Handle errors
    console.error('Error fetching external API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data from external API' },
      { status: 500 }
    );
  }
}