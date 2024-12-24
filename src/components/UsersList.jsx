import { format } from 'date-fns';

function UsersList({ users, selectedUser, onSelectUser }) {
  return (
    <div className="overflow-y-auto h-[calc(100vh-4rem)]">
      {users.map(user => (
        <div
          key={user.id}
          onClick={() => onSelectUser(user)}
          className={`flex items-center p-3 cursor-pointer hover:bg-[#202c33] ${
            selectedUser?.id === user.id ? 'bg-[#2a3942]' : ''
          }`}
        >
          <img
            src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`}
            alt={user.username}
            className="w-12 h-12 rounded-full"
          />
          <div className="ml-4 flex-1">
            <div className="flex justify-between items-center">
              <h3 className="text-white font-medium">{user.username}</h3>
              <span className="text-xs text-gray-400">
                {format(new Date(), 'HH:mm')}
              </span>
            </div>
            <p className="text-gray-400 text-sm truncate">
              Click to start chatting
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default UsersList;