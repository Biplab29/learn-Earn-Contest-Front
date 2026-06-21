import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { FaArrowRight, FaUsers, FaUser } from "react-icons/fa";
import { FiCalendar, FiClock, FiDownload } from "react-icons/fi";
import API from "../../../services/axios";
import {
  getContestBriefingName,
  getContestBriefingUrl,
} from "@/utils/contestBriefing";
import ContestPreviewModal from "@/features/student/ContestPreviewModal";
import { fetchContests } from "@/features/contest/contestSlice";

const ContestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { contests = [] } = useSelector((state) => state.contest);
  const contest = contests.find((c) => c._id === id);

  const [isJoined, setIsJoined] = useState(false);
  const [selectedContest, setSelectedContest] = useState(null);

  const contestType =
    contest?.type || contest?.participationType || "solo";

  const startDate = contest?.startDate
    ? new Date(contest.startDate)
    : null;

  const deadline = contest?.deadline
    ? new Date(contest.deadline)
    : null;

  const duration =
    startDate && deadline
      ? Math.round((deadline - startDate) / (1000 * 60 * 60))
      : "N/A";
  const briefingUrl = getContestBriefingUrl(contest);
  const briefingName = getContestBriefingName(contest);

  useEffect(() => {
    if (!contest && id) {
      dispatch(fetchContests());
    }
  }, [contest, dispatch, id]);

  // ✅ CHECK PARTICIPATION
  useEffect(() => {
    const checkParticipation = async () => {
      try {
        const res = await API.get("/participations/my-participations");

        const found = res.data.participations.find(
          (p) => p.contest?._id === id
        );

        if (found) {
          setIsJoined(true);
        }
      } catch (err) {
        console.log(err);
      }
    };

    checkParticipation();
  }, [id]);

  const getLabel = (type) => {
    if (type === "solo") return "Individual";
    if (type === "team") return "Team";
    return "Individual & Team";
  };

  const renderIcon = (type) => {
    if (type === "solo") return <FaUser />;
    if (type === "team") return <FaUsers />;
    return (
      <div className="flex -space-x-1">
        <FaUser />
        <FaUsers />
      </div>
    );
  };

  if (!contest) {
    return (
      <div className="theme-page-shell flex min-h-[60vh] items-center justify-center">
        Loading contest...
      </div>
    );
  }

  return (
    <div className="theme-page-shell min-h-screen">

      <div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-10">

        {/* LEFT */}
        <div>
          <div className="rounded-2xl overflow-hidden shadow-sm">
            <img
              src={contest.image}
              onError={(e) => {
                e.target.style.display = "none";
                e.target.parentNode.style.background =
                  "linear-gradient(135deg,#1e293b,#0f172a)";
              }}
              className="w-full h-[380px] object-cover"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">

            <div className="theme-surface rounded-xl p-4">
              <p className="theme-text-muted text-xs">Participants</p>
              <p className="theme-text font-semibold">
                {contest.participants?.length || 0}
              </p>
            </div>

            <div className="theme-surface rounded-xl p-4">
              <p className="theme-text-muted text-xs">Duration</p>
              <p className="theme-text font-semibold">
                {duration !== "N/A" ? `${duration} hrs` : "N/A"}
              </p>
            </div>

          </div>
        </div>

        {/* RIGHT */}
        <div>

          <h1 className="theme-text text-3xl font-semibold">
            {contest.title}
          </h1>

          <div className="flex gap-2 mt-3 flex-wrap">

            <span className="theme-surface-muted rounded-full px-3 py-1 text-xs">
              {contest.status}
            </span>

            <span className="theme-surface-muted flex items-center gap-1 rounded-full px-3 py-1 text-xs">
              {renderIcon(contestType)}
              {getLabel(contestType)}
            </span>

          </div>

          <p className="theme-text-soft mt-5 text-sm leading-relaxed">
            {contest.description}
          </p>

          {briefingUrl ? (
            <a
              href={briefingUrl}
              target="_blank"
              rel="noreferrer"
              download
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-sky-100 px-4 py-2 text-sm font-medium text-sky-700 transition hover:bg-sky-200"
            >
              <FiDownload />
              Download {briefingName}
            </a>
          ) : null}

          {/* ✅ BUTTON FIXED */}
          {!isJoined ? (
            <button
              onClick={() => navigate(`/student/contest/${contest._id}`)}
              className="theme-brand-button mt-6 flex items-center gap-2 rounded-lg px-6 py-3 font-semibold"
            >
              Participate <FaArrowRight />
            </button>
          ) : (
            <button
              onClick={() => navigate(`/student/submit/${contest._id}`)}
              className="theme-outline-button mt-6 flex items-center gap-2 rounded-lg px-6 py-3 font-semibold"
            >
              Submit Project <FaArrowRight />
            </button>
          )}

          <div className="mt-10 border-t pt-6 space-y-4 text-sm">

            <div className="flex justify-between">
              <span className="theme-text-muted">Start Date</span>
              <span className="flex items-center gap-1">
                <FiCalendar />
                {startDate?.toLocaleDateString() || "N/A"}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="theme-text-muted">Deadline</span>
              <span className="flex items-center gap-1">
                <FiClock />
                {deadline?.toLocaleDateString() || "N/A"}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="theme-text-muted">Participation</span>
              <span>{getLabel(contestType)}</span>
            </div>

          </div>

        </div>

      </div>

      {/* RELATED */}
      <div className="max-w-6xl mx-auto px-4 pb-10">

        <div className="flex justify-between mb-6">
          <h2 className="theme-text font-medium">
            More contests
          </h2>

          <button
            onClick={() => navigate("/contests")}
            className="text-[#82C600] text-sm"
          >
            View all →
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">

          {contests
            .filter(
              (c) =>
                String(c._id).slice(0, 4) !==
                String(contest._id).slice(0, 4)
            )
            .slice(0, 3)
            .map((item) => (
              <div
                key={item._id}
                onClick={() => setSelectedContest(item)}
                className="theme-surface theme-card-hover cursor-pointer rounded-xl"
              >
                <img
                  src={item.image}
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.parentNode.style.background =
                      "linear-gradient(135deg,#1e293b,#0f172a)";
                  }}
                  className="h-40 w-full object-cover rounded-t-xl"
                />

                <div className="p-3">
                  <h3 className="theme-text text-sm font-semibold">
                    {item.title}
                  </h3>
                  <p className="theme-text-soft line-clamp-2 text-xs">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}

        </div>

      </div>

      <ContestPreviewModal
        selectedContest={selectedContest}
        onClose={() => setSelectedContest(null)}
      />

    </div>
  );
};

export default ContestDetails;
