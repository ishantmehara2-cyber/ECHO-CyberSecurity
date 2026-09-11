import { useState, useEffect, useRef } from 'react';
import { FileText, Loader2, CheckCircle2 } from 'lucide-react';

interface TypedInvestigationStoryProps {
  customText?: string;
  onAnimationComplete?: () => void;
}

const DEFAULT_STORY_TEXT = `Upload telemetry evidence to begin investigation and reconstruct attack sequence across data silos.`;

export const TypedInvestigationStory = ({
  customText,
  onAnimationComplete
}: TypedInvestigationStoryProps) => {
  const storyText = customText || DEFAULT_STORY_TEXT;

  const [displayedText, setDisplayedText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(true);
  const hasAnimatedRef = useRef<boolean>(false);

  useEffect(() => {
    // Prevent re-triggering animation if already completed for same text
    if (hasAnimatedRef.current) {
      setDisplayedText(storyText);
      setIsTyping(false);
      return;
    }

    const words = storyText.split(' ');
    let currentWordIdx = 0;

    const interval = setInterval(() => {
      if (currentWordIdx < words.length) {
        setDisplayedText(words.slice(0, currentWordIdx + 1).join(' '));
        currentWordIdx++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
        hasAnimatedRef.current = true;
        if (onAnimationComplete) {
          onAnimationComplete();
        }
      }
    }, 60);

    return () => clearInterval(interval);
  }, [storyText, onAnimationComplete]);

  return (
    <div className="p-6 sm:p-8 bg-dark-900 border border-cyan-900/80 rounded-2xl shadow-2xl space-y-4 relative overflow-hidden font-sans">
      {/* Top Header & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-dark-800 pb-3">
        <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
          <FileText className="w-4 h-4 text-cyan-400" />
          ANALYST INVESTIGATION STORY
        </h3>

        {/* Live Typing / Complete Status */}
        <div className="flex items-center gap-2 font-mono text-xs">
          {isTyping ? (
            <span className="flex items-center gap-2 text-cyan-400 font-bold bg-cyan-950/80 border border-cyan-800/60 px-3 py-1 rounded-full text-[11px] animate-pulse">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ● ECHO is reconstructing the incident...
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold bg-emerald-950/80 border border-emerald-800/60 px-3 py-1 rounded-full text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              ✓ RECONSTRUCTION COMPLETE
            </span>
          )}
        </div>
      </div>

      {/* Main Story Paragraph - Large Font for Presentations */}
      <div className="pt-2">
        <p className="text-base sm:text-lg lg:text-xl text-slate-100 font-sans leading-relaxed sm:leading-loose tracking-wide font-normal">
          {displayedText}
          {isTyping && (
            <span className="inline-block w-2 h-5 ml-1 bg-cyan-400 animate-pulse align-middle font-mono font-bold text-cyan-400">
              ▋
            </span>
          )}
        </p>
      </div>
    </div>
  );
};
