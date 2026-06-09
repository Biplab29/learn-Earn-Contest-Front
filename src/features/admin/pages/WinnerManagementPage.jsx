import { useEffect, useState } from "react";

import AlertModal from "@/components/ui/AlertModal";
import UserAvatar from "@/components/ui/UserAvatar";
import useAlertModal from "@/hooks/useAlertModal";
import API from "../../../services/axios";

import {
  FiArrowLeft,
  FiAward,
  FiEdit2,
  FiExternalLink,
  FiSave,
  FiTrash2,
  FiX,
} from "react-icons/fi";
import { formatRegistrationDate } from "@/utils/userProfile";

const getSubmissionId = (submission) =>
  submission?.submissionId ||
  submission?._id ||
  submission?.id ||
  submission?.submission?.submissionId ||
  submission?.submission?._id ||
  submission?.submission?.id ||
  "";

const getContestId = (contest) =>
  contest?.contestId || contest?._id || contest?.id || contest?.contest?._id || "";

const getSubmissionStudent = (submission) => {
  const teamLeader =
    submission?.team?.leader && typeof submission.team.leader === "object"
      ? submission.team.leader
      : null;
  const firstTeamMember =
    submission?.team?.members?.find(
      (member) => member && typeof member === "object"
    ) || null;

  return (
    submission?.student ||
    submission?.user ||
    submission?.submittedBy ||
    teamLeader ||
    firstTeamMember ||
    null
  );
};

const normalizeSubmission = (submission) => ({
  ...submission,
  submissionId: getSubmissionId(submission),
  student: getSubmissionStudent(submission),
});

const normalizeContest = (contest) => ({
  ...contest,
  submissionDetails: (contest?.submissionDetails || []).map(normalizeSubmission),
});

const getWinnerUser = (winner) =>
  winner?.user ||
  winner?.student ||
  winner?.submittedBy ||
  winner?.submission?.student ||
  winner?.submission?.user ||
  winner?.submission?.submittedBy ||
  getSubmissionStudent(winner?.submission) ||
  getSubmissionStudent(winner) ||
  null;

const getWinnerSubmission = (winner) => {
  if (!winner || typeof winner !== "object") {
    return null;
  }

  if (!winner?.submission || typeof winner.submission !== "object") {
    return normalizeSubmission(winner);
  }

  return normalizeSubmission({
    ...winner.submission,
    ...winner,
    student:
      winner.submission.student ||
      winner.submission.submittedBy ||
      winner.student ||
      winner.user ||
      winner.submission.user ||
      getSubmissionStudent(winner.submission) ||
      getSubmissionStudent(winner) ||
      null,
  });
};

const findMatchingSubmission = (submissions = [], winner) => {
  const winnerSubmissionId = getSubmissionId(winner);

  if (winnerSubmissionId) {
    const matchedById = submissions.find(
      (submission) => getSubmissionId(submission) === winnerSubmissionId
    );

    if (matchedById) {
      return matchedById;
    }
  }

  const winnerUser = getWinnerUser(winner);
  const winnerUserId = winnerUser?._id ? String(winnerUser._id) : "";
  const winnerEmail = winnerUser?.email?.trim().toLowerCase() || "";

  return (
    submissions.find((submission) => {
      const submissionUserId = submission?.student?._id
        ? String(submission.student._id)
        : "";
      const submissionEmail =
        submission?.student?.email?.trim().toLowerCase() || "";

      if (winnerUserId && submissionUserId === winnerUserId) {
        return true;
      }

      if (winnerEmail && submissionEmail === winnerEmail) {
        return true;
      }

      return false;
    }) || null
  );
};

const sortSubmissions = (submissions = []) =>
  [...submissions].sort((a, b) => {
    const scoreDiff = (b.totalScore || 0) - (a.totalScore || 0);
    if (scoreDiff !== 0) {
      return scoreDiff;
    }

    return (
      new Date(a.submittedAt || a.createdAt || 0) -
      new Date(b.submittedAt || b.createdAt || 0)
    );
  });

