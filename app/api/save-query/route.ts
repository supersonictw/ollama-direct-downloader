import { redis } from '@/lib/redis';
import { NextResponse } from 'next/server';

export const POST = async (req: Request) => {
  const { query } = await req.json();

  // Save query to a list
  await redis.lpush('queries', query);

  return NextResponse.json({ success: true });
};
