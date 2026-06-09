import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import ContestFormSection from "@/features/admin/components/ContestFormSection";
import ContestSidebar from "@/features/admin/components/ContestSidebar";

import {
  createContest,
  fetchContests,
} from "@/features/contest/contestSlice";

import { Rocket } from "lucide-react";

const CreateContestView = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    startDate: "",
    deadline: "",
    participationType: "solo",
    maxTeamSize: "",
  });

  const [requirements, setRequirements] = useState([]);
  const [prizes, setPrizes] = useState([]);
  const [banner, setBanner] = useState(null);
  const [briefingPdf, setBriefingPdf] = useState(null);

  useEffect(() => {
    dispatch(fetchContests());
  }, [dispatch]);

  const handleCreate = async () => {
    try {
      if (
        !form.title ||
        !form.category ||
        !form.description ||
        !form.startDate ||
        !form.deadline
      ) {
        toast.error("All fields are required");
        return;
      }

      if (
        form.participationType !== "solo" &&
        Number(form.maxTeamSize) < 2
      ) {
        toast.error("Team size must be at least 2");
        return;
      }

      setLoading(true);

      const formData = new FormData();

      // ✅ BASIC
      formData.append("title", form.title.trim());
      formData.append("category", form.category);
      formData.append("description", form.description.trim());
      formData.append("startDate", form.startDate);
      formData.append("deadline", form.deadline);

      // ✅ REWARDS (UPDATED 🔥)
      const cleanRewards = prizes
        .map((p) => p.trim())
        .filter((p) => p !== "");

      formData.append("rewards", cleanRewards.join(","));

      // ✅ REQUIREMENTS
      const cleanRequirements = requirements
        .map((r) => r.trim())
        .filter((r) => r !== "");

      formData.append("requirements", cleanRequirements.join(","));

      // ✅ PARTICIPATION
      formData.append("participationType", form.participationType);

      if (form.participationType !== "solo") {
        formData.append("maxTeamSize", form.maxTeamSize);
      }

      // ✅ IMAGE
      if (banner && banner instanceof File) {
        formData.append("image", banner);
      }

      if (briefingPdf && briefingPdf instanceof File) {
        formData.append("projectBriefing", briefingPdf);
      }

      // 🔍 DEBUG
      console.log("===== FORM DATA =====");
      for (let [key, value] of formData.entries()) {
        console.log(key, ":", value);
      }

      await dispatch(createContest(formData)).unwrap();

      toast.success("🎉 Contest Created Successfully");

      // 🔄 RESET
      setForm({
        title: "",
        category: "",
        description: "",
        startDate: "",
        deadline: "",
        participationType: "solo",
        maxTeamSize: "",
      });

      setRequirements([]);
      setPrizes([]);
      setBanner(null);
      setBriefingPdf(null);

    } catch (err) {
      console.log(err);
      toast.error(err?.message || err?.data?.message || "Create failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="theme-page-shell min-h-screen pb-28 p-6">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          🎯 Create Contest
        </h1>
      </div>

      {/* MAIN */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <ContestFormSection
          form={form}
          setForm={setForm}
          requirements={requirements}
          setRequirements={setRequirements}
          setBanner={setBanner}
          setBriefingPdf={setBriefingPdf}
          briefingPdfName={briefingPdf?.name || ""}
        />

        <ContestSidebar
          form={form}
          setForm={setForm}
          prizes={prizes}
          setPrizes={setPrizes}
        />
            
      </div>

      {/* 🔥 STICKY BUTTON */}
      <div className="mt-10 flex justify-center">
        <div className="theme-surface flex w-full max-w-xl flex-col items-center justify-between gap-4 rounded-2xl p-4 shadow-sm sm:flex-row sm:p-5">

          {/* TEXT */}
          <div className="text-center sm:text-left">
            <p className="theme-text text-sm font-semibold">
              Ready to publish your contest?
            </p>
            <p className="theme-text-soft text-xs">
              Make sure everything looks perfect before launch 🚀
            </p>
          </div>

          {/* 🔥 ULTRA BUTTON */}
          <button
            onClick={handleCreate}
            disabled={loading}
            className={`relative overflow-hidden group w-full sm:w-auto px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-300
            ${loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-[#82C600] to-[#6ea800] hover:shadow-lg hover:shadow-[#82C600]/30 active:scale-95"
              }`}
          >

            {/* Glow Effect */}
            {!loading && (
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-white/10 blur-xl" />
            )}

            {/* Content */}
            <span className="relative flex items-center justify-center gap-2">

              {/* ICON */}
              <Rocket
                size={16}
                className={`transition-transform duration-300 ${!loading && "group-hover:translate-x-1 group-hover:-translate-y-1"
                  }`}
              />

              {/* TEXT */}
              {loading ? "Creating..." : "Publish Contest"}

            </span>
          </button>

        </div>
      </div>

    </div>
  );
};

export default CreateContestView;
