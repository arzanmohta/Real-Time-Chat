// models/Message.ts
import mongoose, { Document, Model, Schema } from 'mongoose';

interface IMessage extends Document {
  username: string;
  message: string;
  timestamp: Date;
}

const messageSchema: Schema = new Schema({
  username: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Message: Model<IMessage> = mongoose.models.Message || mongoose.model<IMessage>('Message', messageSchema);

export default Message;
export type { IMessage };
