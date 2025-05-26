import { formatDistanceToNow } from 'date-fns';
import { Message, MessageItem } from '../../../../../redux/reviewsSlice';
import { vi } from 'date-fns/locale';
import { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
interface Props {
  messages: MessageItem[];
  user: Message;
}

export default function MessageList({ messages, user }: Props) {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="flex-1 bg-gray-50 p-4 overflow-y-auto space-y-4">
      {messages.map((msg) => (
        <div key={msg?.id} className={`flex ${user.User?.id !== msg?.sender_id ? 'justify-end' : 'justify-start'}`}>
          {user?.User?.id === msg?.sender_id && (
            <img className="w-8 h-8 rounded-full mr-2" src={user.User?.avatar_url} alt={user.User?.name} />
          )}
          <div
            className={`rounded-lg px-4 py-2 max-w-md ${msg?.sender_id !== user?.User?.id ? 'bg-blue-500 text-white' : 'bg-white border text-gray-800'
              }`}
          >
            {msg?.image_url ? (
              <img src={msg?.image_url ?? ''} alt="" className='h-56 w-56 object-cover' />
            ) : (
              <ReactMarkdown
                components={{
                  a: ({ node, ...props }) => (
                    <a {...props} target="_blank" rel="noopener noreferrer" className="underline text-black" />
                  )
                }}
              >
                {msg.content}
              </ReactMarkdown>
            )}
            {msg?.createdAt &&
              <p className="text-xs mt-1">{formatDistanceToNow(new Date(msg?.createdAt), {
                addSuffix: true,
                locale: vi,
              })}</p>
            }

          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
