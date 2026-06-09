import Container from "@/components/ui/Container";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchContests } from "@/features/contest/contestSlice";

import { useNavigate } from "react-router-dom";

import { FiClock, FiCalendar } from "react-icons/fi";
import { FaGift } from "react-icons/fa";
import { HiOutlineStatusOnline } from "react-icons/hi";

import "swiper/css";

const Challenges = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { contests = [], loading } = useSelector((state) => state.contest);

  const [tab, setTab] = useState("active");
  const [time, setTime] = useState(() => Date.now());

  useEffect(() => {
    dispatch(fetchContests());

    const interval = setInterval(() => {
      setTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, [dispatch]);

  const getTimeLeft = (deadline) => {
    const total = new Date(deadline) - new Date();
    if (total <= 0) return null;

    const s = Math.floor((total / 1000) % 60);
    const m = Math.floor((total / 1000 / 60) % 60);
    const h = Math.floor((total / (1000 * 60 * 60)) % 24);
    const d = Math.floor(total / (1000 * 60 * 60 * 24));

    return { d, h, m, s };
  };

  const filtered = contests.filter((c) => c.status === tab);

  return (
    <section className="relative overflow-hidden py-12 sm:py-16 lg:py-24 theme-page-shell">
      <Container>

        {/* HEADER */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-[var(--theme-text)]">
            Explore{" "}
            <span className="bg-gradient-to-r from-[#82C600] to-[#a3e635] bg-clip-text text-transparent">
              Challenges
            </span>
          </h2>
        </div>

        {/* TABS */}
        <div className="flex flex-wrap gap-3 sm:gap-4 mb-8 sm:mb-10">
          {["active", "upcoming"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-semibold transition
                ${
                  tab === t
                    ? "theme-brand-button"
                    : "theme-surface-muted theme-text-muted"
                }`}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-[380px] sm:h-[420px] lg:h-[480px] rounded-3xl theme-surface animate-pulse"
              ></div>
            ))}
          </div>
        ) : (
          <div className="relative overflow-hidden">
            <Swiper
              key={tab}
              modules={[Autoplay, FreeMode]}
              spaceBetween={16}
              slidesPerView={1.1}
              loop={filtered.length > 3}
              freeMode={true}
              speed={5000}
              autoplay={{
                delay: 0,
                disableOnInteraction: false,
              }}
              breakpoints={{
                480: { slidesPerView: 1.2, spaceBetween: 16 },
                640: { slidesPerView: 2, spaceBetween: 20 },
                1024: { slidesPerView: 3, spaceBetween: 24 },
              }}
              onMouseEnter={(swiper) => swiper.autoplay.stop()}
              onMouseLeave={(swiper) => swiper.autoplay.start()}
            >
              {filtered.map((item) => {
                const t = getTimeLeft(item.deadline);

                return (
                  <SwiperSlide key={item._id}>
                    <div
                      onClick={() => navigate(`/contest/${item._id}`)}
                      className="group relative h-[380px] sm:h-[420px] lg:h-[480px] flex flex-col rounded-[24px] sm:rounded-[28px] overflow-hidden 
                      theme-surface backdrop-blur-2xl
                      hover:shadow-[0_20px_60px_rgba(130,198,0,0.25)]
                      transition-all duration-500 hover:-translate-y-1 sm:hover:-translate-y-2 hover:scale-[1.01] sm:hover:scale-[1.02]
                      cursor-pointer"
                    >

                      {/* IMAGE */}
                      <div className="h-40 sm:h-44 lg:h-52 relative flex-shrink-0 overflow-hidden">

                        <img
                          src={item.image || item.thumbnail}
                          className="absolute inset-0 w-full h-full object-cover blur-xl scale-110 opacity-30"
                        />

                        <img
                          src={item.image || item.thumbnail}
                          alt={item.title}
                          className="relative w-full h-full object-contain p-2 sm:p-4"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                        <span className="absolute top-2 sm:top-4 right-2 sm:right-4 flex items-center gap-1 text-[10px] sm:text-xs px-2 sm:px-3 py-1 rounded-full bg-[#82C600] text-white">
                          <HiOutlineStatusOnline />
                          {item.status}
                        </span>

                        <span className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 text-[10px] sm:text-xs px-2 sm:px-3 py-1 rounded-full theme-surface font-semibold">
                          {item.participationType}
                        </span>
                      </div>

                      {/* CONTENT */}
                      <div className="flex flex-col flex-1 p-3 sm:p-5">

                        <h3 className="text-sm sm:text-base lg:text-lg font-bold text-[var(--theme-text)] line-clamp-2 group-hover:text-[var(--theme-primary)]">
                          {item.title}
                        </h3>

                        <p className="text-xs sm:text-sm text-[var(--theme-text-soft)] mt-1 sm:mt-2 line-clamp-2">
                          {item.description}
                        </p>

                        <div className="mt-2 sm:mt-3 flex items-center gap-2 text-[var(--theme-primary)] text-xs sm:text-sm font-semibold">
                          <FaGift />
                          {item.rewards?.[0] || "No reward"}
                        </div>

                        <div className="flex items-center gap-2 text-[10px] sm:text-xs text-[var(--theme-text-muted)] mt-1 sm:mt-2">
                          <FiCalendar />
                          {new Date(item.startDate).toLocaleDateString()}
                        </div>

                        {t && item.status === "active" && (
                          <div className="mt-2 sm:mt-3 flex items-center justify-between theme-surface-muted px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl text-[10px] sm:text-xs font-semibold">
                            <div className="flex items-center gap-1">
                              <FiClock /> Ends
                            </div>
                            <div className="flex gap-1">
                              <span>{t.d}d</span>
                              <span>{t.h}h</span>
                              <span>{t.m}m</span>
                            </div>
                          </div>
                        )}

                        <div className="mt-auto pt-3 sm:pt-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/contest/${item._id}`);
                            }}
                            className="w-full py-2 rounded-xl text-xs sm:text-sm font-semibold theme-brand-button transition-all duration-300"
                          >
                            View Contest →
                          </button>
                        </div>

                      </div>

                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        )}
      </Container>
    </section>
  );
};

export default Challenges;
