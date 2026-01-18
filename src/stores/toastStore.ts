import { create } from 'zustand';

interface ToastState {
  visible: boolean;
  message: string;
  undoAction: (() => void) | null;
  showToast: (message: string, undoAction?: () => void) => void;
  hideToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  visible: false,
  message: '',
  undoAction: null,

  showToast: (message, undoAction) => {
    set({
      visible: true,
      message,
      undoAction: undoAction ?? null,
    });
  },

  hideToast: () => {
    set({
      visible: false,
      message: '',
      undoAction: null,
    });
  },
}));
