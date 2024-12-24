import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import UsersList from '../components/UsersList';
import ChatWindow from '../components/ChatWindow';
// import { fetchUsers } from '../services/api';

function Chat() {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const loadUsers = async () => {
      // const data = await fetch("https://chatapp-backend-g0n8.onrender.com/users");
      const data = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users`);
      const dataResponse = await data.json();      
      // console.log(dataResponse);
      
      setUsers(dataResponse.filter(u => u.id !== user.id));
    };
    loadUsers();
  }, [user.id]);

  return (
    <div className="flex h-screen bg-[#111b21]">
      {/* Left Sidebar */}
      <div className="w-1/3 border-r border-gray-700">
        <div className="h-16 bg-[#202c33] flex items-center justify-between px-4">
          <div className="flex items-center">
            <img
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`}
              alt="profile"
              className="w-10 h-10 rounded-full"
            />
            <span className="ml-3 text-white">{user.username}</span>
          </div>
          <button
            onClick={logout}
            className="text-gray-400 hover:text-white"
          >
            Logout
          </button>
        </div>
        <UsersList
          users={users}
          selectedUser={selectedUser}
          onSelectUser={setSelectedUser}
        />
      </div>

      {/* Main Chat Area */}
      {selectedUser ? (
        <ChatWindow currentUser={user} selectedUser={selectedUser} />
      ) : (
        <div className="flex-1 flex items-center justify-center bg-[#222e35] text-gray-400">
          Select a chat to start messaging
        </div>
      )}
    </div>
  );
}

export default Chat;