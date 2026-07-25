import React from 'react';

interface SessionSummaryProps {
  onBackToTopics: () => void;
  onNewSession: () => void;
}

export const SessionSummary: React.FC<SessionSummaryProps> = ({ onBackToTopics, onNewSession }) => {
  return (
    <div className="flex flex-col w-full animate-[fadeIn_0.5s_ease-out]">
      {/* Success Celebration Hero */}
      <section className="relative overflow-hidden pt-lg pb-xl px-md">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[60%] bg-primary/5 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[60%] bg-secondary/5 rounded-full blur-[120px] animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
        <div className="relative z-10 max-w-max-width mx-auto">
          <div className="flex flex-col gap-sm mb-lg">
            <div className="flex items-center gap-xs">
              <span className="px-xs py-1 rounded-full bg-primary/10 text-primary font-label-md text-label-sm uppercase tracking-widest">Session Summary</span>
              <div className="h-px flex-1 bg-gradient-to-r from-primary/20 to-transparent"></div>
            </div>
            <h1 className="font-display-lg text-display-lg text-on-background max-w-2xl">
              Fantastic conversation! You've reached <span className="text-primary italic">B1+ Proficiency</span> today.
            </h1>
          </div>
          
          {/* Bento Stats Grid */}
          <div className="grid grid-cols-12 gap-sm auto-rows-[140px]">
            {/* Main Score */}
            <div className="col-span-12 md:col-span-4 row-span-2 bg-primary rounded-xl p-md flex flex-col justify-between text-on-primary shadow-xl relative overflow-hidden group">
              <div className="relative z-10">
                <p className="font-label-sm text-on-primary/70 uppercase tracking-widest mb-xs">Overall Performance</p>
                <div className="font-display-lg text-[84px] leading-none mb-base">88%</div>
                <p className="font-body-md text-on-primary/90">Your fluency is peaking. Keep practicing these complex sentence structures!</p>
              </div>
              <div className="absolute bottom-[-20px] right-[-20px] opacity-10 group-hover:scale-110 transition-transform duration-700">
                <span className="material-symbols-outlined text-[200px]" style={{fontVariationSettings: "'FILL' 1"}}>workspace_premium</span>
              </div>
              <div className="relative z-10 flex gap-xs mt-md">
                <div className="h-1 flex-1 bg-on-primary/20 rounded-full overflow-hidden">
                  <div className="h-full bg-on-primary w-[88%] transition-all duration-1000 delay-300"></div>
                </div>
              </div>
            </div>
            
            {/* Duration & Turns */}
            <div className="col-span-6 md:col-span-3 bg-surface-container-low rounded-xl p-md flex flex-col justify-between shadow-sm border border-outline-variant/20">
              <div className="flex justify-between items-start">
                <span className="material-symbols-outlined text-primary">timer</span>
                <span className="text-label-sm text-outline font-bold">+3m vs avg</span>
              </div>
              <div>
                <div className="font-display-lg text-display-lg leading-none">18m</div>
                <p className="text-label-md text-on-surface-variant">Session Duration</p>
              </div>
            </div>
            <div className="col-span-6 md:col-span-2 bg-surface-container-low rounded-xl p-md flex flex-col justify-between shadow-sm border border-outline-variant/20">
              <div className="flex justify-between items-start">
                <span className="material-symbols-outlined text-secondary">forum</span>
              </div>
              <div>
                <div className="font-display-lg text-display-lg leading-none">32</div>
                <p className="text-label-md text-on-surface-variant">Turns Taken</p>
              </div>
            </div>
            
            {/* Progress Mini Charts */}
            <div className="col-span-12 md:col-span-3 bg-surface-container-low rounded-xl p-md flex flex-col justify-between shadow-sm border border-outline-variant/20">
              <p className="text-label-sm text-outline uppercase tracking-widest">Grammar Accuracy</p>
              <div className="flex items-end gap-1 h-12">
                <div className="flex-1 bg-primary/10 rounded-t-sm h-[40%]"></div>
                <div className="flex-1 bg-primary/10 rounded-t-sm h-[60%]"></div>
                <div className="flex-1 bg-primary/20 rounded-t-sm h-[55%]"></div>
                <div className="flex-1 bg-primary/30 rounded-t-sm h-[75%]"></div>
                <div className="flex-1 bg-primary rounded-t-sm h-[88%] transition-all duration-1000"></div>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-display-lg text-headline-md text-primary">88</span>
                <span className="material-symbols-outlined text-primary text-sm">trending_up</span>
              </div>
            </div>
            
            {/* Row 2 */}
            <div className="col-span-6 md:col-span-3 bg-surface-container-low rounded-xl p-md flex flex-col justify-between shadow-sm border border-outline-variant/20">
              <div className="flex justify-between items-start">
                <span className="material-symbols-outlined text-tertiary">menu_book</span>
                <span className="px-2 py-0.5 rounded-full bg-tertiary/10 text-tertiary text-[10px] font-bold">NEW PEAK</span>
              </div>
              <div>
                <div className="font-display-lg text-display-lg leading-none">85</div>
                <p className="text-label-md text-on-surface-variant">Vocab Variety</p>
              </div>
            </div>
            <div className="col-span-6 md:col-span-2 bg-surface-container-low rounded-xl p-md flex flex-col justify-between shadow-sm border border-outline-variant/20">
              <div className="flex justify-between items-start">
                <span className="material-symbols-outlined text-error">auto_fix_high</span>
              </div>
              <div>
                <div className="font-display-lg text-display-lg leading-none">9</div>
                <p className="text-label-md text-on-surface-variant">Fixed Errors</p>
              </div>
            </div>
            <div className="col-span-12 md:col-span-3 bg-secondary-container text-on-secondary-container rounded-xl p-md flex flex-col justify-between shadow-lg">
              <div className="flex justify-between items-center">
                <span className="font-label-sm uppercase tracking-widest text-on-secondary-container/70">Fluency Score</span>
                <span className="material-symbols-outlined">bolt</span>
              </div>
              <div className="flex items-baseline gap-xs">
                <span className="font-display-lg text-[48px]">90</span>
                <span className="text-label-md">/100</span>
              </div>
              <div className="h-1 w-full bg-on-secondary-container/20 rounded-full overflow-hidden">
                <div className="h-full bg-on-secondary-container w-[90%]"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Split: Mistakes vs Vocabulary */}
      <section className="max-w-max-width mx-auto w-full px-md pb-xl">
        <div className="grid grid-cols-12 gap-lg">
          {/* Common Mistakes Section */}
          <div className="col-span-12 lg:col-span-7 flex flex-col gap-md">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-headline-md text-on-surface">Common Mistakes</h3>
                <p className="text-label-md text-outline">Refine these to reach B2</p>
              </div>
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-error/10 flex items-center justify-center text-error border-2 border-surface">
                  <span className="material-symbols-outlined text-sm">close</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary border-2 border-surface">
                  <span className="material-symbols-outlined text-sm">check</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-sm">
              <div className="group p-sm bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 hover:shadow-md transition-all opacity-100 translate-y-0">
                <div className="flex items-start gap-sm">
                  <div className="mt-1 w-2 h-2 rounded-full bg-error"></div>
                  <div className="flex-1">
                    <p className="text-on-surface-variant font-body-md line-through opacity-60">"I have gone to London last year."</p>
                    <div className="flex items-center gap-xs my-xs">
                      <span className="material-symbols-outlined text-primary text-md">arrow_downward</span>
                      <span className="text-label-sm font-bold text-primary uppercase tracking-tighter">Correction</span>
                    </div>
                    <p className="text-on-surface font-headline-md text-[18px]">"I <span className="text-primary font-bold">went</span> to London last year."</p>
                    <p className="mt-xs text-label-sm text-outline bg-surface-container-high/50 p-xs rounded italic">Past Simple is used for finished time actions.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* New Vocabulary Section */}
          <div className="col-span-12 lg:col-span-5 flex flex-col gap-md">
            <div className="bg-surface-container rounded-2xl p-md h-full flex flex-col">
              <div className="mb-md">
                <h3 className="font-headline-md text-on-surface">New Vocabulary</h3>
                <p className="text-label-md text-outline">Words added to your deck</p>
              </div>
              <div className="flex flex-wrap gap-xs mb-lg">
                <div className="px-sm py-xs bg-surface-container-lowest rounded-full border border-outline-variant/50 text-label-md font-bold flex items-center gap-xs hover:scale-105 transition-transform cursor-default">
                  Collaborative <span className="material-symbols-outlined text-[14px] text-tertiary">star</span>
                </div>
                <div className="px-sm py-xs bg-surface-container-lowest rounded-full border border-outline-variant/50 text-label-md font-bold flex items-center gap-xs hover:scale-105 transition-transform cursor-default">
                  Framework
                </div>
              </div>
              <div className="flex-1 rounded-xl bg-surface-container-lowest/50 p-sm border border-dashed border-outline-variant/50">
                <div className="flex flex-col items-center justify-center h-full text-center py-md">
                  <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary mb-sm">
                    <span className="material-symbols-outlined">quiz</span>
                  </div>
                  <p className="text-label-md font-bold text-on-surface mb-base">Ready to test these?</p>
                  <p className="text-label-sm text-outline mb-md">Take a 2-minute quiz to lock in these new terms.</p>
                  <button className="w-full py-xs bg-secondary text-on-secondary rounded-lg font-label-md hover:brightness-110 transition-all">Start Quiz</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-max-width mx-auto w-full px-md pb-xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-md p-lg bg-surface-container-highest/30 rounded-[32px] border border-outline-variant/20">
          <div className="flex items-center gap-md">
            <div className="flex flex-col">
              <h4 className="font-headline-md text-on-surface">Up for another round?</h4>
              <p className="text-body-md text-on-surface-variant">Your momentum is high. Let's keep the streak alive.</p>
            </div>
          </div>
          <div className="flex items-center gap-sm w-full md:w-auto">
            <button onClick={onBackToTopics} className="flex-1 md:flex-none px-xl py-sm bg-surface-container-lowest text-on-surface border border-outline-variant rounded-full font-label-md hover:bg-surface-container-high transition-all flex items-center justify-center gap-xs">
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              Back to Topics
            </button>
            <button onClick={onNewSession} className="flex-1 md:flex-none px-xl py-sm bg-primary text-on-primary rounded-full font-label-md shadow-lg shadow-primary/20 hover:scale-105 transition-all flex items-center justify-center gap-xs">
              New Session
              <span className="material-symbols-outlined text-[20px]">keyboard_double_arrow_right</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
