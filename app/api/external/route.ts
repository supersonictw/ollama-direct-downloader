// app/api/external/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Replace with the external API URL you want to call
    const apiUrl = 'https://jsonplaceholder.typicode.com/posts';

    // Fetch data from the external API
    const response = await fetch(apiUrl);

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