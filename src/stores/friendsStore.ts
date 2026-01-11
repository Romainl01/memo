import { create } from 'zustand';

export interface Friend {
  id: string;
  name: string;
  photoUrl: string | null;
  birthday: string; // ISO date string (YYYY-MM-DD)
  frequencyDays: number;
  lastContactAt: string; // ISO date string (YYYY-MM-DD)
  createdAt: string; // ISO timestamp
}

export type NewFriend = Omit<Friend, 'id' | 'createdAt'>;

interface FriendsState {
  friends: Friend[];
  addFriend: (friend: NewFriend) => void;
  removeFriend: (id: string) => void;
  hasFriend: (name: string) => boolean;
  getFriendById: (id: string) => Friend | undefined;
}

/**
 * Generates a unique ID for a friend
 * Uses timestamp + random string for uniqueness
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export const useFriendsStore = create<FriendsState>((set, get) => ({
  friends: [],

  addFriend: (newFriend: NewFriend) => {
    const friend: Friend = {
      ...newFriend,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      friends: [...state.friends, friend],
    }));
  },

  removeFriend: (id: string) => {
    set((state) => ({
      friends: state.friends.filter((friend) => friend.id !== id),
    }));
  },

  hasFriend: (name: string) => {
    const { friends } = get();
    const normalizedName = name.toLowerCase();
    return friends.some((friend) => friend.name.toLowerCase() === normalizedName);
  },

  getFriendById: (id: string) => {
    const { friends } = get();
    return friends.find((friend) => friend.id === id);
  },
}));
