import { useCallback, useEffect, useState } from "react";
import AlertModal from "@/components/ui/AlertModal";
import useAlertModal from "@/hooks/useAlertModal";
import { FiUsers, FiMail, FiUser, FiCheck } from "react-icons/fi";
import {
  INVITATIONS_UPDATED_EVENT,
  acceptInvitation,
  fetchMyInvitations,
  getInvitationReference,
} from "@/features/student/invitationAPI";

const MyInvitations = () => {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acceptingToken, setAcceptingToken] = useState("");
  const { alertState, showAlert, closeAlert } = useAlertModal();

  const broadcastInvitations = useCallback((nextInvitations) => {
    window.dispatchEvent(
      new CustomEvent(INVITATIONS_UPDATED_EVENT, {
        detail: { invitations: nextInvitations },
      })
    );
  }, []);

  const fetchInvitations = useCallback(async () => {
    try {
      setLoading(true);
      const nextInvitations = await fetchMyInvitations();
      setInvitations(nextInvitations);
      broadcastInvitations(nextInvitations);
    } catch (err) {
      showAlert({
        message: err.response?.data?.message || "Failed to load invitations.",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [broadcastInvitations, showAlert]);

  const acceptInvite = async (invite) => {
    const invitationReference = getInvitationReference(invite);

    if (!invitationReference) {
      showAlert({
        message: "Invitation token missing",
        variant: "error",
      });
      return;
    }

    try {
      setAcceptingToken(invitationReference);

      const res = await acceptInvitation(invitationReference);

      showAlert({
        message: res.data?.message || "Invitation accepted",
        variant: "success",
      });

      const inviteId = invite?._id;
      const inviteToken = invite?.token;
      const inviteAcceptToken = invite?.acceptToken;

      setInvitations((prevInvitations) => {
        const nextInvitations = prevInvitations.filter(
          (item) =>
            item?._id !== inviteId &&
            item?.token !== inviteToken &&
            item?.acceptToken !== inviteAcceptToken
        );
        broadcastInvitations(nextInvitations);
        return nextInvitations;
      });
    } catch (err) {
      showAlert({
        message: err.response?.data?.message || "Failed to accept invitation",
        variant: "error",
      });
    } finally {
      setAcceptingToken("");
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, [fetchInvitations]);

  if (loading) {
    return (
      <>
        <div className="theme-text-soft p-4 sm:p-6">Loading invitations...</div>
        <AlertModal {...alertState} onClose={closeAlert} />
      </>
    );
  }

  return (
    <>
      <div className="theme-page-shell min-h-screen px-4 py-6 sm:px-6 sm:py-8">
        <div className="mx-auto max-w-5xl">

          {/* HEADER */}
          <div className="mb-8">
            <h1 className="theme-text text-2xl font-bold flex items-center gap-2">
              <FiMail className="text-[#82c600]" />
              My Invitations
            </h1>
            <p className="theme-text-muted text-sm mt-1">
              Accept team invitations to join contests together.
            </p>
          </div>

          {invitations.length === 0 ? (
            <div className="theme-surface rounded-2xl p-10 text-center">
              <FiMail className="mx-auto text-3xl theme-text-muted mb-3" />
              <p className="theme-text-soft text-base font-medium">No pending invitations</p>
              <p className="theme-text-muted text-sm mt-1">You're all caught up!</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {invitations.map((invite, index) => (
                <div
                  key={
                    invite?._id ||
                    invite?.token ||
                    invite?.acceptToken ||
                    `invite-${index}`
                  }
                  className="theme-surface rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:shadow-lg"
                >
                  {/* Card Header */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#82c600]/10 flex items-center justify-center flex-shrink-0">
                      <FiUsers className="text-[#82c600] text-xl" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h2 className="theme-text font-semibold text-base break-words">
                        {invite?.team?.teamName || "Unknown Team"}
                      </h2>

                      <div className="mt-2 space-y-1">
                        <p className="theme-text-soft text-sm flex items-center gap-1.5">
                          <span className="theme-text-muted text-xs">Contest:</span>
                          <span className="font-medium">{invite?.team?.contest?.title || "—"}</span>
                        </p>
                        <p className="theme-text-soft text-sm flex items-center gap-1.5">
                          <FiUser className="theme-text-muted" size={12} />
                          <span className="theme-text-muted text-xs">Invited by:</span>
                          <span>{invite?.invitedBy?.name || "Unknown"}</span>
                        </p>
                      </div>

                      {/* Status badge */}
                      <span className="mt-2 inline-block text-xs px-2.5 py-1 rounded-full capitalize
                        bg-amber-500/10 text-amber-600 dark:text-amber-300 border border-amber-400/20">
                        {invite?.status || "pending"}
                      </span>
                    </div>
                  </div>

                  {/* Accept Button */}
                  <div className="mt-5 flex justify-end">
                    <button
                      onClick={() => acceptInvite(invite)}
                      disabled={
                        acceptingToken === invite?.acceptToken ||
                        acceptingToken === invite?.token ||
                        acceptingToken === invite?._id
                      }
                      className="theme-brand-button inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold disabled:opacity-60"
                    >
                      <FiCheck size={14} />
                      {acceptingToken === invite?.acceptToken ||
                      acceptingToken === invite?.token ||
                      acceptingToken === invite?._id
                        ? "Accepting..."
                        : "Accept Invitation"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <AlertModal {...alertState} onClose={closeAlert} />
    </>
  );
};

export default MyInvitations;
