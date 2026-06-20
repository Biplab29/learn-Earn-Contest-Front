
import Card from "@/components/ui/Card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchContests } from "@/features/contest/contestSlice";
import { useNavigate } from "react-router-dom";

import { FiClock, FiCheckCircle, FiLoader, FiAlertCircle } from "react-icons/fi";
import { FaArrowRight } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

import { FaCalendarAlt } from "react-icons/fa";
import ContestPreviewModal from "@/features/student/ContestPreviewModal";
import { fetchMyParticipation } from "../participationSlice";

const PRIMARY = "#82C600";

const StudentDashboardView = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { history } = useSelector((state) => state.participation);
  const { user } = useSelector((state) => state.auth);
  const { contests = [] } = useSelector((state) => state.contest);


  const [tab, setTab] = useState("active");
  const [selectedContest, setSelectedContest] = useState(null);

  const formatDate = (value, fallback = "TBA") => {
    if (!value) return fallback;
    const date = new Date(value);
    return isNaN(date.getTime()) ? fallback : date.toLocaleDateString();
  };

  // ✅ SAFE DEADLINE
  const getRemainingTime = (deadline) => {
    if (!deadline) return { text: "No deadline", color: "text-gray-400" };

    const now = new Date();
    const end = new Date(deadline);

    if (isNaN(end)) return { text: "Invalid date", color: "text-red-500" };

    const diff = end - now;

    if (diff <= 0) return { text: "Expired", color: "text-red-500" };

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);

    if (days > 0) return { text: `${days}d left`, color: "text-green-600" };
    if (hours > 0) return { text: `${hours}h left`, color: "text-yellow-600" };

    return { text: "Ending soon", color: "text-red-500" };
  };

  const getStatusUI = (status) => {
    if (status === "active") {
      return {
        color: "text-green-500",
        icon: <FiLoader className="animate-spin" />,
      };
    }
    if (status === "completed") {
      return { color: "text-blue-500", icon: <FiCheckCircle /> };
    }
    return { color: "text-gray-400", icon: <FiAlertCircle /> };
  };

  const filteredContests = contests.filter((contest) => {
    const now = new Date();
    const start = contest.startDate ? new Date(contest.startDate) : null;
    const end = contest.deadline ? new Date(contest.deadline) : null;

    if (tab === "active") return start && end && start <= now && end > now;
    if (tab === "upcoming") return start && start > now;
    if (tab === "completed") return end && end < now;

    return true;
  });

  useEffect(() => {
    dispatch(fetchContests());
    dispatch(fetchMyParticipation()); // ✅ ADD
  }, [dispatch]);



  return (

    <div className="theme-page-shell min-h-screen p-6">

      {/* HERO */}
      <div
        className="mb-6 rounded-3xl p-6 text-slate-950 shadow-xl"
        style={{ background: `linear-gradient(135deg, ${PRIMARY}, #6ea800)` }}
      >
        <h1 className="text-3xl font-bold">
          Welcome back, {user?.name || "Student"} 👋
        </h1>
        <p className="mt-1 text-sm text-slate-900/80">
          Compete. Build. Win 🚀
        </p>
      </div>

      {/* TABS */}
      <div className="flex gap-3 mb-6">
        {["active", "upcoming", "completed"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${tab === t
              ? "theme-brand-button shadow-lg"
              : "theme-outline-button"
              }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* 🔥 FULL WIDTH EXPLORE */}
      <Card className="p-5 rounded-3xl shadow-lg mb-6">
        <h2 className="font-bold text-lg mb-4">🚀 Explore Contests</h2>

        <Swiper
          spaceBetween={20}
          slidesPerView={1.2}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          autoplay={{ delay: 2500 }}
          modules={[Autoplay]}
        >
          {filteredContests.map((contest) => {
            const time = getRemainingTime(contest.deadline);

            return (
              <SwiperSlide key={contest._id}>
                <div
                  onClick={() => setSelectedContest(contest)}
                  className="theme-surface theme-card-hover cursor-pointer group overflow-hidden rounded-3xl"
                >
                  {/* IMAGE */}
                  <div className="relative">
                    <img
                      src={contest.image || "/default.jpg"}
                      className="w-full h-44 object-cover group-hover:scale-110 transition duration-300"
                    />

                    <span
                      className="absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-semibold text-slate-950 shadow"
                      style={{ background: PRIMARY }}
                    >
                      {contest.status}
                    </span>
                  </div>

                  {/* CONTENT */}
                  <div className="p-4">

                    {/* TITLE + DEADLINE RIGHT */}
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-semibold line-clamp-1">
                        {contest.title || "No title"}
                      </h3>

                      <span className={`text-xs flex items-center gap-1 ${time.color}`}>
                        <FiClock /> {time.text}
                      </span>
                    </div>

                    {/* BUTTON */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/contest/${contest._id}`);
                      }}
                      className="theme-brand-button mt-4 flex w-full items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold"
                    >
                      View Details <FaArrowRight />
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </Card>

      {/* 🔥 GRID BELOW (Participation + Deadline) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT - PARTICIPATION (UNCHANGED) */}
        <div className="lg:col-span-2">
          <Card className="p-5 rounded-3xl shadow-lg">
            <h2 className="font-bold text-lg mb-4">📜 My Participation</h2>

            <div className="space-y-4">
              {history.map((item) => {
                if (!item?.team?.contest) return null;

                const contest = item.team?.contest;

                const statusUI = getStatusUI(contest.status);
                const time = getRemainingTime(contest.deadline);
                return (
                  <div
                    key={item._id}
                    onClick={() => setSelectedContest(item)}
                    className="theme-interactive-row flex cursor-pointer gap-4 rounded-2xl border p-4 transition"
                  >
                    <img
                      src={contest.image || "/default.jpg"}
                      className="w-14 h-14 rounded-xl object-cover"
                    />

                    <div className="flex-1">
                      <h4 className="text-sm font-semibold">
                        {contest.title}
                      </h4>
                      <p className={`text-xs ${time.color}`}>
                        {time.text}
                      </p>
                    </div>

                    <span className={`text-xs flex items-center gap-1 ${statusUI.color}`}>
                      {statusUI.icon}
                      {contest.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* RIGHT - DEADLINES */}
        <div>
          <Card className="p-5 rounded-3xl shadow-lg">
            <h3 className="font-bold mb-4 text-lg flex items-center gap-2">
              <FiClock className="text-green-600" />
              Deadlines
            </h3>

            <div className="space-y-3">
              {history.map((item) => {
                if (!item?.team?.contest) return null;

                const contest = item.team?.contest;
                const time = getRemainingTime(contest?.deadline);

                return (
                  <div
                    key={item._id}
                    className="
            flex items-center justify-between 
            p-3 rounded-xl 
            bg-white/60 dark:bg-white/5 
            backdrop-blur-md
            border border-white/40 dark:border-white/10
            hover:shadow-md hover:scale-[1.01]
            transition duration-300
          "
                  >
                    {/* LEFT */}
                    <div className="flex items-start gap-3">

                      {/* ICON */}
                      <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                        <FaCalendarAlt className="text-green-600 text-sm" />
                      </div>

                      {/* TEXT */}
                      <div>
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 line-clamp-1">
                          {contest.title}
                        </p>

                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                          <FiClock />
                          {formatDate(contest.deadline)}
                        </p>
                      </div>

                    </div>

                    {/* RIGHT BADGE */}
                    <span
                      className={`
              text-xs font-semibold px-3 py-1 rounded-full
              ${time.color}
              bg-white/70 dark:bg-white/10
              backdrop-blur
              flex items-center gap-1
            `}
                    >
                      <FiClock />
                      {time.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>        </div>

      </div>

      <ContestPreviewModal
        selectedContest={selectedContest}
        onClose={() => setSelectedContest(null)}
      />
    </div>
  );

};

export default StudentDashboardView;
