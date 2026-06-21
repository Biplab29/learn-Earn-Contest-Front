import { useState } from "react";
import { FaFire, FaMedal, FaTrophy } from "react-icons/fa";

const MEDAL = ["🥇", "🥈", "🥉"];
const MEDAL_RING = [
  "ring-2 ring-yellow-400/60 bg-gradient-to-br from-yellow-400/20 to-amber-300/10",
  "ring-2 ring-gray-400/50 bg-gradient-to-br from-gray-300/20 to-slate-300/10",
  "ring-2 ring-orange-400/50 bg-gradient-to-br from-orange-300/20 to-amber-200/10",
];

const LeaderboardPage = () => {
  const [leaders] = useState([
    { name: "Utsav", score: 980, submissions: 12 },
    { name: "Rahul", score: 870, submissions: 10 },
    { name: "Aman", score: 820, submissions: 9 },
    { name: "Priya", score: 780, submissions: 8 },
    { name: "Sneha", score: 720, submissions: 7 },
  ]);

  const top3 = leaders.slice(0, 3);
  const others = leaders.slice(3);

  return (
    <div className="theme-page-shell min-h-screen p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="theme-text text-3xl font-bold flex items-center gap-2">
            <FaTrophy className="text-yellow-400" />
            Leaderboard
          </h1>
          <p className="theme-text-muted text-sm mt-1">
            Top performers in contests
          </p>
        </div>

        {/* 🥇 TOP 3 */}
        <div className="grid md:grid-cols-3 gap-5 mb-8">
          {top3.map((user, index) => (
            <div
              key={index}
              className={`theme-surface rounded-3xl p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-default ${MEDAL_RING[index]}`}
            >
              <div className="text-5xl mb-3">{MEDAL[index]}</div>

              <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-[#82c600]/30 to-[#a3e635]/20 flex items-center justify-center mb-3">
                <span className="theme-text text-xl font-bold">
                  {user.name.charAt(0)}
                </span>
              </div>

              <h2 className="theme-text text-lg font-semibold">{user.name}</h2>

              <p className="theme-text-muted text-sm mt-1 flex items-center justify-center gap-1">
                <FaFire className="text-rose-500" />
                <span className="text-[#82c600] font-bold">{user.score}</span>
                <span>pts</span>
              </p>

              <p className="theme-text-muted text-xs mt-1">
                {user.submissions} submissions
              </p>

              {/* Bottom accent */}
              <div
                className={`mt-4 h-1 w-16 mx-auto rounded-full ${
                  index === 0
                    ? "bg-yellow-400"
                    : index === 1
                    ? "bg-gray-400"
                    : "bg-orange-400"
                }`}
              />
            </div>
          ))}
        </div>

        {/* 📊 RANKINGS LIST */}
        <div className="theme-surface rounded-3xl overflow-hidden">
          <div className="px-6 py-4 border-b theme-border">
            <h2 className="theme-text font-semibold text-base flex items-center gap-2">
              <FaMedal className="text-[#82c600]" />
              Rankings
            </h2>
          </div>

          <div className="divide-y theme-border">
            {others.map((user, index) => (
              <div
                key={index}
                className="theme-interactive-row flex items-center justify-between px-6 py-4 transition-all duration-200"
              >
                {/* LEFT */}
                <div className="flex items-center gap-4">
                  <span className="theme-text-muted text-sm font-bold w-8 text-center">
                    #{index + 4}
                  </span>

                  <div className="w-10 h-10 rounded-full bg-[#82c600]/10 flex items-center justify-center">
                    <span className="text-[#82c600] font-bold text-sm">
                      {user.name.charAt(0)}
                    </span>
                  </div>

                  <div>
                    <p className="theme-text font-medium">{user.name}</p>
                    <p className="theme-text-muted text-xs">
                      {user.submissions} submissions
                    </p>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-2 text-sm font-semibold text-[#82c600]">
                  <FaFire className="text-rose-500" />
                  {user.score} pts
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default LeaderboardPage;
