import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

const SHOW_MS = 520;
const FADE_MS = 280;

export function usePageTransition() {
  const location = useLocation();
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const isFirst = useRef(true);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    if (visible || leaving) document.body.classList.add("page-loading");
    else document.body.classList.remove("page-loading");
    return () => document.body.classList.remove("page-loading");
  }, [visible, leaving]);

  useEffect(() => {
    const clearTimers = () => {
      for (const id of timers.current) window.clearTimeout(id);
      timers.current = [];
    };

    const hide = () => {
      setLeaving(true);
      timers.current.push(
        window.setTimeout(() => {
          setVisible(false);
          setLeaving(false);
        }, FADE_MS),
      );
    };

    const showThenHide = (delay = SHOW_MS) => {
      setVisible(true);
      setLeaving(false);
      timers.current.push(window.setTimeout(hide, delay));
    };

    clearTimers();

    if (isFirst.current) {
      isFirst.current = false;
      const startHide = () => showThenHide(SHOW_MS);
      if (document.readyState === "complete") startHide();
      else window.addEventListener("load", startHide, { once: true });
      return clearTimers;
    }

    showThenHide(SHOW_MS);
    return clearTimers;
  }, [location.pathname, location.key]);

  return { visible, leaving };
}
