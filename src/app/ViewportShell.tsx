import React, { ReactNode, useLayoutEffect, useRef } from 'react';
import { computeStageScale } from './stage';

interface ViewportShellProps {
  children: ReactNode;
}

/**
 * Owns the single 1280x720 logical stage used by every screen.
 *
 * The frame is the responsive 16:9 fit box. The stage never reflows: it is
 * scaled uniformly from its top-left origin, matching the authored desktop
 * layout at 1280x720 and shrinking intact at smaller desktop windows.
 */
export const ViewportShell: React.FC<ViewportShellProps> = ({ children }) => {
  const frameRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const updateScale = () => {
      const scale = computeStageScale(frame.clientWidth, frame.clientHeight);
      frame.style.setProperty('--stage-scale', String(scale));
    };

    updateScale();

    const observer = new ResizeObserver(updateScale);
    observer.observe(frame);
    window.addEventListener('resize', updateScale);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateScale);
    };
  }, []);

  return (
    <div className="viewport-frame" ref={frameRef}>
      <div className="viewport-stage">{children}</div>
      <div className="viewport-edge" aria-hidden="true" />
    </div>
  );
};
