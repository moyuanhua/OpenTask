import { create } from 'zustand';

interface UiState {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
}

export const useUiStore = create<UiState>((set) => ({
  isSidebarOpen: true,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  selectedProjectId: null,
  setSelectedProjectId: (id) => set({ selectedProjectId: id }),
}));