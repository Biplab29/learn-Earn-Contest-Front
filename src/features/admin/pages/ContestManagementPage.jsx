import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import {
  deleteContest,
  fetchContests,
  updateContest,
} from "@/features/contest/contestSlice";

import {
  FiDownload,
  FiImage,
  FiPlusCircle,
  FiSave,
  FiSearch,
  FiUsers,
  FiX,
} from "react-icons/fi";
import {
  getContestBriefingName,
  getContestBriefingUrl,
} from "@/utils/contestBriefing";
import ContestPreviewModal from "./ContestPreviewModal";
import { ContestGridSkeleton } from "@/components/ui/SkeletonLoaders";


const emptyForm = {
  id: "",
  title: "",
  category: "",
  description: "",
  startDate: "",
  deadline: "",
  status: "upcoming",
  participationType: "solo",
  maxTeamSize: "",
  rewardsText: "",
  requirementsText: "",
  imageUrl: "",
  imageFile: null,
  imagePreview: "",
  briefingUrl: "",
  briefingName: "",
  briefingPdfFile: null,
};

const normalizeDateInput = (value) => {
  if (!value) {
    return "";
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return parsedDate.toISOString().split("T")[0];
};

const normalizeListText = (value) => {
  if (Array.isArray(value)) {
    return value.filter(Boolean).join(", ");
  }

  if (typeof value === "string") {
    return value;
  }

  return "";
};

const formatDate = (value, fallback = "N/A") => {
  if (!value) {
    return fallback;
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return fallback;
  }

  return parsedDate.toLocaleDateString();
};

const formatDateTime = (value, fallback = "N/A") => {
  if (!value) {
    return fallback;
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return fallback;
  }

  return parsedDate.toLocaleString([], {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getParticipationModeLabel = (value) => {
  if ((value || "").toLowerCase() === "both") {
    return "Solo + Team";
  }

  return value || "solo";
};

const normalizeContestForm = (contest) => ({
  id: contest?._id || contest?.id || "",
  title: contest?.title || "",
  category: contest?.category || "",
  description: contest?.description || "",
  startDate: normalizeDateInput(contest?.startDate),
  deadline: normalizeDateInput(contest?.deadline),
  status: contest?.status || "upcoming",
  participationType: contest?.participationType || "solo",
  maxTeamSize:
    contest?.participationType !== "solo"
      ? String(contest?.maxTeamSize || "")
      : "",
  rewardsText: normalizeListText(contest?.rewards || contest?.prize),
  requirementsText: normalizeListText(contest?.requirements),
  imageUrl: contest?.image || "",
  imageFile: null,
  imagePreview: contest?.image || "",
  briefingUrl: getContestBriefingUrl(contest),
  briefingName: getContestBriefingName(contest),
  briefingPdfFile: null,
});

const buildContestPayload = (form) => {
  const cleanRewards = form.rewardsText
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const cleanRequirements = form.requirementsText
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const useFormData = form.imageFile instanceof File;
  const hasBriefingPdf = form.briefingPdfFile instanceof File;

  if (useFormData || hasBriefingPdf) {
    const formData = new FormData();
    formData.append("title", form.title.trim());
    formData.append("category", form.category);
    formData.append("description", form.description.trim());
    formData.append("startDate", form.startDate);
    formData.append("deadline", form.deadline);
    formData.append("status", form.status);
    formData.append("participationType", form.participationType);
    formData.append(
      "maxTeamSize",
      form.participationType !== "solo" ? form.maxTeamSize || "2" : "1"
    );
    formData.append("rewards", cleanRewards.join(","));
    formData.append("requirements", cleanRequirements.join(","));
    if (form.imageFile) {
      formData.append("image", form.imageFile);
    }

    if (form.briefingPdfFile) {
      formData.append("projectBriefing", form.briefingPdfFile);
    }
    return formData;
  }

  return {
    title: form.title.trim(),
    category: form.category,
    description: form.description.trim(),
    startDate: form.startDate,
    deadline: form.deadline,
    status: form.status,
    participationType: form.participationType,
    maxTeamSize:
      form.participationType !== "solo" ? Number(form.maxTeamSize || 2) : 1,
    rewards: cleanRewards.join(","),
    requirements: cleanRequirements.join(","),
  };
};

const ContestManagementPage = () => {
  const dispatch = useDispatch();
  const { contests = [], loading } = useSelector((state) => state.contest);
  const [selectedContest, setSelectedContest] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingContestId, setEditingContestId] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");

  useEffect(() => {
    dispatch(fetchContests());
  }, [dispatch]);

  useEffect(() => {
    return () => {
      if (form.imageFile && form.imagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(form.imagePreview);
      }
    };
  }, [form.imageFile, form.imagePreview]);

  const filteredContests = useMemo(() => {
    return contests
      .filter(Boolean)
      .filter((contest) => {
        const query = search.trim().toLowerCase();

        if (!query) {
          return true;
        }

        return (
          contest.title?.toLowerCase().includes(query) ||
          contest.description?.toLowerCase().includes(query)
        );
      })
      .filter((contest) =>
        statusFilter === "all" ? true : contest.status === statusFilter
      );
  }, [contests, search, statusFilter]);

  const handleEditOpen = (contest) => {
    setEditingContestId(contest?._id || contest?.id || "");
    setForm(normalizeContestForm(contest));
  };

  const handleEditClose = () => {
    if (form.imageFile && form.imagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(form.imagePreview);
    }

    setEditingContestId("");
    setForm(emptyForm);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "participationType" && value === "solo"
        ? { maxTeamSize: "" }
        : {}),
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file for the contest banner");
      event.target.value = "";
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    setForm((prev) => {
      if (prev.imageFile && prev.imagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(prev.imagePreview);
      }

      return {
        ...prev,
        imageFile: file,
        imagePreview: previewUrl,
      };
    });
  };

  const handleBriefingPdfChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      toast.error("Please choose a PDF file for the contest briefing");
      event.target.value = "";
      return;
    }

    setForm((prev) => ({
      ...prev,
      briefingPdfFile: file,
      briefingName: file.name,
    }));
  };

  const handleSave = async () => {
    if (!form.id) {
      toast.error("Contest ID is missing");
      return;
    }

    if (!form.title.trim() || !form.category || !form.description.trim()) {
      toast.error("Title, category, and description are required");
      return;
    }

    if (!form.startDate || !form.deadline) {
      toast.error("Start date and deadline are required");
      return;
    }

    if (
      form.participationType !== "solo" &&
      (!form.maxTeamSize || Number(form.maxTeamSize) < 2)
    ) {
      toast.error("Team contests must have at least 2 members");
      return;
    }

    try {
      setSaving(true);

      await dispatch(
        updateContest({
          id: form.id,
          data: buildContestPayload(form),
        })
      ).unwrap();

      await dispatch(fetchContests());
      toast.success("Contest updated successfully");
      handleEditClose();
    } catch (err) {
      toast.error(err?.message || err?.data?.message || "Contest update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (contestId) => {
    if (!contestId) {
      return;
    }

    if (!window.confirm("Delete this contest from the admin list?")) {
      return;
    }

    try {
      setDeletingId(contestId);
      await dispatch(deleteContest(contestId)).unwrap();
      toast.success("Contest deleted successfully");

      if (editingContestId === contestId) {
        handleEditClose();
      }
    } catch (err) {
      toast.error(err?.message || err?.data?.message || "Contest delete failed");
    } finally {
      setDeletingId("");
    }
  };

  return (
    <div className="theme-page-shell min-h-screen p-4 sm:p-6">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="theme-text text-2xl font-bold sm:text-3xl">
            All Contest Management
          </h1>
         
        </div>

        <div className="grid gap-3 sm:grid-cols-[1fr_auto] lg:min-w-[460px]">
          <label className="theme-surface flex items-center gap-2 rounded-2xl px-4 py-3 shadow-sm">
            <FiSearch className="theme-text-muted" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search contests..."
              className="w-full bg-transparent text-sm outline-none"
            />
          </label>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="theme-input rounded-2xl px-4 py-3 text-sm shadow-sm outline-none"
          >
            <option value="all">All status</option>
            <option value="upcoming">Upcoming</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {loading ? (
        <ContestGridSkeleton count={4} />
      ) : filteredContests.length === 0 ? (
        <div className="theme-surface rounded-3xl border border-dashed px-6 py-16 text-center theme-text-muted">
          No contests found
        </div>
      ) : (
        <div className="grid gap-5 xl:grid-cols-2 items-stretch">
          {filteredContests.map((contest) => {
            const contestId = contest?._id || contest?.id || "";
            const rewardsLabel = normalizeListText(contest?.rewards || contest?.prize);
            const isEditing = editingContestId === contestId;
            const briefingUrl = getContestBriefingUrl(contest);
            const briefingName = getContestBriefingName(contest);
            const rewardsArray = Array.isArray(contest.rewards)
              ? contest.rewards.flatMap((item) =>
                typeof item === "string" ? item.split(",") : item
              )
              : [];
            return (
              <div
                key={contestId}
                className={`theme-surface overflow-hidden rounded-[28px] shadow-sm  transition ${isEditing ? "border-lime-300 shadow-lg" : ""
                  }`}
              >
                <div
                  onClick={() => setSelectedContest(contest)}
                  className="grid cursor-pointer gap-0 md:grid-cols-[220px_1fr] "
                >
                  {/* IMAGE */}
                  <div className="relative min-h-[200px] flex items-center justify-center bg-gray-100">
                    {contest.image ? (
                      <img
                        src={contest.image}
                        alt={contest.title}
                        className="max-h-[300px] w-full object-contain"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-400">
                        <FiImage className="text-3xl" />
                      </div>
                    )}

                    <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-gray-700 backdrop-blur">
                      {contest.status || "upcoming"}
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="p-5 sm:p-6 flex flex-col gap-4">

                    {/* TITLE + DESC */}
                    <div>
                      <h2 className="theme-text text-lg font-bold leading-tight line-clamp-1">
                        {contest.title}
                      </h2>
                      <p className="theme-text-soft mt-1.5 text-sm line-clamp-2">
                        {contest.description}
                      </p>
                    </div>

                    {/* INFO GRID — 3 equal columns, text never overflows */}
                    <div className="grid grid-cols-3 gap-2">

                      {/* START DATE */}
                      <div className="contest-info-start flex flex-col gap-1 p-3 rounded-2xl bg-blue-50/80 border border-blue-100 shadow-sm overflow-hidden">
                        <p className="text-[9px] font-semibold uppercase tracking-wider text-blue-400">
                          Start
                        </p>
                        <p className="text-xs font-bold text-blue-600 truncate">
                          {formatDate(contest.startDate)}
                        </p>
                      </div>

                      {/* DEADLINE */}
                      <div className="contest-info-deadline flex flex-col gap-1 p-3 rounded-2xl bg-red-50/80 border border-red-100 shadow-sm overflow-hidden">
                        <p className="text-[9px] font-semibold uppercase tracking-wider text-red-400">
                          Deadline
                        </p>
                        <p className="text-xs font-bold text-red-500 truncate">
                          {formatDate(contest.deadline)}
                        </p>
                      </div>

                      {/* TYPE */}
                      <div className="contest-info-type flex flex-col gap-1 p-3 rounded-2xl bg-green-50/80 border border-green-100 shadow-sm overflow-hidden">
                        <p className="text-[9px] font-semibold uppercase tracking-wider text-green-400">
                          Type
                        </p>
                        <p className="text-xs font-bold text-green-600 capitalize truncate">
                          {getParticipationModeLabel(contest.participationType)}
                        </p>
                      </div>

                    </div>

                    {/* FOOTER BADGES */}
                    <div className="flex flex-wrap gap-2">

                      <span className="inline-flex items-center gap-1.5 rounded-full bg-lime-100 px-3 py-1 text-xs font-medium text-lime-700">
                        <FiUsers size={11} />
                        Max: {contest.maxTeamSize || 1}
                      </span>

                      {/* REWARDS */}
                      {rewardsArray.map((reward, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700"
                        >
                          {["🥇", "🥈", "🥉"][i] || `#${i + 1}`} ₹{reward.trim()}
                        </span>
                      ))}

                      {/* PDF */}
                      {briefingUrl && (
                        <a
                          href={briefingUrl}
                          target="_blank"
                          rel="noreferrer"
                          download
                          onClick={(event) => event.stopPropagation()}
                          className="inline-flex items-center gap-1.5 rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-700 hover:bg-sky-200 transition-colors"
                        >
                          <FiDownload size={11} />
                          {briefingName || "Download PDF"}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ContestPreviewModal
        selectedContest={selectedContest}
        onClose={() => setSelectedContest(null)}
        onEdit={handleEditOpen}
        onDelete={handleDelete}
      />

      {editingContestId ? (
        <div className="theme-modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="theme-modal-panel max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[30px] p-6 shadow-2xl sm:p-7">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full bg-lime-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-lime-700">
                  <FiPlusCircle />
                  Update Contest
                </p>
                <h2 className="mt-3 text-2xl font-bold text-gray-900">
                  {form.title || "Contest"}
                </h2>
              </div>

              <button
                type="button"
                onClick={handleEditClose}
                className="rounded-full border border-gray-200 p-2 text-gray-500 transition hover:text-gray-900"
              >
                <FiX />
              </button>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Contest Title
                  </label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#82C600]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#82C600]"
                  >
                    <option value="">Select category</option>
                    <option value="Web Dev">Web Dev</option>
                    <option value="AI/ML">AI/ML</option>
                    <option value="App Dev">App Dev</option>
                    <option value="Design">Design</option>
                    <option value="Data Science">Data Science</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={5}
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#82C600]"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={form.startDate}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#82C600]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Deadline
                    </label>
                    <input
                      type="date"
                      name="deadline"
                      value={form.deadline}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#82C600]"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <select
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#82C600]"
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Participation Type
                    </label>
                    <select
                      name="participationType"
                      value={form.participationType}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#82C600]"
                    >
                      <option value="solo">Solo</option>
                      <option value="team">Team</option>
                      <option value="both">Both</option>
                    </select>
                  </div>
                </div>

                {form.participationType !== "solo" ? (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Max Team Size
                    </label>
                    <input
                      type="number"
                      min="2"
                      name="maxTeamSize"
                      value={form.maxTeamSize}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#82C600]"
                    />
                  </div>
                ) : null}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Rewards
                  </label>
                  <input
                    name="rewardsText"
                    value={form.rewardsText}
                    onChange={handleChange}
                    placeholder="Comma separated rewards"
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#82C600]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Requirements
                  </label>
                  <textarea
                    name="requirementsText"
                    value={form.requirementsText}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Comma separated requirements"
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#82C600]"
                  />
                </div>

                <div className="rounded-[26px] border border-dashed border-gray-300 p-4">
                  <label className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-700">
                    <FiImage />
                    Contest Banner
                  </label>

                  <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-[22px] bg-gray-50 p-4 text-center transition hover:bg-lime-50">
                    {form.imagePreview ? (
                      <img
                        src={form.imagePreview}
                        alt="Contest preview"
                        className="h-40 w-full rounded-2xl object-cover"
                      />
                    ) : (
                      <div className="flex h-40 w-full items-center justify-center rounded-2xl bg-white text-gray-400">
                        No banner selected
                      </div>
                    )}

                    <span className="text-xs font-medium uppercase tracking-[0.2em] text-gray-500">
                      Upload Image
                    </span>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="rounded-[26px] border border-dashed border-gray-300 p-4">
                  <label className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-700">
                    <FiDownload />
                    Project Briefing PDF
                  </label>

                  <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-[22px] bg-gray-50 p-4 text-center transition hover:bg-lime-50">
                    <div className="flex h-24 w-full items-center justify-center rounded-2xl bg-white text-gray-500">
                      {form.briefingName || "Upload PDF"}
                    </div>

                    <span className="text-xs font-medium uppercase tracking-[0.2em] text-gray-500">
                      {form.briefingName ? "Replace PDF" : "Upload PDF"}
                    </span>

                    <input
                      type="file"
                      accept="application/pdf,.pdf"
                      onChange={handleBriefingPdfChange}
                      className="hidden"
                    />
                  </label>

                  {form.briefingUrl ? (
                    <a
                      href={form.briefingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-sky-700 hover:text-sky-800"
                    >
                      <FiDownload />
                      Download current briefing
                    </a>
                  ) : null}
                </div>

               
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleEditClose}
                className="rounded-2xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:border-gray-300 hover:text-gray-900"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#82C600] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#6ea800] disabled:cursor-not-allowed disabled:opacity-70"
              >
                <FiSave />
                {saving ? "Saving..." : "Save Contest"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ContestManagementPage;
