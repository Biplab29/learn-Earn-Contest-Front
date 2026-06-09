import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { FiLock, FiEye, FiEyeOff, FiArrowLeft } from "react-icons/fi";
import { toast } from "react-toastify";
import axios from "axios";
import logo from "@/assets/Logo.png";

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!form.password || !form.confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      setLoading(true);
      const { data } = await axios.post(
        `https://learn-earn-contest-3.onrender.com/api/v1/auth/reset-password/${token}`,
        { password: form.password }
      );
      toast.success(data.message || "Password reset successful.");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Reset failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="theme-page-shell min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-10">
      <div className="absolute w-[500px] h-[500px] bg-[#82C600]/20 rounded-full blur-[120px] top-[-100px] left-[-100px] animate-pulse"></div>
      <div className="absolute w-[400px] h-[400px] bg-green-400/15 rounded-full blur-[120px] bottom-[-80px] right-[-80px] animate-pulse"></div>

      <div className="relative z-10 w-full max-w-md">
        <div className="theme-surface rounded-3xl p-8 backdrop-blur-3xl shadow-[var(--theme-shadow-md)]">
          <div className="text-center mb-8">
            <img src={logo} alt="logo" className="mx-auto w-16 mb-3" />
            <h1 className="theme-text font-bold text-xl">Reset Password</h1>
            <p className="theme-text-soft text-sm">Enter your new password</p>
          </div>

          <form onSubmit={handleResetPassword}>
            <div className="relative mb-6">
              <FiLock className="theme-text-muted absolute left-4 top-4" />
              <input
                type={showPass ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                className="theme-input w-full pl-10 pr-10 pt-5 pb-2 rounded-xl outline-none focus:ring-2 focus:ring-[#82C600]/40"
              />
              <label
                className={`absolute left-10 text-sm transition-all ${
                  form.password ? "top-1 text-xs text-[var(--theme-primary)]" : "top-3 theme-text-muted"
                }`}
              >
                New Password
              </label>
              <span
                onClick={() => setShowPass(!showPass)}
                className="theme-text-muted absolute right-4 top-4 cursor-pointer"
              >
                {showPass ? <FiEyeOff /> : <FiEye />}
              </span>
            </div>

            <div className="relative mb-6">
              <FiLock className="theme-text-muted absolute left-4 top-4" />
              <input
                type={showConfirmPass ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                className="theme-input w-full pl-10 pr-10 pt-5 pb-2 rounded-xl outline-none focus:ring-2 focus:ring-[#82C600]/40"
              />
              <label
                className={`absolute left-10 text-sm transition-all ${
                  form.confirmPassword
                    ? "top-1 text-xs text-[var(--theme-primary)]"
                    : "top-3 theme-text-muted"
                }`}
              >
                Confirm Password
              </label>
              <span
                onClick={() => setShowConfirmPass(!showConfirmPass)}
                className="theme-text-muted absolute right-4 top-4 cursor-pointer"
              >
                {showConfirmPass ? <FiEyeOff /> : <FiEye />}
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="theme-brand-button w-full py-3 rounded-xl font-semibold hover:scale-105 transition disabled:opacity-50"
            >
              {loading ? "Updating..." : "Reset Password"}
            </button>
          </form>

          <Link
            to="/login"
            className="theme-text-soft flex items-center justify-center gap-2 text-sm hover:text-[var(--theme-primary)] mt-6 transition"
          >
            <FiArrowLeft />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
