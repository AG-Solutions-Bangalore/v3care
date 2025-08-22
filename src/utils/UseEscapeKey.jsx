import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const UseEscapeKey = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Track the current location
  const isNavigating = useRef(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !isNavigating.current) {
        isNavigating.current = true;

        // Navigate back
        navigate(-1);

        // Use a timeout to reset the navigation state
        setTimeout(() => {
          isNavigating.current = false;
        }, 0); // Set to 0 to allow immediate reset on next render
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [navigate, location]); // Include location as a dependency

  return null; // Since this hook doesn't render anything
};

export default UseEscapeKey;
