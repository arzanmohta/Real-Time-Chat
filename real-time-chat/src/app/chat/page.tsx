// app/chat/page.tsx
'use client';

import { useState, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';

interface IMessage {
  username: string;
  message: string;
  timestamp: string;
}

const socket: Socket = io();

export default function Chat() {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    async function fetchMessages() {
      const res = await fetch('/api/messages');
      const data = await res.json();
      setMessages(data.messages.reverse());
    }
    fetchMessages();

    socket.on('newMessage', (message: IMessage) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('newMessage');
    };
  }, []);

  const sendMessage = async () => {
    const messageData = { username, message: newMessage };
    
    await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(messageData),
    });

    socket.emit('sendMessage', messageData);
    setNewMessage('');
  };

  return (
    <div>
      <h1>Real-Time Chat</h1>
      <input 
        type="text" 
        placeholder="Username" 
        value={username} 
        onChange={(e) => setUsername(e.target.value)} 
      />
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.username}: </strong>{msg.message}
          </div>
        ))}
      </div>
      <input 
        type="text" 
        placeholder="Type a message..." 
        value={newMessage} 
        onChange={(e) => setNewMessage(e.target.value)} 
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
