// components/TabSwitcher.tsx
import React from 'react';
import { Typography } from "@material-tailwind/react";
import { useTabStore } from '@/lib/tab-store';

interface Tab {
  id: string;
  name: string;
  count?: number; // Optional for cases with dataStats
}

interface TabSwitcherProps {
  tabs: Tab[];
  dataStats?: Record<string, number>; // Optional for displaying counts
  onTabChange: (tab: string | null) => void;
  allTabLabel?: string; // Customizable "All" tab label
  showAllTab?: boolean; // Whether to show "All" tab
  showTabStats?: boolean; // Whether to show "All" tab
  loading?: boolean; // Optional loading state to disable clicks
  context: string; // Context identifier for tab state
}

const TabSwitcher: React.FC<TabSwitcherProps> = ({
  tabs,
  dataStats,
  onTabChange,
  allTabLabel = "Semua",
  showAllTab = true,
  showTabStats = true,
  loading = false,
  context,
}) => {
  const { contexts, setActiveTab } = useTabStore();
  const activeTab = contexts[context]?.activeTab || (showAllTab ? 'all' : tabs[0]?.id || '');
  const tabOrder = showAllTab ? ['all', ...tabs.map(t => t.id)] : tabs.map(t => t.id);

  const handleTabClick = (tabId: string) => {
    if (!loading) {
      setActiveTab(context, tabId, tabOrder);
      onTabChange(tabId === 'all' ? null : tabId);
    }
  };

  return (
    <div
      className="flex flex-row xl:gap-1 sm:gap-1 overflow-x-auto overflow-y-hidden w-full sm:justify-around lg:justify-start whitespace-nowrap"
    >
      {showAllTab && (
        <div
          className="w-fit"
          onClick={() => {
            if (activeTab !== "all")
              handleTabClick("all")
          }}
        >
          <Typography
            className={`pb-1 sm:w-fit sm:text-xxxs md:text-sm lg:text-sm text-center hover:cursor-pointer sm:leading-xxxs lg:leading-normal ${activeTab === "all" && !loading
              ? "text-primary font-medium border-b-2 border-primary"
              : "text-gray-light hover:text-primary"
              }`}
          >
            <>
              <span className="block lg:hidden">{allTabLabel} {showTabStats && dataStats && dataStats["all"] !== undefined ? `(${dataStats["all"]})` : '(0)'}</span>
              <span className="hidden lg:block">&nbsp;&nbsp;{allTabLabel} {showTabStats && dataStats && dataStats["all"] !== undefined ? `(${dataStats["all"]})` : '(0)'}&nbsp;&nbsp;</span>
            </>
          </Typography>
        </div>
      )}
      {tabs.map((row, i) => (
        <div key={i}
          className={`rounded-t-md min-w-36 min-h-10 bg-[#EFE2FF] flex flex-col justify-center ${activeTab === row.id && !loading
              ? "bg-primary"
              : "bg-[#EFE2FF]"
              }`}
          onClick={() => {
            if (activeTab !== row.id)
              handleTabClick(String(row.id))
          }}>
          <Typography
            className={`mx-auto sm:w-fit sm:text-xxxs md:text-sm lg:text-sm text-center hover:cursor-pointer sm:leading-xxxs lg:leading-normal ${activeTab === row.id && !loading
              ? "text-white"
              : "text-primary hover:text-gray-light"
              }`}
          >
            <span className="block lg:hidden">{row.name} {showTabStats && (dataStats && row.id !== undefined ? `(${dataStats[row.id]})` : '(0)')}</span>
            <span className="hidden lg:block">&nbsp;&nbsp;{row.name} {showTabStats && (dataStats && row.id !== undefined ? `(${dataStats[row.id]})` : '(0)')}&nbsp;&nbsp;</span>
          </Typography>
        </div>
      ))}
    </div>
  );
};

export default TabSwitcher;
