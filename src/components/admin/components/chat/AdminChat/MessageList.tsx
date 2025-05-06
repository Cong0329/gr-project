import { Message, User } from './types';

interface Props {
  messages: Message[];
  user: User;
}

export default function MessageList({ messages, user }: Props) {
  return (
    <div className="flex-1 bg-gray-50 p-4 overflow-y-auto space-y-4">
      {messages.map((msg) => (
        <div key={msg.id} className={`flex ${msg.isAdmin ? 'justify-end' : 'justify-start'}`}>
          {!msg.isAdmin && (
            <img className="w-8 h-8 rounded-full mr-2" src={user.avatar} alt={user.name} />
          )}
          <div
            className={`rounded-lg px-4 py-2 max-w-md ${
              msg.isAdmin ? 'bg-blue-500 text-white' : 'bg-white border text-gray-800'
            }`}
          >
            <p>{msg.text}</p>
            <p className="text-xs mt-1">{msg.timestamp}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
