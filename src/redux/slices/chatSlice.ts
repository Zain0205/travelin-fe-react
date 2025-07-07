import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import api from '@/lib/axios'; // Sesuaikan dengan path api Anda

// Types
export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await api.post('/chat/send', data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send message');
    }
  }
);

export const getChatHistory = createAsyncThunk(
  'chat/getChatHistory',
  async (params: any, { rejectWithValue }) => {
    try {
      const { userId, page = 1, limit = 10 } = params;
      const response = await api.get(`/chat/history/${userId}`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get chat history');
    }
  }
);

export const getChatList = createAsyncThunk(
  'chat/getChatList',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/chat/list');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get chat list');
    }
  }
);

export const markMessagesAsRead = createAsyncThunk(
  'chat/markMessagesAsRead',
  async (senderId: number, { rejectWithValue }) => {
    try {
      await api.post(`/chat/mark-read/${senderId}`);
      return senderId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark messages as read');
    }
  }
);

export const getUnreadCount = createAsyncThunk(
  'chat/getUnreadCount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/chat/unread-count');
      return response.data.count;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get unread count');
    }
  }
);

export const deleteMessage = createAsyncThunk(
  'chat/deleteMessage',
  async (messageId: number, { rejectWithValue }) => {
    try {
      await api.delete(`/chat/message/${messageId}`);
      return messageId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete message');
    }
  }
);

// Initial state
const initialState: any = {
  messages: [],
  chatList: [],
  currentChatHistory: null,
  unreadCount: 0,
  loading: {
    sendMessage: false,
    getChatHistory: false,
    getChatList: false,
    markAsRead: false,
    getUnreadCount: false,
    deleteMessage: false,
  },
  error: null,
  currentChatUserId: null,
};

// Slice
const chatSlice: any = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentChatUserId: (state, action: PayloadAction<number | null>) => {
      state.currentChatUserId = action.payload;
    },
    addMessage: (state, action: any) => {
      if (state.currentChatHistory && state.currentChatUserId) {
        const newMessage = action.payload;
        const isMessageForCurrentChat = 
          (newMessage.senderId === state.currentChatUserId) ||
          (newMessage.receiverId === state.currentChatUserId);
        
        if (isMessageForCurrentChat) {
          state.currentChatHistory.data.unshift(newMessage);
          state.currentChatHistory.meta.total += 1;
        }
      }
      
      const partnerId = action.payload.senderId !== state.currentChatUserId 
        ? action.payload.senderId 
        : action.payload.receiverId;
      
      const existingChatIndex = state.chatList.findIndex((chat: any) => chat.userId === partnerId);
      
      if (existingChatIndex !== -1) {
        // Update existing chat
        state.chatList[existingChatIndex] = {
          ...state.chatList[existingChatIndex],
          lastMessage: action.payload.message,
          lastMessageTime: action.payload.sentAt,
          unreadCount: action.payload.senderId !== state.currentChatUserId 
            ? state.chatList[existingChatIndex].unreadCount + 1 
            : state.chatList[existingChatIndex].unreadCount,
        };
        
        const updatedChat = state.chatList.splice(existingChatIndex, 1)[0];
        state.chatList.unshift(updatedChat);
      } else {
        const partner = action.payload.senderId !== state.currentChatUserId 
          ? action.payload.sender 
          : action.payload.receiver;
        
        state.chatList.unshift({
          userId: partner.id,
          userName: partner.name,
          userRole: partner.role,
          lastMessage: action.payload.message,
          lastMessageTime: action.payload.sentAt,
          unreadCount: action.payload.senderId !== state.currentChatUserId ? 1 : 0,
        });
      }
    },

    updateMessageReadStatus: (state, action: PayloadAction<{ senderId: number }>) => {
      if (state.currentChatHistory) {
        state.currentChatHistory.data = state.currentChatHistory.data.map((message: any) => 
          message.senderId === action.payload.senderId 
            ? { ...message, isRead: true }
            : message
        );
      }
      
      const chatIndex = state.chatList.findIndex((chat: any) => chat.userId === action.payload.senderId);
      if (chatIndex !== -1) {
        state.chatList[chatIndex].unreadCount = 0;
      }
    },
    removeMessage: (state, action: PayloadAction<number>) => {
      // Remove from current chat history
      if (state.currentChatHistory) {
        state.currentChatHistory.data = state.currentChatHistory.data.filter(
          (message: any) => message.id !== action.payload
        );
        state.currentChatHistory.meta.total -= 1;
      }
    },
    clearCurrentChatHistory: (state) => {
      state.currentChatHistory = null;
      state.currentChatUserId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.loading.sendMessage = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading.sendMessage = false;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading.sendMessage = false;
        state.error = action.payload as string;
      })
      
      // Get Chat History
      .addCase(getChatHistory.pending, (state) => {
        state.loading.getChatHistory = true;
        state.error = null;
      })
      .addCase(getChatHistory.fulfilled, (state, action) => {
        state.loading.getChatHistory = false;
        state.currentChatHistory = action.payload;
      })
      .addCase(getChatHistory.rejected, (state, action) => {
        state.loading.getChatHistory = false;
        state.error = action.payload as string;
      })
      
      .addCase(getChatList.pending, (state) => {
        state.loading.getChatList = true;
        state.error = null;
      })
      .addCase(getChatList.fulfilled, (state, action) => {
        state.loading.getChatList = false;
        state.chatList = action.payload;
      })
      .addCase(getChatList.rejected, (state, action) => {
        state.loading.getChatList = false;
        state.error = action.payload as string;
      })
      
      // Mark Messages as Read
      .addCase(markMessagesAsRead.pending, (state) => {
        state.loading.markAsRead = true;
        state.error = null;
      })
      .addCase(markMessagesAsRead.fulfilled, (state, action) => {
        state.loading.markAsRead = false;
      })
      .addCase(markMessagesAsRead.rejected, (state, action) => {
        state.loading.markAsRead = false;
        state.error = action.payload as string;
      })
      
      .addCase(getUnreadCount.pending, (state) => {
        state.loading.getUnreadCount = true;
        state.error = null;
      })
      .addCase(getUnreadCount.fulfilled, (state, action) => {
        state.loading.getUnreadCount = false;
        state.unreadCount = action.payload;
      })
      .addCase(getUnreadCount.rejected, (state, action) => {
        state.loading.getUnreadCount = false;
        state.error = action.payload as string;
      })
      
      .addCase(deleteMessage.pending, (state) => {
        state.loading.deleteMessage = true;
        state.error = null;
      })
      .addCase(deleteMessage.fulfilled, (state, action) => {
        state.loading.deleteMessage = false;
        // Message removal will be handled by removeMessage action
      })
      .addCase(deleteMessage.rejected, (state, action) => {
        state.loading.deleteMessage = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  setCurrentChatUserId,
  addMessage,
  updateMessageReadStatus,
  removeMessage,
  clearCurrentChatHistory,
} = chatSlice.actions;

export default chatSlice.reducer;