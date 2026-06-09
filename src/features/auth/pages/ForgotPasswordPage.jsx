import { useState } from "react";
import { Link } from "react-router-dom";
import { FiMail, FiArrowLeft } from "react-icons/fi";
import { toast } from "react-toastify";
import axios from "axios";
import logo from "@/assets/Logo.png";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    try {
      setLoading(true);
      const { data } = await axios.post(
        `https://learn-earn-contest-3.onrender.com/api/v1/auth/forgot-password`,
        { email }
      );
      toast.success(data.message || "Reset link sent to your email.");
      setEmail("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
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
            <h1 className="theme-text font-bold text-xl">Forgot Password</h1>
            <p className="theme-text-soft text-sm">
              Enter your email to receive reset link
            </p>
          </div>

          <form onSubmit={handleForgotPassword}>
            <div className="relative mb-6">
              <FiMail className="theme-text-muted absolute left-4 top-4" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="theme-input w-full pl-10 pr-4 pt-5 pb-2 rounded-xl outline-none focus:ring-2 focus:ring-[#82C600]/40"
              />
              <label
                className={`absolute left-10 text-sm transition-all ${
                  email ? "top-1 text-xs text-[var(--theme-primary)]" : "top-3 theme-text-muted"
                }`}
              >
                Email Address
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="theme-brand-button w-full py-3 rounded-xl font-semibold hover:scale-105 transition disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Reset Link"}
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

export default ForgotPasswordPage;
