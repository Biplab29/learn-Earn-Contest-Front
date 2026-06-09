import { useEffect, useState } from "react";
import { FaFire } from "react-icons/fa";

const LeaderboardPage = () => {
  const [leaders, setLeaders] = useState([]);

  // 🔥 DEMO DATA (replace with API)
  useEffect(() => {
    setLeaders([
      { name: "Utsav", score: 980, submissions: 12 },
      { name: "Rahul", score: 870, submissions: 10 },
      { name: "Aman", score: 820, submissions: 9 },
      { name: "Priya", score: 780, submissions: 8 },
      { name: "Sneha", score: 720, submissions: 7 },
    ]);
  }, []);

  const top3 = leaders.slice(0, 3);
  const others = leaders.slice(3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-white to-[#ecfdf5] p-6">

      {/* HEADER */}
      <div className="max-w-6xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          🏆 Leaderboard
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Top performers in contests
        </p>
      </div>

      <div className="max-w-6xl mx-auto">

        {/* 🥇 TOP 3 */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">

          {top3.map((user, index) => (
            <div
              key={index}
              className={`rounded-3xl p-6 text-center shadow-lg
                ${
                  index === 0
                    ? "bg-gradient-to-br from-yellow-100 to-yellow-50"
                    : index === 1
                    ? "bg-gray-100"
                    : "bg-orange-100"
                }
              `}
            >

              <div className="text-4xl mb-2">
                {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
              </div>

              <h2 className="text-lg font-semibold">{user.name}</h2>

              <p className="text-sm text-gray-500 mt-1">
                <FaFire className="inline mr-1 text-red-500" />
                {user.score} pts
              </p>

              <p className="text-xs text-gray-400 mt-1">
                {user.submissions} submissions
              </p>

            </div>
          ))}
        </div>

        {/* 📊 LIST */}
        <div className="bg-white rounded-3xl shadow p-6">

          <h2 className="font-semibold mb-4 text-gray-700">
            Rankings
          </h2>

          <div className="space-y-3">

            {others.map((user, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition"
              >

                {/* LEFT */}
                <div className="flex items-center gap-4">

                  <span className="text-sm font-bold text-gray-400">
                    #{index + 4}
                  </span>

                  <div>
                    <p className="font-medium text-gray-800">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {user.submissions} submissions
                    </p>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-2 text-sm font-semibold text-green-600">
                  <FaFire />
                  {user.score}
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
