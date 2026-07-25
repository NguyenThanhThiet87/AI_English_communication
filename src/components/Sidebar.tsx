import React from 'react';
import type { Topic } from '../types';

interface SidebarProps {
  topics: Topic[];
  selectedTopicId: string;
  onSelectTopic: (topicId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ topics, selectedTopicId, onSelectTopic }) => {
  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-full w-[20%] bg-surface-container-low z-50 flex-col pt-16 overflow-y-auto shadow-[1px_0_8px_rgba(0,0,0,0.02)]">
      <div className="p-sm flex flex-col gap-md">
        <nav className="flex flex-col gap-base">
          <p className="px-sm py-base text-label-sm uppercase tracking-wider text-outline">Categories</p>
          {topics.map((t) => {
            const isActive = t.id === selectedTopicId;
            return (
              <a
                key={t.id}
                onClick={(e) => { e.preventDefault(); onSelectTopic(t.id); }}
                href="#"
                className={`flex items-center gap-sm px-sm py-xs rounded-lg transition-all ${
                  isActive 
                    ? 'bg-primary-container text-on-primary-container font-bold'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-body-lg">
                  {t.id === 'daily-life' ? 'forum' : t.id === 'travel' ? 'flight' : t.id === 'business-meeting' ? 'business_center' : t.id === 'restaurant' ? 'restaurant' : 'school'}
                </span>
                {t.title}
              </a>
            );
          })}
        </nav>

        <div className="flex flex-col gap-base">
          <p className="px-sm py-base text-label-sm uppercase tracking-wider text-outline">History</p>
          <div className="flex flex-col gap-xs px-sm">
            <div className="text-label-md text-on-surface">Mock Interview <span className="text-tertiary">★★★★★</span></div>
            <div className="text-label-md text-on-surface">Ordering Food <span className="text-tertiary">★★★★</span></div>
          </div>
        </div>

        <div className="flex flex-col gap-base">
          <p className="px-sm py-base text-label-sm uppercase tracking-wider text-outline">Stats</p>
          <div className="px-sm flex flex-col gap-xs">
            <div className="flex justify-between items-center text-label-md">
              <span>Grammar</span>
              <span className="text-primary font-bold">82%</span>
            </div>
            <div className="flex justify-between items-center text-label-md">
              <span>Vocabulary</span>
              <span className="text-secondary font-bold">75%</span>
            </div>
            <div className="flex justify-between items-center text-label-md">
              <span>Fluency</span>
              <span className="text-tertiary font-bold">91%</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
