import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:4000'); // Ensure this matches your backend URL

function Chat() {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        socket.on('connect', () => {
            console.log('Connected to server');
        });

        socket.on('chat:message', (data) => {
            setMessages(prevMessages => [...prevMessages, data]);
        });

        // Clean up on unmount
        return () => {
            socket.disconnect();
        };
    }, []);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (message.trim()) {
            socket.emit('chat:message', message);
            console.log(message)
            setMessage(''); // Clear the input field after sending the message
        }
    };

    return (
        <div>
            <header>
                <h1>React with Socket.io</h1>
                <form onSubmit={handleSendMessage}>
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type a message"
                    />
                    <button type="submit">Send Message</button>
                </form>
                <div>
                    {
                        messages.map((msg, index) => <p key={index}>{msg}</p>)
                    }
                </div>
            </header>
        </div>
    );
}

export default Chat;
