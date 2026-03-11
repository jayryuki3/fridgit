import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

export default function CollapsibleSection({ 
  title, 
  children, 
  defaultOpen = true, 
  showOnMobile = true,
  icon = null,
  className = "" 
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [mobileOpen, setMobileOpen] = useState(defaultOpen);

  const isExpanded = showOnMobile ? mobileOpen : isOpen;

  return (
    <section className={`panel-section ${className}`}>
      {/* Header - always visible */}
      <button
        onClick={() => (showOnMobile ? setMobileOpen(!mobileOpen) : setIsOpen(!isOpen))}
        className="mb-3 flex w-full items-center justify-between text-left"
      >
        <div className="flex items-center gap-2">
          {icon && <span className="text-fridgit-textMuted dark:text-dracula-comment">{icon}</span>}
          <h2 className="text-sm font-semibold uppercase tracking-wide text-fridgit-textMuted dark:text-dracula-comment">
            {title}
          </h2>
        </div>
        {showOnMobile ? (
          <ChevronDown 
            size={18} 
            className={`text-fridgit-textMuted dark:text-dracula-comment transition-transform ${mobileOpen ? 'rotate-180' : ''}`} 
          />
        ) : (
          <ChevronRight 
            size={18} 
            className={`text-fridgit-textMuted dark:text-dracula-comment transition-transform ${isOpen ? 'rotate-90' : ''}`} 
          />
        )}
      </button>

      {/* Content - collapsible on mobile, always visible on desktop */}
      <div className={`${showOnMobile ? '' : 'lg:hidden'} ${!mobileOpen ? 'hidden' : ''}`}>
        {children}
      </div>
      
      {/* Desktop always shows content, but with animation */}
      {!showOnMobile && (
        <div className={`hidden lg:block ${isOpen ? 'animate-in slide-in-from-top-2 fade-in' : 'hidden'}`}>
          {children}
        </div>
      )}
    </section>
  );
}
