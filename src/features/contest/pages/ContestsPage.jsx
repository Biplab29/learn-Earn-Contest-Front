

import { useNavigate } from "react-router-dom";
import { FaArrowRight, FaTrophy, FaUser, FaUsers } from "react-icons/fa";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchContests } from "@/features/contest/contestSlice";
import ContestPreviewModal from "@/features/student/ContestPreviewModal";

const formatDate = (value, fallback = "TBA") => {
  if (!value) return fallback;
  const date = new Date(value);
  return isNaN(date.getTime()) ? fallback : date.toLocaleDateString();
};

const calculateDaysLeft = (deadline) => {
  if (!deadline) return null;
  const date = new Date(deadline);
  if (isNaN(date.getTime())) return null;
  return Math.ceil((date - new Date()) / (1000 * 60 * 60 * 24));
};

const ContestsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { contests = [] } = useSelector((state) => state.contest);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const isLoggedIn = !!token;
  const [selectedContest, setSelectedContest] = useState(null);

  useEffect(() => {
    dispatch(fetchContests());
  }, [dispatch]);

  const handleParticipate = (item) => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    if (role === "student") {
      navigate(`/student/contest/${item._id}`);
    } else if (role === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="theme-page-shell min-h-screen px-3 py-6 sm:px-4 md:px-6 md:py-10 lg:px-10">

      {/* HEADER */}
      <div className="mb-8 md:mb-10">
        <h1 className="theme-text text-2xl font-bold md:text-4xl">
          Discover Contests
        </h1>
        <p className="theme-text-soft mt-1 text-sm">
          Compete, win rewards, and grow 🚀
        </p>
      </div>

      {/* GRID */}
      {contests.length === 0 ? (
        <div className="theme-surface rounded-2xl p-12 text-center">
          <p className="theme-text text-lg font-medium">No contests available</p>
          <p className="theme-text-muted text-sm mt-2">Check back soon for new competitions!</p>
        </div>
      ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">

        {contests.map((item) => {
          const daysLeft = calculateDaysLeft(item.deadline);

          return (
            <div
              key={item._id}
              onClick={() => setSelectedContest(item)}
              className="theme-surface theme-card-hover group relative cursor-pointer overflow-hidden rounded-3xl transition-all duration-500"
            >

              {/* IMAGE */}
              <div className="relative h-44 md:h-52 overflow-hidden">

                <img
                  src={item.image || "/default-contest.jpg"}
                  alt={item.title}
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.parentNode.style.background =
                      "linear-gradient(135deg,#1e293b,#0f172a)";
                  }}
                  className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                />

                {/* OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                {/* STATUS (TOP LEFT) */}
                <div className="absolute top-3 left-3 text-xs px-3 py-1 rounded-full font-semibold 
                bg-gradient-to-r from-[#82C600] to-[#a3e635] text-slate-950 shadow">
                  {item.status || "Active"}
                </div>

                {/* REWARD (TOP RIGHT) */}
                <div className="absolute top-3 right-3 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full shadow flex items-center gap-1">
                  <FaTrophy />
                  {item.rewards?.[0] || "Reward"}
                </div>

                {/* 🔥 PARTICIPATION TYPE (FIXED PREMIUM POSITION) */}
                <div className="absolute bottom-12 left-3">

                  {item.participationType === "solo" && (
                    <div className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full 
                    bg-white/90 backdrop-blur-md shadow-md text-gray-800 font-semibold border border-white/40">
                      <FaUser className="text-[#82C600]" />
                      Solo
                    </div>
                  )}

                  {item.participationType === "team" && (
                    <div className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full 
                    bg-white/90 backdrop-blur-md shadow-md text-gray-800 font-semibold border border-white/40">
                      <FaUsers className="text-blue-500" />
                      Team
                    </div>
                  )}

                  {item.participationType === "both" && (
                    <div className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full 
                    bg-white/90 backdrop-blur-md shadow-md text-gray-800 font-semibold border border-white/40">
                      <FaUser className="text-[#82C600]" />
                      <FaUsers className="text-blue-500" />
                      Both
                    </div>
                  )}

                </div>

                {/* TITLE (BOTTOM CLEAN) */}
                <h3 className="absolute bottom-3 left-3 right-3 text-white font-bold text-sm sm:text-base md:text-lg leading-tight truncate">
                  {item.title || "Untitled Contest"}
                </h3>

              </div>

              {/* CONTENT */}
              <div className="p-5 flex flex-col justify-between">

                <p className="theme-text-soft text-sm line-clamp-2">
                  {item.description || "No description available."}
                </p>

                {/* TAGS */}
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="text-xs bg-[#82C600]/10 text-[#82C600] px-2 py-1 rounded">
                    {item.category || "General"}
                  </span>

                  {item.level && (
                    <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-700 dark:bg-blue-500/15 dark:text-blue-300">
                      {item.level}
                    </span>
                  )}
                </div>

                {/* TIME */}
                <p className="mt-2 text-xs text-rose-500 dark:text-rose-300">
                  ⏳ {daysLeft === null ? "TBA" : daysLeft > 0 ? `${daysLeft} days left` : "Ended"}
                </p>

                {/* STATS */}
                <div className="grid grid-cols-2 gap-3 mt-4 text-xs">

                  <div className="theme-surface-muted rounded-xl p-3">
                    <p className="theme-text-muted">Start</p>
                    <p className="theme-text font-semibold">
                      {formatDate(item.startDate)}
                    </p>
                  </div>

                  <div className="theme-surface-muted rounded-xl p-3">
                    <p className="theme-text-muted">Deadline</p>
                    <p className="theme-text font-semibold">
                      {formatDate(item.deadline)}
                    </p>
                  </div>

                  <div className="theme-surface-muted col-span-2 rounded-xl p-3">
                    <p className="theme-text-muted">Participants</p>
                    <p className="theme-text font-semibold">
                      👥 {item.participants?.length || 0}+ Joined
                    </p>

                    <div className="mt-2 h-2 w-full rounded-full bg-gray-200 dark:bg-slate-700">
                      <div
                        className="bg-gradient-to-r from-[#82C600] to-[#a3e635] h-2 rounded-full"
                        style={{
                          width: `${Math.min(
                            (item.participants?.length || 0) * 10,
                            100
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* BUTTON */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleParticipate(item);
                  }}
                  className="theme-brand-button mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold"
                >
                  View Details <FaArrowRight />
                </button>

              </div>

              {/* GLOW */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#82c600]/10 to-[#a3e635]/10 opacity-0 group-hover:opacity-100 transition"></div>

            </div>
          );
        })}
      </div>
      )}

      <ContestPreviewModal
        selectedContest={selectedContest}
        onClose={() => setSelectedContest(null)}
      />
    </div>
  );
};

export default ContestsPage;
