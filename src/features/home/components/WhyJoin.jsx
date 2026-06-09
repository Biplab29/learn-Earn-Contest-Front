import Container from "@/components/ui/Container";
import evulation from "@/assets/evulation.jpg";
import { FaUserGraduate, FaGlobe, FaChartLine } from "react-icons/fa";

const WhyJoin = () => {
  return (
    <section className="py-14 sm:py-20 bg-gradient-to-b from-[#f8fafc] to-[#eef2f7]">
      <Container>

        {/* 🔥 HEADER */}
        <div className="text-center max-w-3xl mx-auto px-2">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-gray-900">
            Why{" "}
            <span className="bg-gradient-to-r from-[#82C600] via-[#a3e635] to-[#fbd300] bg-clip-text text-transparent">
              Choose Us?
            </span>
          </h2>

          {/* 🔥 PRO SUBTEXT */}
          <p className="mt-5 sm:mt-6 text-sm sm:text-base md:text-lg 
          text-gray-600 leading-relaxed max-w-2xl mx-auto">

            Experience a{" "}
            <span className="font-semibold text-gray-800">
              modern learning ecosystem
            </span>{" "}
            designed to{" "}
            <span className="bg-gradient-to-r from-[#82c600] to-[#a3e635] bg-clip-text text-transparent font-semibold">
              reward talent
            </span>, boost growth, and unlock{" "}
            <span className="font-semibold text-gray-800">
              real-world opportunities
            </span>{" "}
            🚀

          </p>
        </div>

        {/* 🔥 TOP GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mt-12 sm:mt-16">

          {/* 🔥 LEFT BIG CARD */}
          <div className="lg:col-span-2 group 
          bg-gradient-to-br from-white via-[#f6ffe8] to-[#ecfccb]
          border border-[#82c600]/20 rounded-3xl p-5 sm:p-8 
          flex flex-col md:flex-row items-center gap-6 sm:gap-8 
          shadow-md hover:shadow-[0_10px_40px_rgba(130,198,0,0.25)]
          transition-all duration-500 hover:-translate-y-2">

            {/* TEXT */}
            <div className="flex-1 text-center md:text-left">
              <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto md:mx-0 flex items-center justify-center rounded-2xl 
              bg-gradient-to-br from-[#82c600]/20 to-[#a3e635]/20 text-[#82c600] text-xl sm:text-2xl shadow-inner 
              group-hover:scale-110 transition duration-300">
                <FaUserGraduate />
              </div>

              <h3 className="mt-4 sm:mt-6 font-semibold text-xl sm:text-2xl 
              bg-gradient-to-r from-[#82c600] to-[#a3e635] bg-clip-text text-transparent">
                Expert Evaluation
              </h3>

              {/* 🔥 PRO TEXT */}
              <p className="text-gray-600 text-sm sm:text-base mt-3 leading-relaxed 
              max-w-md mx-auto md:mx-0">
                Get evaluated by{" "}
                <span className="font-medium text-gray-800">
                  industry experts
                </span>{" "}
                and academic leaders. Receive{" "}
                <span className="text-[#82c600] font-medium">
                  deep insights
                </span>{" "}
                that help you grow beyond marks.
              </p>
            </div>

            {/* IMAGE */}
            <div className="w-full md:w-80 h-40 sm:h-44 rounded-2xl overflow-hidden shadow-md">
              <img
                src={evulation}
                alt="evaluation"
                className="w-full h-full object-cover rounded-2xl transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </div>

          {/* 🔥 RIGHT CARD */}
          <div className="group 
          bg-gradient-to-br from-[#82c600] via-[#a3e635] to-[#fbd300] 
          text-white rounded-3xl p-6 sm:p-8 shadow-lg 
          flex flex-col justify-between 
          hover:shadow-[0_20px_50px_rgba(130,198,0,0.4)]
          transition-all duration-500 hover:-translate-y-2">

            <div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-2xl bg-white/20 text-xl sm:text-2xl">
                <FaGlobe />
              </div>

              <h3 className="mt-4 sm:mt-6 font-semibold text-xl sm:text-2xl">
                Global Recognition
              </h3>

              {/* 🔥 PRO TEXT */}
              <p className="text-sm sm:text-base mt-3 opacity-95 leading-relaxed">
                Earn{" "}
                <span className="font-semibold">
                  certificates & digital badges
                </span>{" "}
                that are{" "}
                <span className="underline decoration-white/40">
                  recognized worldwide
                </span>.
              </p>
            </div>

            <div className="mt-8 sm:mt-10">
              <p className="text-3xl sm:text-4xl font-bold">500+</p>
              <p className="text-xs sm:text-sm opacity-80 tracking-wide">
                PARTNER SCHOOLS
              </p>
            </div>

          </div>

        </div>

        {/* 🔥 BOTTOM CARD */}
        <div className="mt-8 sm:mt-10 group 
        bg-gradient-to-br from-white via-[#f6ffe8] to-[#ecfccb]
        border border-[#82c600]/20 rounded-3xl p-5 sm:p-8 
        shadow-md hover:shadow-[0_10px_40px_rgba(130,198,0,0.25)]
        transition-all duration-500 hover:-translate-y-2 
        flex flex-col sm:flex-row items-start gap-4 sm:gap-6">

          <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-2xl 
          bg-gradient-to-br from-[#82c600]/20 to-[#a3e635]/20 text-[#82c600] text-xl sm:text-2xl 
          group-hover:scale-110 transition duration-300">
            <FaChartLine />
          </div>

          <div>
            <h3 className="font-semibold text-xl sm:text-2xl 
            bg-gradient-to-r from-[#82c600] to-[#a3e635] bg-clip-text text-transparent">
              Career Growth
            </h3>

            {/* 🔥 PRO TEXT */}
            <p className="text-gray-600 text-sm sm:text-base mt-3 leading-relaxed max-w-4xl">
              Build a{" "}
              <span className="font-medium text-gray-800">
                powerful portfolio
              </span>, showcase your skills, and gain a{" "}
              <span className="text-[#82c600] font-medium">
                competitive edge
              </span>{" "}
              in your academic and professional journey.
            </p>
          </div>

        </div>

      </Container>
    </section>
  );
};

export default WhyJoin;
