"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type SlideDrawerProps = {
  ariaLabel: string;
  backdropClassName?: string;
  children: ReactNode;
  durationMs?: number;
  onClose: () => void;
  open: boolean;
  panelClassName?: string;
  side?: "left" | "right";
  viewportClassName?: string;
};

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

let bodyLockCount = 0;
let previousBodyOverflow = "";
let previousBodyPaddingRight = "";

function lockBodyScroll() {
  if (typeof document === "undefined") {
    return () => undefined;
  }

  if (bodyLockCount === 0) {
    previousBodyOverflow = document.body.style.overflow;
    previousBodyPaddingRight = document.body.style.paddingRight;

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";

    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
  }

  bodyLockCount += 1;

  return () => {
    bodyLockCount = Math.max(0, bodyLockCount - 1);

    if (bodyLockCount === 0) {
      document.body.style.overflow = previousBodyOverflow;
      document.body.style.paddingRight = previousBodyPaddingRight;
    }
  };
}

function getFocusableElements(container: HTMLElement | null) {
  if (!container) {
    return [];
  }

  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (element) =>
      !element.hasAttribute("disabled") &&
      element.getAttribute("aria-hidden") !== "true" &&
      element.getClientRects().length > 0
  );
}

export function SlideDrawer({
  ariaLabel,
  backdropClassName,
  children,
  durationMs = 250,
  onClose,
  open,
  panelClassName,
  side = "right",
  viewportClassName,
}: SlideDrawerProps) {
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(open);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<number | null>(null);
  const restoreFocusTimeoutRef = useRef<number | null>(null);
  const mountFrameRef = useRef<number | null>(null);
  const showFrameRef = useRef<number | null>(null);
  const hideFrameRef = useRef<number | null>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const previousOpenRef = useRef(open);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current !== null) {
        window.clearTimeout(closeTimeoutRef.current);
      }

      if (restoreFocusTimeoutRef.current !== null) {
        window.clearTimeout(restoreFocusTimeoutRef.current);
      }

      if (mountFrameRef.current !== null) {
        window.cancelAnimationFrame(mountFrameRef.current);
      }

      if (showFrameRef.current !== null) {
        window.cancelAnimationFrame(showFrameRef.current);
      }

      if (hideFrameRef.current !== null) {
        window.cancelAnimationFrame(hideFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (open) {
      if (!previousOpenRef.current) {
        openerRef.current =
          document.activeElement instanceof HTMLElement ? document.activeElement : null;
      }

      if (closeTimeoutRef.current !== null) {
        window.clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = null;
      }

      if (restoreFocusTimeoutRef.current !== null) {
        window.clearTimeout(restoreFocusTimeoutRef.current);
        restoreFocusTimeoutRef.current = null;
      }

      if (hideFrameRef.current !== null) {
        window.cancelAnimationFrame(hideFrameRef.current);
        hideFrameRef.current = null;
      }

      if (mounted) {
        showFrameRef.current = window.requestAnimationFrame(() => {
          setVisible(true);
          showFrameRef.current = null;
        });
      } else {
        mountFrameRef.current = window.requestAnimationFrame(() => {
          setMounted(true);
          mountFrameRef.current = null;
          showFrameRef.current = window.requestAnimationFrame(() => {
            setVisible(true);
            showFrameRef.current = null;
          });
        });
      }

      previousOpenRef.current = true;

      return () => {
        if (mountFrameRef.current !== null) {
          window.cancelAnimationFrame(mountFrameRef.current);
          mountFrameRef.current = null;
        }

        if (showFrameRef.current !== null) {
          window.cancelAnimationFrame(showFrameRef.current);
          showFrameRef.current = null;
        }
      };
    }

    if (!previousOpenRef.current) {
      return;
    }

    hideFrameRef.current = window.requestAnimationFrame(() => {
      setVisible(false);
      hideFrameRef.current = null;
    });

    closeTimeoutRef.current = window.setTimeout(() => {
      setMounted(false);
      closeTimeoutRef.current = null;
    }, durationMs);

    restoreFocusTimeoutRef.current = window.setTimeout(() => {
      const opener = openerRef.current;

      if (opener && document.contains(opener)) {
        opener.focus({ preventScroll: true });
      }

      restoreFocusTimeoutRef.current = null;
    }, durationMs);
    previousOpenRef.current = false;
  }, [durationMs, mounted, open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const releaseBodyLock = lockBodyScroll();
    const frame = window.requestAnimationFrame(() => {
      const focusableElements = getFocusableElements(panelRef.current);
      const firstFocusable = focusableElements[0];

      if (firstFocusable) {
        firstFocusable.focus({ preventScroll: true });
      } else {
        panelRef.current?.focus({ preventScroll: true });
      }
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusableElements = getFocusableElements(panelRef.current);

      if (!focusableElements.length) {
        event.preventDefault();
        panelRef.current?.focus({ preventScroll: true });
        return;
      }

      const firstFocusable = focusableElements[0];
      const lastFocusable = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstFocusable) {
        event.preventDefault();
        lastFocusable.focus();
      } else if (!event.shiftKey && document.activeElement === lastFocusable) {
        event.preventDefault();
        firstFocusable.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      releaseBodyLock();
      window.cancelAnimationFrame(frame);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open]);

  if (!mounted) {
    return null;
  }

  const hiddenTransform = side === "left" ? "-translate-x-full" : "translate-x-full";
  const sideClassName = side === "left" ? "left-0" : "right-0";

  return (
    <div
      className={[
        "fixed overflow-hidden",
        open ? "pointer-events-auto" : "pointer-events-none",
        viewportClassName ?? "inset-0 z-[80]",
      ].join(" ")}
      aria-hidden={!open}
    >
      <button
        type="button"
        aria-label={`${ariaLabel} - დახურვა`}
        onClick={onClose}
        tabIndex={open ? 0 : -1}
        className={[
          "absolute inset-0 transition-opacity ease-out",
          visible ? "opacity-100" : "opacity-0",
          backdropClassName ?? "bg-[#041C32]/55",
        ].join(" ")}
        style={{ transitionDuration: `${durationMs}ms` }}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        tabIndex={-1}
        className={[
          "absolute inset-y-0 flex flex-col outline-none transition-[transform,opacity] ease-out will-change-transform",
          sideClassName,
          visible ? "translate-x-0 opacity-100" : `${hiddenTransform} opacity-0`,
          panelClassName ?? "",
        ].join(" ")}
        style={{ transitionDuration: `${durationMs}ms` }}
      >
        {children}
      </div>
    </div>
  );
}
