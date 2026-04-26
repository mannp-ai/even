import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PactState {
  activeGroupId: string | null;
  setActiveGroupId: (id: string | null) => void;
  // UI states
  isAddExpenseOpen: boolean;
  setAddExpenseOpen: (isOpen: boolean) => void;
}

export const usePactStore = create<PactState>()(
  persist(
    (set) => ({
      activeGroupId: null,
      setActiveGroupId: (id) => set({ activeGroupId: id }),
      isAddExpenseOpen: false,
      setAddExpenseOpen: (isOpen) => set({ isAddExpenseOpen: isOpen }),
    }),
    {
      name: 'pact-storage',
    }
  )
);
