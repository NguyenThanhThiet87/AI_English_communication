import React from 'react';
import type { ChatMessage } from '../types';

interface RightSidebarProps {
  activeMessageFeedback?: ChatMessage | null;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({ activeMessageFeedback }) => {
  return (
    <aside className="fixed right-0 top-0 h-full w-[20%] bg-surface-container-low z-50 flex flex-col pt-16 shadow-[-1px_0_8px_rgba(0,0,0,0.02)]">
      <div className="p-sm flex flex-col h-full">
        <div className="mb-md border-b border-outline-variant pb-xs">
          <h3 className="text-headline-md text-on-surface">Feedback</h3>
          <p className="text-label-sm text-outline">Real-time analysis</p>
        </div>
        
        <div className="flex-1 flex flex-col gap-md">
          <div className="p-sm rounded-xl bg-surface-container-lowest shadow-sm border border-outline-variant/30 flex flex-col gap-xs">
            <div className="flex justify-between items-center">
              <span className="text-label-md font-bold">Active Feedback</span>
              <span className="w-2 h-2 rounded-full bg-error animate-pulse"></span>
            </div>
            <div className="text-sm text-on-surface-variant italic">
              {activeMessageFeedback ? "Analyzed recent speech" : "Analyzing speech patterns..."}
            </div>
          </div>
          
          {activeMessageFeedback && activeMessageFeedback.corrected_text ? (
            <div className="flex-1 flex flex-col gap-sm overflow-y-auto">
               <div className="p-sm bg-error-container/20 border border-error/30 rounded-xl">
                 <p className="text-label-sm text-error font-bold uppercase mb-1">Score</p>
                 <p className="text-headline-md font-bold text-error">{activeMessageFeedback.fluency_score}/100</p>
               </div>
               
               <div className="p-sm bg-surface-container-lowest rounded-xl border border-outline-variant/30">
                 <p className="text-label-sm text-outline uppercase mb-1">Correction</p>
                 <p className="text-body-md text-on-surface">{activeMessageFeedback.corrected_text}</p>
               </div>
               
               {activeMessageFeedback.natural_expression && (
                 <div className="p-sm bg-tertiary-fixed rounded-xl border border-tertiary/30">
                   <p className="text-label-sm text-on-tertiary-fixed font-bold uppercase flex items-center gap-1 mb-1">
                     <span className="material-symbols-outlined text-[16px]">lightbulb</span> Tip
                   </p>
                   <p className="text-body-md text-on-tertiary-fixed">{activeMessageFeedback.natural_expression}</p>
                 </div>
               )}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center border-2 border-dashed border-outline-variant rounded-xl p-md text-center text-outline text-label-md italic">
              Metrics and mistake corrections will appear here during conversation
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
