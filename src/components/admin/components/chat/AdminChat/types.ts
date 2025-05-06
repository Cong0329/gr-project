export interface User {
    id: string;
    name: string;
    role: string;
    avatar: string;
    lastMessage?: string;
    lastMessageTime?: string;
    isOnline: boolean;
  }
  
  export interface Message {
    id: string;
    senderId: string;
    text: string;
    timestamp: string;
    isAdmin: boolean;
  }
  