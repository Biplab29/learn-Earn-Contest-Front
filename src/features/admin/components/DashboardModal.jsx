import { useNavigate } from "react-router-dom";

const DashboardModal = ({
  isOpen,
  onClose,
  data,
  title,
  loading,
  selectedContest,
  onContestClick,
  setSelectedContest,
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const isUsers = data && data.usersList;
  const isContests = data && data.contestList;
  const isSubmissions = Array.isArray(data);
  const isPendingApprovals =
    title === "PENDING APPROVALS" && data && !Array.isArray(data);

  return (
    <div className="theme-modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="theme-modal-panel w-full max-w-[720px] max-h-[88vh] overflow-y-auto rounded-3xl p-6">

        {/* HEADER */}
        <div className="theme-border mb-6 flex items-center justify-between border-b pb-3">
          <h2 className="text-2xl font-bold text-lime-600">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="theme-icon-button rounded-full p-2"
          >
            ×
          </button>
        </div>

        {loading ? (
          <div className="theme-text-soft py-10 text-center">
            Loading details...
          </div>
        ) : (
          <>

            {/* ================= USERS ================= */}
            {isUsers && (
              <>
                <div className="text-center mb-5">
                  <h2>Total Users</h2>
                  <h1 className="text-3xl font-bold text-blue-600">
                    {data.totalUsers}
                  </h1>
                </div>

                {data.usersList.map((user) => (
                  <div
                    key={user._id}
                    className="theme-surface mb-3 rounded-xl p-4"
                  >
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                ))}
              </>
            )}

            {/* ================= ACTIVE CONTESTS ================= */}
            {isContests && (
              <div className="theme-surface rounded-2xl p-4 sm:p-6">

                {/* HEADER */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                      Active Contests
                    </h2>
                    <p className="text-xs text-gray-400">
                      Ongoing competitions
                    </p>
                  </div>

                  <h1 className="text-3xl font-bold text-lime-600">
                    {data.totalActiveContests}
                  </h1>
                </div>

                {/* SCROLL CONTAINER */}
                <div className="space-y-4 max-h-[400px] overflow-y-auto no-scrollbar fade-bottom scroll-smooth">

                  {data.contestList.map((contest) => (
                    <div
                      key={contest._id}
                      className="theme-interactive-row theme-surface-muted group flex cursor-pointer gap-4 rounded-xl p-4 transition-all duration-300"
                    >

                      {/* 🖼️ IMAGE */}
                      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={contest.image || "https://via.placeholder.com/100"}
                          alt={contest.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                        />
                      </div>

                      {/* CONTENT */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2">

                          <div>
                            <h3 className="font-semibold text-gray-800 dark:text-white group-hover:text-lime-600 transition">
                              {contest.title}
                            </h3>

                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                              {contest.description}
                            </p>
                          </div>

                          {/* STATUS BADGE */}
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-medium
                ${contest.status === "active"
                                ? "bg-lime-100 text-lime-700 dark:bg-lime-900 dark:text-lime-300"
                                : contest.status === "completed"
                                  ? "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                                  : contest.status === "upcoming"
                                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                                    : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                              }`}
                          >
                            {contest.status?.charAt(0).toUpperCase() + contest.status?.slice(1)}
                          </span>

                        </div>
                      </div>

                    </div>
                  ))}

                </div>
              </div>
            )}

            {isPendingApprovals && (
              <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="theme-surface-muted rounded-2xl p-4">
                    <p className="theme-text-muted text-xs uppercase tracking-[0.18em]">
                      Total Pending
                    </p>
                    <p className="theme-text mt-3 text-2xl font-bold">
                      {data.count || 0}
                    </p>
                  </div>

                  <div className="theme-surface-muted rounded-2xl p-4">
                    <p className="theme-text-muted text-xs uppercase tracking-[0.18em]">
                      Submission Reviews
                    </p>
                    <p className="theme-text mt-3 text-2xl font-bold">
                      {data.submissionPendingCount || 0}
                    </p>
                  </div>

                  <div className="theme-surface-muted rounded-2xl p-4">
                    <p className="theme-text-muted text-xs uppercase tracking-[0.18em]">
                      Team Requests
                    </p>
                    <p className="theme-text mt-3 text-2xl font-bold">
                      {data.teamPendingCount || 0}
                    </p>
                  </div>
                </div>

                <div className="theme-surface rounded-2xl p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="theme-text text-lg font-semibold">
                        Recent Team Approval Requests
                      </h3>
                      <p className="theme-text-soft mt-1 text-sm">
                        Latest pending teams from the dashboard feed.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        onClose?.();
                        navigate("/admin/requests");
                      }}
                      className="theme-brand-button rounded-2xl px-4 py-2 text-sm font-semibold"
                    >
                      Open Requests
                    </button>
                  </div>

                  <div className="mt-4 space-y-3">
                    {(data.recentPendingTeams || []).length === 0 ? (
                      <div className="theme-surface-muted rounded-2xl p-4 text-sm">
                        No pending team approval requests right now.
                      </div>
                    ) : (
                      (data.recentPendingTeams || []).map((team) => (
                        <div
                          key={team._id}
                          className="theme-surface-muted rounded-2xl p-4"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div>
                              <p className="theme-text font-semibold">
                                {team.teamName}
                              </p>
                              <p className="theme-text-soft mt-1 text-sm">
                                Contest: {team.contest?.title || "N/A"}
                              </p>
                            </div>

                            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
                              {team.status || "pending"}
                            </span>
                          </div>

                          <p className="theme-text-soft mt-3 text-sm">
                            Leader: {team.leader?.name || "Unknown"}{" "}
                            {team.leader?.email ? `(${team.leader.email})` : ""}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
            {/* ================= TOTAL SUBMISSIONS ================= */}
            {title === "TOTAL SUBMISSIONS" && isSubmissions && (
              <>
                {!selectedContest &&
                  data.map((contest) => (
                    <div
                      key={contest._id}
                      onClick={() => onContestClick(contest)}
                      className="theme-interactive-row theme-surface mb-3 cursor-pointer rounded-xl p-4"
                    >
                      <h3>{contest.title}</h3>
                      <p>{contest.description}</p>
                    </div>
                  ))}

                {selectedContest && (
                  <>
                    <button
                      onClick={() => setSelectedContest(null)}
                      className="mb-3"
                    >
                      ← Back
                    </button>

                    {selectedContest.submissionDetails?.map((sub) => (
                      <div
                        key={sub.submissionId}
                        className="theme-surface mb-3 rounded-xl p-4"
                      >
                        <p>{sub.student?.name}</p>
                        <p>{sub.student?.email}</p>

                        <button
                          onClick={() =>
                            navigate("/admin/evaluation", {
                              state: {
                                contest: selectedContest,
                                submission: sub,
                              },
                            })
                          }
                          className="theme-brand-button mt-2 rounded px-3 py-1 text-sm font-semibold"
                        >
                          Evaluate
                        </button>
                      </div>
                    ))}
                  </>
                )}
              </>
            )}

            {/* ================= EVALUATION ================= */}
            {title === "EVALUATION" && isSubmissions &&
              data.map((sub) => (
                <div
                  key={sub.submissionId}
                  className="theme-surface mb-3 rounded-xl p-4"
                >
                  <h3>{sub.contest?.title}</h3>
                  <p>{sub.student?.name}</p>
                  <p>{sub.student?.email}</p>

                  <button
                    onClick={() =>
                      navigate("/admin/evaluation", {
                        state: {
                          contest: sub.contest,
                          submission: sub,
                        },
                      })
                    }
                    className="theme-brand-button mt-2 rounded px-3 py-1 text-sm font-semibold"
                  >
                    Evaluate
                  </button>
                </div>
              ))}

          </>
        )}
      </div>
    </div>
  );
};

export default DashboardModal;
