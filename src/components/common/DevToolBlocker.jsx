// import { useEffect, useState } from "react";

// const DevToolsBlocker = () => {
//   const [authorized, setAuthorized] = useState(false);
//   const [devtoolsOpen, setDevtoolsOpen] = useState(false);

//   const PASSWORD = import.meta.env.VITE_DEVTOOLS_PASSWORD; 

//   useEffect(() => {
//     const detectDevTools = () => {
//       const threshold = 160;
//       const widthThreshold = window.outerWidth - window.innerWidth > threshold;
//       const heightThreshold = window.outerHeight - window.innerHeight > threshold;

//       return widthThreshold || heightThreshold;
//     };

//     const interval = setInterval(() => {
//       const isOpen = detectDevTools();

//       if (isOpen && !devtoolsOpen && !authorized) {
//         setDevtoolsOpen(true);

//         const pwd = prompt("DevTools detected! Enter password to continue:");

//         if (pwd?.trim() === PASSWORD) {
//           alert("Access Granted");
//           setAuthorized(true);
//         } else {
//           alert("Access Denied! DevTools will be disabled.");
//           window.location.reload();
//         }
//       }
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [authorized, devtoolsOpen]);

//   return null;
// };

// export default DevToolsBlocker;
import { useEffect, useState } from "react";

const DevToolsBlocker = () => {
  const [devToolsDetected, setDevToolsDetected] = useState(false);


  useEffect(() => {
    let devtoolsOpen = false;

    function detectDevTools() {

      const threshold = 160;
      const widthInRange = window.innerWidth >= 813 && window.innerWidth <= 815;
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold =
        window.outerHeight - window.innerHeight > threshold;
        let debuggerDetected = false;
      if (!widthInRange) {
        const start = performance.now();
        debugger;
        const end = performance.now();
        if (end - start > 100) {
          debuggerDetected = true;
        }
      }

      return (
        (widthThreshold || heightThreshold || debuggerDetected) && !widthInRange
      );
    }

    const interval = setInterval(() => {
      const isOpen = detectDevTools();

      if (isOpen && !devtoolsOpen) {
        devtoolsOpen = true;
        setDevToolsDetected(true);









      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  if (devToolsDetected) {
    return null;
  }

  return null;
};

export default DevToolsBlocker;