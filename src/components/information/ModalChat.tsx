import React, { useState, useRef, useEffect } from "react";
import { X, Send, MessageCircle, User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import {
  sendMessageDoctor,
} from "../../redux/messageAsyncThunk";
import socket from "../../auth/socket";
interface Message {
  id: string;
  text: string;
  sender: "user" | "other";
  timestamp: Date;
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  id?: string;
}

export const ChatModal: React.FC<ChatModalProps> = ({
  isOpen,
  onClose,
  title,
  id,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Xin chào! Tôi có thể giúp gì cho bạn?",
      sender: "other",
      timestamp: new Date(Date.now() - 60000),
    },
  ]);
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch: AppDispatch = useDispatch();
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (id) {
      setMessages([
        {
          id: "1",
          text: "Xin chào! Tôi có thể giúp gì cho bạn?",
          sender: "other",
          timestamp: new Date(Date.now() - 60000),
        },
      ]);
    }
  }, [id]);

  useEffect(() => {
    if (!user?.id) return;

    socket.emit("join_room", user.id);

    const handleNewMessage = (data: {
      message_id: string;
      sender_id: string;
      content: string;
      image_url?: string;
      createdAt: string;
      updateAt: string;
      User: any;
    }) => {
      // Chỉ thêm tin nhắn nếu đang trò chuyện đúng người
      if (id === data.sender_id) {
        const formattedMessage: Message = {
          id: data.message_id,
          text: data.content,
          sender: "other",
          timestamp: new Date(data.createdAt),
        };

        setMessages((prev) => [...prev, formattedMessage]);
      }
    };

    socket.on("new_doctor_message", handleNewMessage);

    return () => {
      socket.off("new_doctor_message", handleNewMessage);
    };
  }, [user?.id, dispatch, id]);

  const handleSendMessage = () => {
    if (inputMessage.trim() === "") return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputMessage("");
    dispatch(
      sendMessageDoctor({
        content: inputMessage,
        recipientId: id,
        id: user?.id,
      })
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isOpen) return null;
  if (!id || !title) return null;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-10 flex items-center justify-center z-[99999999] p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md h-96 flex flex-col animate-in fade-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-blue-600 text-white rounded-t-lg">
          <div className="flex items-center space-x-2">
            <MessageCircle className="w-5 h-5" />
            <h3 className="font-semibold">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-blue-700 rounded-full p-1 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex items-start space-x-2 max-w-xs ${
                  message.sender === "user"
                    ? "flex-row-reverse space-x-reverse"
                    : ""
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${
                    message.sender === "user" ? "bg-blue-500" : "bg-gray-500"
                  }`}
                >
                  <User className="w-4 h-4" />
                </div>
                <div
                  className={`rounded-lg p-3 ${
                    message.sender === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === "user"
                        ? "text-blue-100"
                        : "text-gray-500"
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t p-4">
          <div className="flex space-x-2">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nhập tin nhắn..."
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleSendMessage}
              disabled={inputMessage.trim() === ""}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg px-4 py-2 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
