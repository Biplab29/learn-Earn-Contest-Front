import Hero from "@/features/home/components/Hero";
import WhyJoin from "@/features/home/components/WhyJoin";
import Challenges from "@/features/home/components/Challenges";
import ReviewSlider from "@/features/home/components/ReviewSlider";
import { useLoader } from "@/context/LoaderContext";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { getAuthRole } from "@/utils/authStorage";

const HomePage = () => {
  const { setDisableLoader } = useLoader();
  const role = getAuthRole();

  useEffect(() => {
    // ❌ Disable loader on Home page
    setDisableLoader(true);

    return () => {
      // ✅ Enable loader again when leaving page
      setDisableLoader(false);
    };
  }, [setDisableLoader]);

  // 🔐 Redirect Admin
  if (role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <div className="w-full bg-white dark:bg-gray-950 overflow-x-hidden">

      {/* 🔥 HERO (Full Width Section) */}
      <Hero />

      {/* 🔥 WHY JOIN */}
      <div className="w-full py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-10">
        <WhyJoin />
      </div>

      {/* 🔥 CHALLENGES */}
      <div className="w-full py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-10 bg-gray-50 dark:bg-gray-900">
        <Challenges />
      </div>

      {/* 🔥 REVIEWS */}
      <div className="w-full py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-10">
        <ReviewSlider />
      </div>

    </div>
  );
};

export default HomePage;