import { useCallback, useEffect, useState } from "react";
import AlertModal from "@/components/ui/AlertModal";
import useAlertModal from "@/hooks/useAlertModal";
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
          <h1 className="theme-text mb-6 text-2xl font-bold">My Invitations</h1>

          {invitations.length === 0 ? (
            <div className="theme-surface theme-text-soft rounded-xl p-5 sm:p-6">
              No pending invitations
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
                  className="theme-surface rounded-xl p-4 sm:p-5"
                >
                  <h2 className="theme-text break-words text-lg font-semibold">
                    Team: {invite?.team?.teamName}
                  </h2>
                  <p className="theme-text-soft mt-1 text-sm">
                    Contest: {invite?.team?.contest?.title}
                  </p>
                  <p className="theme-text-soft text-sm">
                    Invited By: {invite?.invitedBy?.name || "Unknown"}
                  </p>
                  <p className="theme-text-soft text-sm">
                    Status: {invite?.status}
                  </p>

                  <button
                    onClick={() => acceptInvite(invite)}
                    disabled={
                      acceptingToken === invite?.acceptToken ||
                      acceptingToken === invite?.token ||
                      acceptingToken === invite?._id
                    }
                    className="theme-brand-button mt-4 w-full rounded-lg px-4 py-2 disabled:opacity-60 sm:w-auto"
                  >
                    {acceptingToken === invite?.acceptToken ||
                    acceptingToken === invite?.token ||
                    acceptingToken === invite?._id
                      ? "Accepting..."
                      : "Accept Invitation"}
                  </button>
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
