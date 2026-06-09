import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiLock,
  FiPhone,
  FiCamera,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiTarget,
  FiTrendingUp,
  FiAward,
  FiCheckCircle,
} from "react-icons/fi";

import logo from "@/assets/desun.png";
import { registerUser } from "@/features/auth/authSlice";
import { toast } from "react-toastify";
import {
  getUserProfileImage,
  getUserRegisteredAt,
  saveLocalUserProfileMeta,
} from "@/utils/userProfile";

const SignupPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    gender: "",
  });

  const [showPass, setShowPass] = useState(false);
  const [focusPass, setFocusPass] = useState(false);
  const [focused, setFocused] = useState("");

  const [profilePreview, setProfilePreview] = useState("");
  const [profileFileName, setProfileFileName] = useState("");
  const [profileFile, setProfileFile] = useState(null);

  const handleChange = (e) => {
    let { name, value } = e.target;

    // Full Name Validation
    if (name === "name") {
      value = value.replace(/[^A-Za-z\s]/g, "");
    }

    // Mobile Number Validation
    if (name === "phoneNumber") {
      value = value.replace(/\D/g, "").slice(0, 10);
    }

    setForm({ ...form, [name]: value });
  };

  const handleProfileImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      setProfileFile(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose a valid image file");
      setProfileFile(null);
      setProfilePreview("");
      setProfileFileName("");
      event.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Profile image must be 2MB or smaller");
      setProfileFile(null);
      setProfilePreview("");
      setProfileFileName("");
      event.target.value = "";
      return;
    }

    setProfileFile(file);

    const reader = new FileReader();

    reader.onload = () => {
      setProfilePreview(String(reader.result || ""));
      setProfileFileName(file.name);
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();

    try {
      const { name, email, password, phoneNumber, gender } =
        form;

      // Name Validation
      if (!/^[A-Za-z\s]+$/.test(name)) {
        return toast.error("Enter valid full name");
      }

      // Mobile Validation
      if (!/^\d{10}$/.test(phoneNumber)) {
        return toast.error(
          "Mobile number must be 10 digits"
        );
      }

      // Password Validation
      if (
        password.length < 8 ||
        !/[A-Z]/.test(password) ||
        !/[0-9]/.test(password) ||
        !/[!@#$%^&*(),.?":{}|<>]/.test(password)
      ) {
        return toast.error(
          "Password must contain uppercase letter, number, special character and minimum 8 characters"
        );
      }

      const payload = profileFile
        ? (() => {
            const formData = new FormData();

            formData.append("name", name);
            formData.append("email", email);
            formData.append("password", password);
            formData.append(
              "phoneNumber",
              phoneNumber
            );
            formData.append("gender", gender);
            formData.append(
              "profilePicture",
              profileFile
            );

            return formData;
          })()
        : {
            name,
            email,
            password,
            phoneNumber,
            gender,
          };

      const result = await dispatch(
        registerUser(payload)
      ).unwrap();

      const registeredUser = result?.user;

      saveLocalUserProfileMeta({
        email,
        profileImage:
          getUserProfileImage(registeredUser) ||
          profilePreview,
        registeredAt:
          getUserRegisteredAt(registeredUser),
      });

      toast.success("Signup successful.");

      navigate("/login");
    } catch (err) {
      toast.error(err || "Something went wrong.");
    }
  };

  const getLabelClass = (field) =>
    `absolute left-10 text-sm transition-all duration-200 pointer-events-none ${
      form[field] || focused === field
        ? "top-1 text-xs text-[var(--theme-primary)]"
        : "top-3 theme-text-muted"
    }`;

  const inputClass = `
    theme-input
    w-full
    rounded-xl
    px-4
    pb-2
    pl-10
    pr-4
    pt-5
    outline-none
    transition-all
    duration-200
  `;

  return (
    <div className="theme-page-shell min-h-screen flex">
      {/* LEFT SIDE */}
      <div className="hidden md:flex w-1/2 relative overflow-hidden bg-slate-950 text-white p-12 flex-col justify-between">
        <div className="absolute w-[500px] h-[500px] bg-[#82C600]/25 blur-[140px] top-[-150px] left-[-150px] animate-pulse pointer-events-none"></div>

        <div className="absolute w-[400px] h-[400px] bg-green-400/20 blur-[120px] bottom-[-100px] right-[-100px] animate-pulse pointer-events-none"></div>

        <div className="relative z-10">
          <h1 className="text-4xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-[#82C600] to-[#a3e635] bg-clip-text text-transparent">
              Desun Academy
            </span>

            <br />

            Build Your Future with Skills
          </h1>

          <p className="mt-4 text-white/60 max-w-sm">
            Compete in real contests, improve your{" "}
            <span className="text-[#bef264]">
              skills
            </span>
            , and unlock{" "}
            <span className="text-[#bef264]">
              career opportunities
            </span>
            .
          </p>
        </div>

        <div className="relative z-10 mt-10 space-y-5">
          <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <FiTarget className="text-[#82C600]" />

              <div>
                <p className="text-sm font-medium">
                  Real Contest Experience
                </p>

                <p className="text-xs text-white/50">
                  Industry-level challenges
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <FiTrendingUp className="text-[#82C600]" />

              <div>
                <p className="text-sm font-medium">
                  Performance Tracking
                </p>

                <p className="text-xs text-white/50">
                  Track progress
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <FiAward className="text-[#82C600]" />

              <div>
                <p className="text-sm font-medium">
                  Rewards
                </p>

                <p className="text-xs text-white/50">
                  Earn certifications
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="relative z-10 text-xs text-white/40">
          Copyright 2026 Desun Academy
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div className="theme-page-shell flex-1 flex items-center justify-center relative overflow-hidden px-4 py-10">
        <div className="absolute w-[400px] h-[400px] bg-[#82C600]/20 blur-[120px] top-[-100px] right-[-100px] pointer-events-none"></div>

        <div className="relative z-10 w-full max-w-md pointer-events-auto">
          <div className="theme-surface rounded-3xl p-6 shadow-[var(--theme-shadow-md)] backdrop-blur-3xl sm:p-8">
            {/* LOGO */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <img
                src={logo}
                alt="logo"
                className="w-10 h-10"
              />

              <div>
                <h1 className="theme-text font-bold text-lg">
                  Desun Academy
                </h1>

                <p className="theme-text-soft text-xs">
                  Get Placed by Skill
                </p>
              </div>
            </div>

            <h2 className="theme-text text-2xl font-bold text-center">
              Create Account
            </h2>

            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-4"
            >
              {/* PROFILE */}
              <div className="flex flex-col items-center gap-3 pb-2">
                <label className="group relative flex h-15 w-20 cursor-pointer items-center justify-center overflow-hidden rounded-[28px] border border-[var(--theme-border)] bg-[var(--theme-surface-muted)]">
                  {profilePreview ? (
                    <img
                      src={profilePreview}
                      alt="Profile preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-1 theme-text-soft">
                      <FiCamera className="text-lg" />

                      <span className="text-[11px] uppercase tracking-[0.24em]">
                        Upload
                      </span>
                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={
                      handleProfileImageChange
                    }
                    className="hidden"
                  />
                </label>

                <div className="text-center">
                  <p className="theme-text text-xs font-medium">
                    Profile Picture
                  </p>

                  <p className="theme-text-muted text-[11px]">
                    {profileFileName ||
                      "PNG or JPG, up to 2MB"}
                  </p>
                </div>
              </div>

              {/* NAME */}
              <div className="relative">
                <FiUser className="theme-text-muted absolute left-4 top-4 pointer-events-none" />

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  onFocus={() =>
                    setFocused("name")
                  }
                  onBlur={() => setFocused("")}
                  autoComplete="off"
                  placeholder=" "
                  className={inputClass}
                />

                <label
                  className={getLabelClass("name")}
                >
                  Full Name
                </label>
              </div>

              {/* EMAIL */}
              <div className="relative">
                <FiMail className="theme-text-muted absolute left-4 top-4 pointer-events-none" />

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  onFocus={() =>
                    setFocused("email")
                  }
                  onBlur={() => setFocused("")}
                  autoComplete="off"
                  placeholder=" "
                  className={inputClass}
                />

                <label
                  className={getLabelClass("email")}
                >
                  Email Address
                </label>
              </div>

              {/* PHONE */}
              <div className="relative">
                <FiPhone className="theme-text-muted absolute left-4 top-4 pointer-events-none" />

                <input
                  type="tel"
                  name="phoneNumber"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  onFocus={() =>
                    setFocused("phoneNumber")
                  }
                  onBlur={() => setFocused("")}
                  autoComplete="off"
                  placeholder=" "
                  className={inputClass}
                />

                <label
                  className={getLabelClass(
                    "phoneNumber"
                  )}
                >
                  Mobile Number
                </label>
              </div>

              {/* GENDER */}
              <div>
                <p className="theme-text-soft text-sm mb-2">
                  Gender
                </p>

                <div className="grid grid-cols-3 gap-3">
                  {["male", "female", "other"].map(
                    (g) => (
                      <div
                        key={g}
                        onClick={() =>
                          setForm({
                            ...form,
                            gender: g,
                          })
                        }
                        className={`text-center py-2 rounded-xl cursor-pointer ${
                          form.gender === g
                            ? "bg-[#82C600] text-black"
                            : "theme-surface-muted theme-text-soft border border-[var(--theme-border)]"
                        }`}
                      >
                        {g}
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* PASSWORD */}
              <div className="relative">
                <FiLock className="theme-text-muted absolute left-4 top-4 pointer-events-none" />

                <input
                  type={
                    showPass ? "text" : "password"
                  }
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  onFocus={() => {
                    setFocused("password");
                    setFocusPass(true);
                  }}
                  onBlur={() => {
                    setFocused("");
                    setFocusPass(false);
                  }}
                  autoComplete="off"
                  placeholder=" "
                  className={
                    inputClass + " pr-10"
                  }
                />

                <label
                  className={getLabelClass(
                    "password"
                  )}
                >
                  Password
                </label>

                <span
                  onClick={() =>
                    setShowPass(!showPass)
                  }
                  className="theme-text-muted absolute right-4 top-4 cursor-pointer z-30"
                >
                  {showPass ? (
                    <FiEyeOff />
                  ) : (
                    <FiEye />
                  )}
                </span>
              </div>

              {/* PASSWORD RULES */}
              {focusPass && (
                <div className="theme-text-soft mb-4 space-y-1 text-xs">
                  <p className="flex items-center gap-2">
                    <FiCheckCircle className="text-green-500" />
                    Minimum 8 characters
                  </p>

                  <p className="flex items-center gap-2">
                    <FiCheckCircle className="text-green-500" />
                    One uppercase letter
                  </p>

                  <p className="flex items-center gap-2">
                    <FiCheckCircle className="text-green-500" />
                    One number
                  </p>

                  <p className="flex items-center gap-2">
                    <FiCheckCircle className="text-green-500" />
                    One special character
                  </p>
                </div>
              )}

              {/* BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="theme-brand-button w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:scale-105 transition"
              >
                {loading
                  ? "Creating..."
                  : "Create Account"}

                <FiArrowRight />
              </button>

              {/* LOGIN */}
              <p className="theme-text-soft text-center text-sm">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="theme-link font-semibold"
                >
                  Login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
