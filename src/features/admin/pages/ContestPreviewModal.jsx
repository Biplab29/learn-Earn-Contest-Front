import { useNavigate } from "react-router-dom";
import {
    FiCalendar,
    FiClock,
    FiDownload,
    FiUser,
    FiUsers,
    FiX,
} from "react-icons/fi";
import {
    getContestBriefingName,
    getContestBriefingUrl,
} from "@/utils/contestBriefing";

const statusTone = {
    active:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
    completed:
        "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
    upcoming:
        "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
};

const formatDate = (value, fallback = "TBA") => {
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

const ContestPreviewModal = ({
    selectedContest,
    onClose,
    onEdit = () => {},
    onDelete = () => {},
}) => {
    const navigate = useNavigate();

    if (!selectedContest) {
        return null;
    }

    const contest = selectedContest?.contest ?? selectedContest;
    const contestId = contest?._id || contest?.id;

    if (!contestId) {
        return null;
    }

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const isLoggedIn = Boolean(token);
    const isStudent = role === "student";
    const isParticipationRecord = Boolean(selectedContest?.contest);
    const briefingUrl = getContestBriefingUrl(contest);
    const briefingName = getContestBriefingName(contest);
    const participationType =
        selectedContest?.participationType || contest?.participationType || "solo";
    const tone =
        statusTone[contest.status?.toLowerCase?.()] || statusTone.upcoming;

    const daysLeft = contest.deadline
        ? Math.ceil((new Date(contest.deadline) - new Date()) / (1000 * 60 * 60 * 24))
        : null;

    const primaryLabel = (() => {
        if (!isLoggedIn) {
            return "View Details";
        }

        if (isParticipationRecord && isStudent && contest.status !== "completed") {
            return "Open Submission";
        }

        if (isStudent) {
            return "Participate";
        }

        return "View Details";
    })();

    const handlePrimaryAction = () => {
        onClose?.();

        if (!isLoggedIn) {
            navigate(`/contest/${contestId}`);
            return;
        }

        if (isParticipationRecord && isStudent && contest.status !== "completed") {
            navigate(`/student/submit/${contestId}`);
            return;
        }

        if (isStudent) {
            navigate(`/student/contest/${contestId}`);
            return;
        }

        navigate(`/contest/${contestId}`);
    };

    const handleEditOpen = () => {
        if (onClose) onClose();
        if (onEdit) onEdit(contest);
    };

    const handleDelete = () => {
        if (onClose) onClose();
        if (onDelete) onDelete(contestId);
    };

    const infoCards = [
        {
            label: "Start",
            value: formatDate(contest.startDate),
            icon: <FiCalendar />,
        },
        {
            label: "Deadline",
            value: formatDate(contest.deadline),
            icon: <FiClock />,
        },
        {
            label: "Participants",
            value: contest.participants?.length || contest.users?.length || 0,
            icon: <FiUsers />,
        },
        {
            label: "Mode",
            value: participationType === "both" ? "Solo + Team" : participationType,
            icon: participationType === "team" ? <FiUsers /> : <FiUser />,
        },
        {
            label: "Created",
            value: formatDateTime(contest.createdAt || contest.created_at),
            icon: <FiClock />,
        },
    ];

    return (
        <div
            className="theme-modal-overlay fixed inset-0 z-[10000] flex items-center justify-center p-3 sm:p-4"
            onClick={onClose}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-label={contest.title || "Contest details"}
                className="theme-modal-panel relative max-h-[90dvh] w-full max-w-3xl overflow-y-auto rounded-[30px]"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close contest preview"
                    className="theme-icon-button absolute right-4 top-4 z-10 rounded-full p-2"
                >
                    <FiX />
                </button>

                <div className="relative h-52 overflow-hidden sm:h-64">
                    <img
                        src={contest.image || "/default.jpg"}
                        alt={contest.title || "Contest"}
                        className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/28 to-transparent" />

                    <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-6">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${tone}`}>
                                {contest.status || "Upcoming"}
                            </span>
                            {contest.category && (
                                <span className="rounded-full border border-white/20 bg-white/12 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur">
                                    {contest.category}
                                </span>
                            )}
                            {contest.level && (
                                <span className="rounded-full border border-white/20 bg-white/12 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur">
                                    {contest.level}
                                </span>
                            )}
                        </div>

                        <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
                            {contest.title}
                        </h2>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-100/92 sm:text-base">
                            {contest.description || "No description available."}
                        </p>
                    </div>
                </div>

                <div className="space-y-5 p-4 sm:p-6">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
                        {infoCards.map((item) => (
                            <div
                                key={item.label}
                                className="theme-surface-muted rounded-2xl p-4"
                            >
                                <div className="theme-text-muted flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em]">
                                    {item.icon}
                                    {item.label}
                                </div>
                                <p className="theme-text mt-3 text-sm font-semibold capitalize sm:text-base">
                                    {item.value}
                                </p>
                            </div>
                        ))}
                    </div>

                    {isParticipationRecord && (
                        <div className="theme-surface-muted rounded-2xl p-4 sm:p-5">
                            <p className="theme-text text-sm font-semibold">
                                Your participation
                            </p>
                            <p className="theme-text-soft mt-2 text-sm leading-6">
                                {selectedContest.participationType === "team"
                                    ? `Joined with ${selectedContest.team?.teamName || "your team"
                                    }.`
                                    : "Joined as an individual participant."}
                            </p>
                        </div>
                    )}

                    {briefingUrl ? (
                        <div className="theme-surface-muted rounded-2xl p-4 sm:p-5">
                            <p className="theme-text text-sm font-semibold">
                                Project Brief
                            </p>
                            <p className="theme-text-soft mt-2 text-sm leading-6">
                                Download the official contest brief to review the project scope
                                and submission requirements.
                            </p>

                            <a
                                href={briefingUrl}
                                target="_blank"
                                rel="noreferrer"
                                download
                                className="theme-brand-button mt-4 inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold"
                            >
                                <FiDownload />
                                Download {briefingName}
                            </a>
                        </div>
                    ) : null}

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="theme-text text-sm font-semibold">
                                {daysLeft === null
                                    ? "Schedule coming soon"
                                    : daysLeft > 0
                                        ? `${daysLeft} day${daysLeft === 1 ? "" : "s"} left`
                                        : "Contest window closed"}
                            </p>

                        </div>

                        <div className="flex gap-2">

                            {/* UPDATE */}
                            <button
                                onClick={handleEditOpen}
                                className="bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-600"
                            >
                                Edit
                            </button>

                            {/* DELETE */}
                            <button
                                onClick={handleDelete}
                                className="bg-red-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-600"
                            >
                                Delete
                            </button>

                            {/* EXISTING BUTTON */}
                            

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContestPreviewModal;
