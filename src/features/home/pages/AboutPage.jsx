import {
  FaTrophy,
  FaUsers,
  FaLightbulb,
  FaChartLine,
  FaRocket,
  FaMedal,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AboutPage = () => {
  const navigate = useNavigate();

  const isAuthenticated = !!localStorage.getItem("token");

  const handleExplore = () => {
    if (!isAuthenticated) {
      navigate("/context");
    } else {
      navigate("/contests");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-white to-[#ecfdf5] p-4 md:p-8">

      {/* 🔥 HERO */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#82c600] via-[#a3e635] to-[#6ea800] p-10 md:p-14 text-white shadow-xl">

        <div className="max-w-2xl z-10 relative">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Compete. Learn. <br />
            <span className="text-[#fbd300]">Achieve Greatness</span>
          </h1>

          <p className="mt-6 text-sm md:text-base opacity-90 leading-relaxed">
            Unlock your full potential through real-world competitions,
            hands-on challenges, and skill-based learning experiences.
          </p>

          <button
            onClick={handleExplore}
            className="mt-6 flex items-center gap-2 bg-black/20 backdrop-blur-lg px-6 py-3 rounded-xl font-medium hover:scale-105 transition-all duration-300 shadow-lg"
          >
            <FaRocket />
            Explore Contests
          </button>
        </div>

        {/* 🔥 Glow Circle */}
        <div className="absolute w-[300px] h-[300px] bg-white/20 blur-3xl rounded-full top-[-50px] right-[-50px]" />
      </div>

      {/* 🔥 FEATURE GRID */}
      <div className="grid md:grid-cols-3 gap-6 mt-10">

        {[
          {
            icon: <FaTrophy />,
            title: "Real Competitions",
            desc: "Solve real-world problems and compete nationally.",
          },
          {
            icon: <FaUsers />,
            title: "Strong Community",
            desc: "Connect with top-performing students.",
          },
          {
            icon: <FaLightbulb />,
            title: "Skill Growth",
            desc: "Learn practical skills beyond textbooks.",
          },
          {
            icon: <FaChartLine />,
            title: "Career Boost",
            desc: "Enhance your resume with achievements.",
          },
          {
            icon: <FaMedal />,
            title: "Recognition",
            desc: "Earn ranks, rewards, and certificates.",
          },
          {
            icon: <FaRocket />,
            title: "Fast Growth",
            desc: "Accelerate your learning journey.",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="group bg-white/70 backdrop-blur-xl border border-gray-200 p-6 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
          >
            <div className="text-[#82c600] text-2xl mb-4 group-hover:scale-110 transition">
              {item.icon}
            </div>

            <h3 className="font-semibold text-gray-800">
              {item.title}
            </h3>

            <p className="text-sm text-gray-500 mt-2">
              {item.desc}
            </p>
          </div>
        ))}

      </div>

      {/* 🔥 STATS WITH GLASS EFFECT */}
      <div className="grid grid-cols-3 gap-6 mt-12">

        {[
          { value: "10K+", label: "Students" },
          { value: "500+", label: "Contests" },
          { value: "100+", label: "Institutes" },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white/60 backdrop-blur-lg border p-6 rounded-2xl text-center shadow-md hover:shadow-xl transition"
          >
            <p className="text-3xl font-bold text-[#82c600]">
              {item.value}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {item.label}
            </p>
          </div>
        ))}

      </div>

      {/* 🔥 CTA */}
      <div className="mt-12 bg-gradient-to-r from-[#82c600] to-[#a3e635] p-10 rounded-3xl text-center text-white shadow-lg">

        <h2 className="text-2xl md:text-3xl font-bold">
          Start Your Journey Today 🚀
        </h2>

        <p className="mt-3 text-sm opacity-90">
          Join thousands of students building their future with us.
        </p>

        <button
          onClick={handleExplore}
          className="mt-6 px-6 py-3 bg-[#fbd300] text-black rounded-xl font-medium hover:scale-105 transition"
        >
          Explore Now →
        </button>

      </div>

    </div>
  );
};

export default AboutPage;