import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const LoaderContext = createContext();
const LOADER_SHOW_DELAY_MS = 1000;

export const LoaderProvider = ({ children }) => {
  const [loadCount, setLoadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [disableLoader, setDisableLoader] = useState(false); // ✅ NEW
  const showTimeoutRef = useRef(null);

  // ✅ UPDATED
  const showLoader = useCallback(() => {
    if (disableLoader) return; // 🚀 stop loader for HomePage
    setLoadCount((c) => c + 1);
  }, [disableLoader]);

  const hideLoader = useCallback(() => {
    setLoadCount((c) => Math.max(c - 1, 0));
  }, []);

  useEffect(() => {
    if (disableLoader) {
      setLoading(false);
      return;
    }

    if (loadCount > 0) {
      if (!loading && !showTimeoutRef.current) {
        showTimeoutRef.current = window.setTimeout(() => {
          setLoading(true);
          showTimeoutRef.current = null;
        }, LOADER_SHOW_DELAY_MS);
      }
      return;
    }

    if (showTimeoutRef.current) {
      window.clearTimeout(showTimeoutRef.current);
      showTimeoutRef.current = null;
    }

    setLoading(false);
  }, [loadCount, loading, disableLoader]);

  useEffect(() => {
    return () => {
      if (showTimeoutRef.current) {
        window.clearTimeout(showTimeoutRef.current);
      }
    };
  }, []);

  return (
    <LoaderContext.Provider
      value={{ loading, showLoader, hideLoader, setDisableLoader }} // ✅ expose
    >
      {children}
    </LoaderContext.Provider>
  );
};

export const useLoader = () => useContext(LoaderContext);