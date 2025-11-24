import { useEffect, useState } from "react";

const DevToolsBlocker = () => {
  const [authorized, setAuthorized] = useState(false);
  const [devtoolsOpen, setDevtoolsOpen] = useState(false);

  const PASSWORD = import.meta.env.VITE_DEVTOOLS_PASSWORD || "v3care"; 

  useEffect(() => {
    const detectDevTools = () => {
      const threshold = 160;
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;

      return widthThreshold || heightThreshold;
    };

    const interval = setInterval(() => {
      const isOpen = detectDevTools();

      if (isOpen && !devtoolsOpen && !authorized) {
        setDevtoolsOpen(true);

        const pwd = prompt("DevTools detected! Enter password to continue:");

        if (pwd?.trim() === PASSWORD) {
          alert("Access Granted");
          setAuthorized(true);
        } else {
          alert("Access Denied! DevTools will be disabled.");
          window.location.reload();
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [authorized, devtoolsOpen]);

  return null;
};

export default DevToolsBlocker;
