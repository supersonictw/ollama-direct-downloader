import { redis } from '@/lib/redis';
import { NextResponse } from 'next/server';

export const POST = async (req: Request) => {

  // Count views per page
  const key = `views`;
  await redis.incr(key);

  return NextResponse.json({ success: true });
};
