import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const UseEscapeKey = () => {
  const navigate = useNavigate();
  const location = useLocation(); 
  const isNavigating = useRef(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !isNavigating.current) {
        isNavigating.current = true;

        navigate(-1);

        setTimeout(() => {
          isNavigating.current = false;
        }, 0); 
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [navigate, location]); 

  return null; 
};

export default UseEscapeKey;
