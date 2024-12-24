import { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { FiSend } from 'react-icons/fi';
import io from 'socket.io-client';

const socket = io(`${import.meta.env.VITE_BACKEND_URL}`, {
  transports: ['websocket', 'polling'], // Match backend configuration
});

function ChatWindow({ currentUser, selectedUser }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const loadMessages = async () => {
    try {
      if (selectedUser) {
        const data = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/getMessages?senderId=${currentUser.id}&receiverId=${selectedUser.id}`, {
          method: "GET",
        });
        const dataResponse = await data.json();

        setMessages(dataResponse.messages);
      }

    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  useEffect(() => {
    loadMessages();
    socket.on('new-message', (newMessage) => {
      if (
        (newMessage.senderId === currentUser.id && newMessage.receiverId === selectedUser.id) ||
        (newMessage.senderId === selectedUser.id && newMessage.receiverId === currentUser.id)
      ) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    });

    // Clean up the socket listener
    return () => {
      socket.off('new-message');
    };
  }, [currentUser.id, selectedUser]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const messageData = {
        senderId: currentUser.id,
        receiverId: selectedUser.id,
        text: newMessage,
        timestamp: format(new Date(), 'HH:mm'),
      };

      try {
        // Emit message to server
        socket.emit('send-message', messageData);
        setNewMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Chat Header */}
      <div className="h-16 bg-[#202c33] flex items-center px-4">
        <img
          src={`https://api.dicebear.com/7.x/initials/svg?seed=${selectedUser.username}`}
          alt={selectedUser.username}
          className="w-10 h-10 rounded-full"
        />
        <span className="ml-3 text-white font-medium">{selectedUser.username}</span>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-[#0b141a] space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.senderId === currentUser.id ? 'justify-end' : 'justify-start'
              }`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${message.senderId === currentUser.id
                ? 'bg-[#005c4b] text-white'
                : 'bg-[#202c33] text-white'
                }`}
            >
              {
                message.senderId !== currentUser.id && (
                  <span className="text-sm text-blue-500 mt-1 block">
                    {selectedUser.username}
                  </span>
                )
              }
              <p className="break-words">{message.text}</p>
              <span className="text-xs text-gray-300 float-right mt-1">
                {message.timestamp}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="h-16 bg-[#202c33] flex items-center px-4 gap-4">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message"
          className="flex-1 bg-[#2a3942] text-white rounded-lg px-4 py-2 focus:outline-none"
        />
        <button
          type="submit"
          className="text-[#00a884] hover:text-[#008f6f] p-2"
          disabled={!newMessage.trim()}
        >
          <FiSend size={24} />
        </button>
      </form>
    </div>
  );
}

export default ChatWindow;