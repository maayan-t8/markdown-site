import { useEffect, useRef, useCallback } from "react";
import { useMutation } from "convex/react";
import { useLocation } from "react-router-dom";
import { api } from "../../convex/_generated/api";

// Heartbeat interval: 30 seconds
const HEARTBEAT_INTERVAL_MS = 30 * 1000;

// Minimum time between heartbeats to prevent write conflicts: 5 seconds
const HEARTBEAT_DEBOUNCE_MS = 5 * 1000;

// Session ID key in localStorage
const SESSION_ID_KEY = "markdown_blog_session_id";

/**
 * Generate a random session ID (UUID v4 format)
 */
function generateSessionId(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Get or create a persistent session ID
 */
function getSessionId(): string {
  if (typeof window === "undefined") {
    return generateSessionId();
  }

  let sessionId = localStorage.getItem(SESSION_ID_KEY);
  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem(SESSION_ID_KEY, sessionId);
  }
  return sessionId;
}

/**
 * Determine page type from path
 */
function getPageType(path: string): string {
  if (path === "/" || path === "") {
    return "home";
  }
  if (path === "/stats") {
    return "stats";
  }
  // Could be a blog post or static page
  return "page";
}

/**
 * Hook to track page views and maintain active session presence
 */
export function usePageTracking(): void {
  const location = useLocation();
  const recordPageView = useMutation(api.stats.recordPageView);
  const heartbeatMutation = useMutation(api.stats.heartbeat);

  // Track if we've recorded view for current path
  const lastRecordedPath = useRef<string | null>(null);
  const sessionIdRef = useRef<string | null>(null);

  // Track heartbeat state to prevent duplicate calls and write conflicts
  const isHeartbeatPending = useRef(false);
  const lastHeartbeatTime = useRef(0);
  const lastHeartbeatPath = useRef<string | null>(null);

  // Initialize session ID
  useEffect(() => {
    sessionIdRef.current = getSessionId();
  }, []);

  // Debounced heartbeat function to prevent write conflicts
  const sendHeartbeat = useCallback(
    async (path: string) => {
      const sessionId = sessionIdRef.current;
      if (!sessionId) return;

      const now = Date.now();

      // Skip if heartbeat is already pending
      if (isHeartbeatPending.current) {
        return;
      }

      // Skip if same path and sent recently (debounce)
      if (
        lastHeartbeatPath.current === path &&
        now - lastHeartbeatTime.current < HEARTBEAT_DEBOUNCE_MS
      ) {
        return;
      }

      isHeartbeatPending.current = true;
      lastHeartbeatTime.current = now;
      lastHeartbeatPath.current = path;

      try {
        await heartbeatMutation({
          sessionId,
          currentPath: path,
        });
      } catch {
        // Silently fail - analytics shouldn't break the app
      } finally {
        isHeartbeatPending.current = false;
      }
    },
    [heartbeatMutation]
  );

  // Record page view when path changes
  useEffect(() => {
    const path = location.pathname;
    const sessionId = sessionIdRef.current;

    if (!sessionId) return;

    // Only record if path changed
    if (lastRecordedPath.current !== path) {
      lastRecordedPath.current = path;

      recordPageView({
        path,
        pageType: getPageType(path),
        sessionId,
      }).catch(() => {
        // Silently fail - analytics shouldn't break the app
      });
    }
  }, [location.pathname, recordPageView]);

  // Send heartbeat on interval and on path change
  useEffect(() => {
    const path = location.pathname;

    // Send initial heartbeat for this path
    sendHeartbeat(path);

    // Set up interval for ongoing heartbeats
    const intervalId = setInterval(() => {
      sendHeartbeat(path);
    }, HEARTBEAT_INTERVAL_MS);

    return () => {
      clearInterval(intervalId);
    };
  }, [location.pathname, sendHeartbeat]);
}

