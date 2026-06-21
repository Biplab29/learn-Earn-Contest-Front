import { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppRoutes from "@/routes/AppRoutes";
import GlobalLoader from "@/components/ui/GlobalLoader";
import { useLoader } from "@/context/LoaderContext";
import { useTheme } from "@/context/ThemeContext";
import { connectLoader } from "@/services/axios";
import { wakeUpBackend } from "@/services/keepAlive";
import { fetchCurrentUserProfile } from "@/features/auth/authSlice";
import { getAuthToken } from "@/utils/authStorage";

function App() {
  const dispatch = useDispatch();
  const { showLoader, hideLoader } = useLoader();
  const { dark } = useTheme();
  const [showWakeupBanner, setShowWakeupBanner] = useState(false);

  // Wire loader to axios interceptors once
  useEffect(() => {
    connectLoader(showLoader, hideLoader);
  }, [showLoader, hideLoader]);

  // Fetch current user on mount if token exists
  useEffect(() => {
    if (getAuthToken()) {
      dispatch(fetchCurrentUserProfile());
    }
  }, [dispatch]);

  // Wake up Render.com backend on app start
  useEffect(() => {
    wakeUpBackend(() => {
      // Called if backend takes > 4 seconds (cold start)
      setShowWakeupBanner(true);
    }).finally(() => {
      setShowWakeupBanner(false);
    });
  }, []);

  return (
    <BrowserRouter>
      <div className="theme-root min-h-screen">
        <GlobalLoader />

        {/* Server wake-up banner — shown only during Render.com cold start */}
        {showWakeupBanner && (
          <div className="server-wakeup-banner">
            <span className="wakeup-dot" />
            সার্ভার জেগে উঠছে, একটু অপেক্ষা করুন…
          </div>
        )}

        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable
          theme={dark ? "dark" : "light"}
          toastClassName="custom-toast"
          bodyClassName="custom-toast-body"
        />
        <AppRoutes />
      </div>
    </BrowserRouter>
  );
}

export default App;
