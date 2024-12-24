import { format, isToday, isYesterday } from 'date-fns';

function ChatMessage({ message, isOwnMessage }) {
  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} group`}>
      <div
        className={`max-w-[70%] rounded-lg p-3 ${
          isOwnMessage
            ? 'bg-gradient-to-r from-primary to-secondary text-white rounded-br-none'
            : 'bg-white text-gray-800 rounded-bl-none'
        } shadow-md transition-all duration-200 hover:shadow-lg`}
      >
        <div className="flex items-baseline space-x-2">
          <span className={`font-semibold text-sm ${isOwnMessage ? 'text-gray-100' : 'text-gray-600'}`}>
            {message.username}
          </span>
          <span className={`text-xs ${isOwnMessage ? 'text-gray-200' : 'text-gray-500'}`}>
            {message.timestamp}
          </span>
        </div>
        <p className="mt-1 break-words">{message.text}</p>
      </div>
    </div>
  );
}

export default ChatMessage;