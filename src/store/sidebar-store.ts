// Zustand Imports
import { create } from "zustand";

interface ISidebarStore {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  autoCollapse: (collapsed: boolean) => void;
}

export const useSidebarStore = create<ISidebarStore>((set) => ({
  isCollapsed: false,
  toggleSidebar: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
  autoCollapse: (collapsed: boolean) => set({ isCollapsed: collapsed }),
}));
