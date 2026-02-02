import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearUser } from "../../../app/providers/userSlice";
import { persistor } from "../../../store";

const IDLE_TIMEOUT = 15 * 60 * 1000; // 15 minutes

const SessionManager = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const timerRef = useRef(null);

  const logout = async () => {
    dispatch(clearUser());
    await persistor.purge();
    navigate("/login");
  };

  const resetTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(logout, IDLE_TIMEOUT);
  };

  useEffect(() => {
    const events = [
      "mousemove",
      "mousedown",
      "keydown",
      "scroll",
      "wheel",
      "touchstart"
    ];

    events.forEach(e =>
      window.addEventListener(e, resetTimer, { passive: true })
    );

    resetTimer(); // start timer on mount

    return () => {
      events.forEach(e =>
        window.removeEventListener(e, resetTimer)
      );
      clearTimeout(timerRef.current);
    };
  }, []);

  return children;
};

export default SessionManager;
