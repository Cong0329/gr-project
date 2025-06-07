import { formatDistanceToNow } from 'date-fns';
import { Message, MessageItem } from '../../../../../redux/reviewsSlice';
import { vi } from 'date-fns/locale';
import { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../redux/store';
interface Props {
  messages: MessageItem[];
  user: Message;
}
function smoothScrollToBottom(container: HTMLDivElement, duration = 500) {
  const start = container.scrollTop;
  const end = container.scrollHeight;
  const distance = end - start;
  const startTime = performance.now();

  function step(currentTime: number) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    container.scrollTop = start + distance * progress;

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}


export default function MessageList({ messages, user }: Props) {

  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const { role } = useSelector((state: RootState) => state.auth);
  const isDoctor = role.includes('ROLE_DOCTOR');
  const isAdmin = role.includes('ROLE_ADMIN');
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      smoothScrollToBottom(container);
    }
  }, [messages]);
  
  return (
    <div ref={messagesContainerRef} className="flex-1 bg-gray-50  p-4 overflow-y-auto space-y-4 ">
      {(isAdmin || isDoctor) ? (
        <>
          {messages.map((msg) => (
            <div key={msg?.id} className={`flex ${user.user1?.id !== msg?.sender_id ? 'justify-end' : 'justify-start'}`}>
              {user?.user1?.id === msg?.sender_id && (
                <img className="w-8 h-8 rounded-full mr-2" src={user.user1?.avatar_url} alt={user.user1?.name} />
              )}
              <div
                className={`rounded-lg px-4 py-2 max-w-md ${msg?.sender_id !== user?.user1?.id ? 'bg-blue-500 text-white' : 'bg-white border text-gray-800'
                  }`}
              >
                {msg?.image_url ? (
                  <img src={msg?.image_url ?? ''} alt="" className='h-56 w-56 object-cover' />
                ) : (
                  <ReactMarkdown
                    components={{
                      a: ({  ...props }) => (
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
          ))
          }
        </>

      ) : (
        <>
          {
            messages.map((msg) => (
              <div key={msg?.id} className={`flex ${user.user2?.id !== msg?.sender_id ? 'justify-end' : 'justify-start'}`}>
                {user?.user2?.id === msg?.sender_id && (
                  <img className="w-8 h-8 rounded-full mr-2" src={user.user2?.avatar_url} alt={user.user2?.name} />
                )}
                <div
                  className={`rounded-lg px-4 py-2 max-w-md ${msg?.sender_id !== user?.user2?.id ? 'bg-blue-500 text-white' : 'bg-white border text-gray-800'
                    }`}
                >
                  {msg?.image_url ? (
                    <img src={msg?.image_url ?? ''} alt="" className='h-56 w-56 object-cover' />
                  ) : (
                    <ReactMarkdown
                      components={{
                        a: ({  ...props }) => (
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
            ))
          }
        </>
      )}

      {/* <div ref={messagesEndRef} /> */}
    </div>
  );
}