const WinnerManagementPage = () => {
  const { alertState, showAlert, closeAlert } = useAlertModal();
  const [winners, setWinners] = useState([]);
  const [contestMap, setContestMap] = useState({});
  const [selectedWinner, setSelectedWinner] = useState(null);
  const [winnerSubmissionId, setWinnerSubmissionId] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const loadWinnerData = async () => {
      try {
        setLoading(true);

        const [winnersRes, contestsRes] = await Promise.all([
          API.get("/submission/winners"),
          API.get("/submission/submitted-contests").catch(() => null),
        ]);

        const winnerList = winnersRes?.data?.winners || [];
        const contests = (
          contestsRes?.data?.contests ||
          contestsRes?.data?.data ||
          []
        ).map(normalizeContest);
        const nextContestMap = contests.reduce((acc, contest) => {
          const contestId = String(getContestId(contest));

          if (contestId) {
            acc[contestId] = contest;
          }

          return acc;
        }, {});

        setContestMap(nextContestMap);
        setWinners(winnerList);
      } catch (err) {
        showAlert({
          message:
            err.response?.data?.message || "Unable to load winner records.",
          variant: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    loadWinnerData();
  }, [showAlert]);

  const openWinnerDetail = (winnerRecord) => {
    const contestId = getContestId(winnerRecord);
    const matchedSubmission = findMatchingSubmission(
      contestId
        ? contestMap[String(contestId)]?.submissionDetails || []
        : [],
      winnerRecord?.winner
    );

    setSelectedWinner(winnerRecord);
    setWinnerSubmissionId(
      getSubmissionId(winnerRecord?.winner) || getSubmissionId(matchedSubmission)
    );
    setIsEditing(false);
  };

  const selectedContest = selectedWinner
    ? contestMap[String(getContestId(selectedWinner))]
    : null;
  const candidateSubmissions = sortSubmissions(
    (selectedContest?.submissionDetails || []).filter(
      (submission) =>
        submission.status === "evaluated" ||
        getSubmissionId(submission) === getSubmissionId(selectedWinner?.winner)
    )
  );
  const currentWinnerUser = getWinnerUser(selectedWinner?.winner);
  const currentWinnerSubmission =
    findMatchingSubmission(candidateSubmissions, selectedWinner?.winner) ||
    getWinnerSubmission(selectedWinner?.winner);
  const selectedCandidateSubmission =
    candidateSubmissions.find(
      (submission) => getSubmissionId(submission) === winnerSubmissionId
    ) || currentWinnerSubmission;

  useEffect(() => {
    if (!selectedWinner || !candidateSubmissions.length) {
      return;
    }

    const activeSelection = candidateSubmissions.some(
      (submission) => getSubmissionId(submission) === winnerSubmissionId
    );

    if (activeSelection) {
      return;
    }

    const matchedSubmission = findMatchingSubmission(
      candidateSubmissions,
      selectedWinner?.winner
    );

    if (matchedSubmission) {
      setWinnerSubmissionId(getSubmissionId(matchedSubmission));
    }
  }, [candidateSubmissions, selectedWinner, winnerSubmissionId]);

  const handleUpdateWinner = async () => {
    const contestId = getContestId(selectedWinner);

    if (!contestId || !winnerSubmissionId) {
      showAlert({
        message: "Choose a submission before updating the winner.",
        variant: "warning",
      });
      return;
    }

    try {
      setSaving(true);

      const selectedSubmission = candidateSubmissions.find(
        (submission) => getSubmissionId(submission) === winnerSubmissionId
      );
      const res = await API.put(
        `/submission/contest/${contestId}/winner`,
        {
          contestId,
          submissionId: winnerSubmissionId,
        }
      );
      const apiWinner = getWinnerSubmission(res.data?.winner);

      const updatedWinner = {
        ...(selectedSubmission || {}),
        ...(apiWinner || {}),
        user:
          getWinnerUser(res.data?.winner) ||
          selectedSubmission?.student ||
          getWinnerUser(selectedWinner?.winner),
      };
      const nextWinnerRecord = {
        ...selectedWinner,
        winner: updatedWinner,
      };

      setSelectedWinner(nextWinnerRecord);
      setWinners((prev) =>
        prev.map((winnerRecord) =>
          String(getContestId(winnerRecord)) === String(contestId)
            ? nextWinnerRecord
            : winnerRecord
        )
      );
      setIsEditing(false);

      showAlert({
        message: res.data?.message || "Winner updated successfully.",
        variant: "success",
      });
    } catch (err) {
      showAlert({
        message: err.response?.data?.message || "Unable to update winner.",
        variant: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteWinner = async () => {
    const contestId = getContestId(selectedWinner);

    if (!contestId) {
      return;
    }

    if (!window.confirm("Delete this winner record?")) {
      return;
    }

    try {
      setDeleting(true);

      const res = await API.delete(`/submission/contest/${contestId}/winner`);

      setWinners((prev) =>
        prev.filter(
          (winnerRecord) =>
            String(getContestId(winnerRecord)) !== String(contestId)
        )
      );
      setSelectedWinner(null);
      setIsEditing(false);
      setWinnerSubmissionId("");

      showAlert({
        message: res.data?.message || "Winner deleted successfully.",
        variant: "success",
      });
    } catch (err) {
      showAlert({
        message: err.response?.data?.message || "Unable to delete winner.",
        variant: "error",
      });
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-gray-500">
        Loading winners...
      </div>
    );
  }

  return (
    <>
      <div className="p-6">
        <h1 className="mb-6 flex items-center gap-2 text-2xl font-bold text-gray-900">
          <FiAward className="text-[#82C600]" />
          Winner Management
        </h1>

        {!selectedWinner ? (
          winners.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center text-gray-400">
              No winners found
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {winners.map((winnerRecord) => {
                const winnerUser = getWinnerUser(winnerRecord.winner);
                const winnerSubmission = getWinnerSubmission(winnerRecord.winner);

                return (
                  <button
                    key={getContestId(winnerRecord)}
                    type="button"
                    onClick={() => openWinnerDetail(winnerRecord)}
                    className="rounded-2xl border bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                          {winnerRecord.contestTitle}
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                          Status: {winnerRecord.status || "completed"}
                        </p>
                      </div>

                      <span className="rounded-full bg-lime-100 px-3 py-1 text-xs font-semibold text-lime-700">
                        Winner
                      </span>
                    </div>

                    <div className="mt-4 flex items-center gap-3">
                      <UserAvatar user={winnerUser} size="sm" />
                      <div>
                        <p className="font-medium text-gray-800">
                          {winnerUser?.name || "Student"}
                        </p>
                        <p className="text-xs text-gray-500">
                          Score: {winnerSubmission?.totalScore ?? 0}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )
        ) : (
          <div className="space-y-6">
            <button
              type="button"
              onClick={() => {
                setSelectedWinner(null);
                setIsEditing(false);
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-300"
            >
              <FiArrowLeft />
              Back
            </button>

            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-3xl border bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-lime-700">
                      Contest Winner
                    </p>
                    <h2 className="mt-1 text-2xl font-bold text-gray-900">
                      {selectedWinner.contestTitle}
                    </h2>
                  </div>

                  <div className="flex gap-2">
                    {!isEditing && (
                      <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="inline-flex items-center gap-2 rounded-xl bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-200"
                      >
                        <FiEdit2 />
                        Update
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={handleDeleteWinner}
                      disabled={deleting || saving}
                      className="inline-flex items-center gap-2 rounded-xl bg-rose-100 px-4 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-200 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      <FiTrash2 />
                      {deleting ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>

                <div className="mt-6 flex items-start gap-4 rounded-2xl bg-gray-50 p-4">
                  <UserAvatar user={currentWinnerUser} size="lg" />

                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {currentWinnerUser?.name || "Student"}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {currentWinnerUser?.email || "No email"}
                    </p>
                    <p className="mt-2 text-xs text-gray-500">
                      Registered: {formatRegistrationDate(currentWinnerUser)}
                    </p>
                    <p className="mt-2 text-sm font-medium text-gray-900">
                      {currentWinnerSubmission?.projectTitle || "Untitled project"}
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                    <p className="text-xs font-medium uppercase tracking-[0.22em] text-gray-400">
                      Score
                    </p>
                    <p className="mt-2 text-2xl font-bold text-gray-900">
                      {currentWinnerSubmission?.totalScore ?? 0}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                    <p className="text-xs font-medium uppercase tracking-[0.22em] text-gray-400">
                      Submitted
                    </p>
                    <p className="mt-2 text-sm font-medium text-gray-900">
                      {currentWinnerSubmission?.createdAt ||
                      currentWinnerSubmission?.submittedAt
                        ? new Date(
                            currentWinnerSubmission?.createdAt ||
                              currentWinnerSubmission?.submittedAt
                          ).toLocaleString()
                        : "N/A"}
                    </p>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-gray-100 bg-gray-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-[0.22em] text-gray-400">
                    Remarks
                  </p>
                  <p className="mt-2 text-sm leading-6 text-gray-700">
                    {currentWinnerSubmission?.remarks || "No remarks added"}
                  </p>
                </div>

                <div className="mt-6 rounded-2xl border border-gray-100 bg-gray-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-[0.22em] text-gray-400">
                    Description
                  </p>
                  <p className="mt-2 text-sm leading-6 text-gray-700">
                    {currentWinnerSubmission?.description ||
                      "No project description added."}
                  </p>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <a
                    href={currentWinnerSubmission?.githubLink || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gray-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-black"
                  >
                    <FiExternalLink />
                    Open GitHub
                  </a>

                  <a
                    href={currentWinnerSubmission?.liveUrl || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#82C600] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#6ea800]"
                  >
                    <FiExternalLink />
                    Open Live Demo
                  </a>
                </div>
              </div>

              <div className="rounded-3xl border bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Winner Controls
                    </p>
                    <h3 className="mt-1 text-lg font-semibold text-gray-900">
                      Evaluated submissions
                    </h3>
                  </div>

                  {selectedContest && (
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                      {candidateSubmissions.length} candidates
                    </span>
                  )}
                </div>

                {!selectedContest ? (
                  <p className="mt-4 text-sm text-gray-500">
                    Contest submissions could not be loaded, so winner updates are
                    unavailable right now.
                  </p>
                ) : candidateSubmissions.length === 0 ? (
                  <p className="mt-4 text-sm text-gray-500">
                    No evaluated submissions available for winner reassignment.
                  </p>
                ) : isEditing ? (
                  <div className="mt-4 space-y-4">
                    <select
                      value={winnerSubmissionId}
                      onChange={(event) => setWinnerSubmissionId(event.target.value)}
                      className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#82C600]"
                    >
                      <option value="">Select a submission</option>
                      {candidateSubmissions.map((submission) => (
                        <option
                          key={getSubmissionId(submission)}
                          value={getSubmissionId(submission)}
                        >
                          {(submission.student?.name || "Student") +
                            " - Score " +
                            (submission.totalScore ?? 0)}
                        </option>
                      ))}
                    </select>

                    {selectedCandidateSubmission && (
                      <div className="rounded-2xl border border-lime-100 bg-lime-50/70 p-4">
                        <div className="flex items-center gap-3">
                          <UserAvatar user={selectedCandidateSubmission.student} size="sm" />
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-medium text-gray-900">
                              {selectedCandidateSubmission.student?.name || "Student"}
                            </p>
                            <p className="truncate text-xs text-gray-500">
                              {selectedCandidateSubmission.student?.email || "No email"}
                            </p>
                          </div>
                          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-lime-700">
                            Score {selectedCandidateSubmission.totalScore ?? 0}
                          </span>
                        </div>

                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                          <div className="rounded-2xl bg-white px-4 py-3">
                            <p className="text-[11px] uppercase tracking-[0.18em] text-gray-400">
                              Project
                            </p>
                            <p className="mt-2 text-sm font-medium text-gray-900">
                              {selectedCandidateSubmission.projectTitle ||
                                "Untitled project"}
                            </p>
                          </div>

                          <div className="rounded-2xl bg-white px-4 py-3">
                            <p className="text-[11px] uppercase tracking-[0.18em] text-gray-400">
                              Submitted
                            </p>
                            <p className="mt-2 text-sm font-medium text-gray-900">
                              {selectedCandidateSubmission.createdAt ||
                              selectedCandidateSubmission.submittedAt
                                ? new Date(
                                    selectedCandidateSubmission.createdAt ||
                                      selectedCandidateSubmission.submittedAt
                                  ).toLocaleString()
                                : "N/A"}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <a
                            href={selectedCandidateSubmission.githubLink || "#"}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gray-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-black"
                          >
                            <FiExternalLink />
                            Candidate GitHub
                          </a>

                          <a
                            href={selectedCandidateSubmission.liveUrl || "#"}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#82C600] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#6ea800]"
                          >
                            <FiExternalLink />
                            Candidate Live Demo
                          </a>
                        </div>

                        <div className="mt-3 rounded-2xl bg-white px-4 py-3">
                          <p className="text-[11px] uppercase tracking-[0.18em] text-gray-400">
                            Description
                          </p>
                          <p className="mt-2 text-sm leading-6 text-gray-700">
                            {selectedCandidateSubmission.description ||
                              "No project description added."}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={handleUpdateWinner}
                        disabled={saving}
                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#82C600] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#6ea800] disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        <FiSave />
                        {saving ? "Saving..." : "Save Winner"}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setWinnerSubmissionId(getSubmissionId(currentWinnerSubmission));
                        }}
                        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-600 transition hover:border-gray-300 hover:text-gray-900"
                      >
                        <FiX />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 space-y-3">
                    {candidateSubmissions.map((submission, index) => (
                      <div
                        key={getSubmissionId(submission)}
                        className={`rounded-2xl border p-4 ${
                          getSubmissionId(submission) ===
                          getSubmissionId(currentWinnerSubmission)
                            ? "border-lime-200 bg-lime-50"
                            : "border-gray-100 bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <UserAvatar user={submission.student} size="sm" />
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-medium text-gray-900">
                              {submission.student?.name || "Student"}
                            </p>
                            <p className="truncate text-xs text-gray-500">
                              {submission.student?.email || "No email"}
                            </p>
                          </div>
                          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-700">
                            #{index + 1}
                          </span>
                        </div>

                        <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
                          <span>Score: {submission.totalScore ?? 0}</span>
                          <span>{submission.status}</span>
                        </div>

                        <p className="mt-2 text-xs text-gray-500">
                          {submission.projectTitle || "Untitled project"}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <AlertModal {...alertState} onClose={closeAlert} />
    </>
  );
};

export default WinnerManagementPage;
