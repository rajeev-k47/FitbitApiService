
// export default function Home() {
//   return (
//       <>
//           <div className="page">
//               <div className="h-screen w-screen flex items-center justify-center">
//                   <div className="flex flex-col items-center justify-center">
//                       {/*overflow-x-auto text-center*/}
//                       <h1 className="text-6xl font-bold ps-1 pe-1 items-center justify-center text-center">Welcome to Fitbit</h1>
//                         <div className="mt-5"></div>
//
//                       <h1 className="text-gray-400 text-3xl font-bold ">UI Soon </h1>
//                       {
//
//                       }
//                   </div>
//               </div>
//           </div>
//       </>
//   );
// }

'use client'
import { useEffect, useState } from 'react';
import socket from '../app/lib/socket';

const Home = () => {
    const [messages, setMessages] = useState<string[]>([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        socket.on('message', (message: string) => {
            setMessages((prev) => [...prev, message]);
        });

        return () => {
            socket.off('message');
        };
    }, []);

    const sendMessage = () => {
        if (newMessage.trim()) {
            socket.emit('message', newMessage);
            setNewMessage('');
        }
    };

    return (
        <div>
            <h1>Socket.IO Chat</h1>
            <ul>
                {messages.map((msg, index) => (
                    <li key={index}>{msg}</li>
                ))}
            </ul>
            <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message"
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default Home;
