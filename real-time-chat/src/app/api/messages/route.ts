// app/api/messages/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Message, { IMessage } from '../../../../models/Message';

export async function GET() {
  await dbConnect();
  const messages: IMessage[] = await Message.find({}).sort({ timestamp: -1 }).limit(20);
  return NextResponse.json({ messages });
}

export async function POST(request: NextRequest) {
  await dbConnect();
  const { username, message }: { username: string; message: string } = await request.json();
  const newMessage = new Message({ username, message });
  await newMessage.save();
  return NextResponse.json(newMessage, { status: 201 });
}
