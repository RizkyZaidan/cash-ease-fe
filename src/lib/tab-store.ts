import { create } from 'zustand';

interface TabContextState {
  activeTab: string;
  prevTab: string;
  isSliding: boolean;
  slideDirection: 'left' | 'right' | null;
}

interface TabState {
  contexts: Record<string, TabContextState>; // Store state for multiple contexts
  setActiveTab: (context: string, tab: string, tabOrder: string[]) => void;
  resetSliding: (context: string) => void;
}

export const useTabStore = create<TabState>((set) => ({
  contexts: {
    report: { activeTab: 'balance', prevTab: 'balance', isSliding: false, slideDirection: null },
  },
  setActiveTab: (context, tab, tabOrder) => {
    set((state) => {
      const currentContext = state.contexts[context] || {
        activeTab: tab,
        prevTab: tab,
        isSliding: false,
        slideDirection: null,
      };
      const currentIndex = tabOrder.indexOf(currentContext.activeTab);
      const newIndex = tabOrder.indexOf(tab);
      return {
        contexts: {
          ...state.contexts,
          [context]: {
            prevTab: currentContext.activeTab,
            activeTab: tab,
            isSliding: true,
            slideDirection: newIndex > currentIndex ? 'right' : 'left',
          },
        },
      };
    });
  },
  resetSliding: (context) => {
    set((state) => ({
      contexts: {
        ...state.contexts,
        [context]: {
          ...state.contexts[context],
          isSliding: false,
        },
      },
    }));
  },
}));
