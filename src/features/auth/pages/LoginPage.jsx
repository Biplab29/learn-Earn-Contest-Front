
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiCheckCircle,
} from "react-icons/fi";

import logo from "@/assets/Logo.png";
import {
  fetchCurrentUserProfile,
  loginUser,
} from "@/features/auth/authSlice";
import { toast } from "react-toastify";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const params = new URLSearchParams(location.search);
  const redirectPath = params.get("redirect");

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [focusPass, setFocusPass] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e?.preventDefault();

    if (!form.email || !form.password) {
      toast.error("Please fill all fields.");
      return;
    }

    try {
      const res = await dispatch(loginUser(form)).unwrap();
      dispatch(fetchCurrentUserProfile());

      const userId = res._id || res.user?._id;

      localStorage.setItem("userId", userId);
      localStorage.setItem("token", res.accessToken);
      localStorage.setItem("role", res.role);

      toast.success(`Login as ${res.role}.`);

      if (redirectPath) {
        navigate(decodeURIComponent(redirectPath));
      } else if (res.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/student/dashboard");
      }
    } catch (err) {
      toast.error(err || "Login failed.");
    }
  };

  return (
    <div className="theme-page-shell relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">

      <div className="absolute inset-0 -z-20 
        bg-gradient-to-br 
        from-[#ffffff] via-[#e0f2fe] to-[#dcfce7]
        dark:from-transparent dark:to-transparent" />

      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] 
        bg-gradient-to-r from-blue-200/40 via-green-200/30 to-transparent 
        blur-[120px] rounded-full -z-10" />

      <div className="absolute top-[10%] left-[-120px] w-[400px] h-[400px] 
        bg-green-200/30 blur-[100px] rounded-full -z-10" />

      <div className="absolute bottom-[5%] right-[-120px] w-[400px] h-[400px] 
        bg-blue-200/30 blur-[100px] rounded-full -z-10" />

      <div className="relative z-10 w-full max-w-md">

        <div className="
          theme-surface 
          rounded-3xl 
          border 
          p-8 
          backdrop-blur-2xl
          bg-white/60 dark:bg-[var(--theme-surface)]
          shadow-[0_20px_60px_rgba(0,0,0,0.08)]
          dark:shadow-[0_0_40px_rgba(130,198,0,0.18)]
          transition-all duration-300
        ">

          {/* LOGO */}
          <div className="text-center mb-8">
            <img src={logo} alt="logo" className="mx-auto w-16 mb-3" />
            <h1 className="theme-text font-bold text-lg tracking-wide">
              DESUN ACADEMY
            </h1>
            <p className="theme-text-soft text-sm">
              Next-gen learning platform
            </p>
          </div>

          <form onSubmit={handleLogin}>

            {/* EMAIL */}
            <div className="relative mb-6">
              <FiMail className="theme-text-muted absolute left-4 top-4" />

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder=" "
                className="
                  theme-input peer w-full rounded-xl 
                  px-4 pb-2 pl-10 pr-4 pt-5 outline-none
                  focus:ring-2 focus:ring-[#82C600]/40
                  transition-all duration-200
                "
              />

              <label className="theme-text-muted absolute left-10 top-3 text-sm transition-all 
                peer-placeholder-shown:top-3 
                peer-focus:top-1 peer-focus:text-xs peer-focus:text-[var(--theme-primary)]
                peer-not-placeholder-shown:top-1 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-[var(--theme-primary)]"
              >
                Email Address
              </label>
            </div>

            {/* PASSWORD */}
            <div className="relative mb-4">
              <FiLock className="theme-text-muted absolute left-4 top-4" />

              <input
                type={showPass ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                onFocus={() => setFocusPass(true)}
                onBlur={() => setFocusPass(false)}
                placeholder=" "
                className="
                  theme-input peer w-full rounded-xl 
                  px-4 pb-2 pl-10 pr-10 pt-5 outline-none
                  focus:ring-2 focus:ring-[#82C600]/40
                  transition-all duration-200
                "
              />

              <label className="theme-text-muted absolute left-10 top-3 text-sm transition-all 
                peer-placeholder-shown:top-3 
                peer-focus:top-1 peer-focus:text-xs peer-focus:text-[var(--theme-primary)]
                peer-not-placeholder-shown:top-1 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-[var(--theme-primary)]"
              >
                Password
              </label>

              <span
                onClick={() => setShowPass(!showPass)}
                className="theme-text-muted absolute right-4 top-4 cursor-pointer"
              >
                {showPass ? <FiEyeOff /> : <FiEye />}
              </span>
            </div>

            {/* PASSWORD RULES */}
            {focusPass && (
              <div className="theme-text-soft mb-4 space-y-1 text-xs">
                <p className="flex items-center gap-2">
                  <FiCheckCircle className="text-green-500" /> Minimum 8 characters
                </p>
                <p className="flex items-center gap-2">
                  <FiCheckCircle className="text-green-500" /> One uppercase letter
                </p>
                <p className="flex items-center gap-2">
                  <FiCheckCircle className="text-green-500" /> One number
                </p>
                <p className="flex items-center gap-2">
                  <FiCheckCircle className="text-green-500" /> One special character
                </p>
              </div>
            )}

            {/* OPTIONS */}
            <div className="theme-text-soft mb-6 flex justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-[#82C600]" />
                Remember
              </label>
              <Link
                to="/forgot-password"
                className="theme-link hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading || !form.email || !form.password}
              className="
                theme-brand-button 
                flex w-full items-center justify-center gap-2 
                rounded-xl py-3 font-semibold
                hover:scale-[1.04] hover:shadow-xl
                active:scale-95
                transition-all duration-200
              "
            >
              {loading ? "Signing in..." : "Sign in"}
              <FiArrowRight />
            </button>

          </form>

          {/* SIGNUP */}
          <p className="theme-text-soft mt-6 text-center text-sm">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="theme-link font-semibold hover:underline"
            >
              Create account
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;
