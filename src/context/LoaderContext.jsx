import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const LoaderContext = createContext();
const LOADER_SHOW_DELAY_MS = 50;

export const LoaderProvider = ({ children }) => {
  const loadCountRef = useRef(0);
  const showTimeoutRef = useRef(null);
  const isLoadingRef = useRef(false);
  const disableLoaderRef = useRef(false);
  
  const [loading, setLoadingState] = useState(false);

  const setLoading = useCallback((value) => {
    if (isLoadingRef.current !== value) {
      isLoadingRef.current = value;
      setLoadingState(value);
    }
  }, []);

  const setDisableLoader = useCallback((value) => {
    disableLoaderRef.current = value;
    if (value) {
      if (showTimeoutRef.current) {
        window.clearTimeout(showTimeoutRef.current);
        showTimeoutRef.current = null;
      }
      setLoading(false);
    }
  }, [setLoading]);

  const showLoader = useCallback(() => {
    if (disableLoaderRef.current) return;
    loadCountRef.current += 1;
    
    if (loadCountRef.current > 0 && !showTimeoutRef.current && !isLoadingRef.current) {
      showTimeoutRef.current = window.setTimeout(() => {
        setLoading(true);
        showTimeoutRef.current = null;
      }, LOADER_SHOW_DELAY_MS);
    }
  }, [setLoading]);

  const hideLoader = useCallback(() => {
    loadCountRef.current = Math.max(loadCountRef.current - 1, 0);
    
    if (loadCountRef.current === 0) {
      if (showTimeoutRef.current) {
        window.clearTimeout(showTimeoutRef.current);
        showTimeoutRef.current = null;
      }
      setLoading(false);
    }
  }, [setLoading]);

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