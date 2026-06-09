import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { ArrowLeft, Users, User } from "lucide-react";
import API from "../../../services/axios";
import AlertModal from "@/components/ui/AlertModal";
import useAlertModal from "@/hooks/useAlertModal";
import { fetchContests } from "@/features/contest/contestSlice";

const ContestParticipatePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { contests = [] } = useSelector((state) => state.contest);
  const contest = contests.find((item) => item._id === id || item.id === id);

  const [mode, setMode] = useState("single");

  const [teamName, setTeamName] = useState("");
  const [soloTeamName, setSoloTeamName] = useState("");
  const [teamId, setTeamId] = useState(null);

  // ✅ USERS STATE
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [sendingInvite, setSendingInvite] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const [creatingTeam, setCreatingTeam] = useState(false);
  const [joiningSolo, setJoiningSolo] = useState(false);

  const { alertState, showAlert, closeAlert } = useAlertModal();

  const contestId = contest?._id || contest?.id || id;
  const participationType = contest?.participationType || "solo";

  const allowSolo = ["solo", "both"].includes(participationType);
  const allowTeam = ["team", "both"].includes(participationType);

  // ================= FETCH CONTEST =================
  useEffect(() => {
    if (!contest) dispatch(fetchContests());
  }, [contest, dispatch]);

  // ================= FETCH USERS (ONCE) =================
  useEffect(() => {
    const getUsers = async () => {
      try {
        setLoadingUsers(true);

        const res = await API.get("/auth/users");

        // ✅ ONLY STUDENTS
        const students = (res.data?.users || []).filter(
          (u) => u.role === "student"
        );

        setUsers(students);

      } catch (err) {
        console.error(err);
      } finally {
        setLoadingUsers(false);
      }
    };

    getUsers();
  }, []);

  // ================= AUTO MODE =================
  useEffect(() => {
    if (allowTeam && !allowSolo) setMode("team");
    else if (allowSolo && !allowTeam) setMode("single");
  }, [allowSolo, allowTeam]);

  // ================= SOLO JOIN =================
  const joinSolo = async () => {
    if (!soloTeamName.trim()) {
      showAlert({ message: "Team name required", variant: "warning" });
      return;
    }

    try {
      setJoiningSolo(true);

      const res = await API.post("/team/create", {
        teamName: soloTeamName.trim(),
        contest: contestId,
        teamType: "solo",
      });

      showAlert({
        message: res.data?.message || "Joined successfully",
        variant: "success",
        onClose: () => navigate("/student/my-contests"),
      });

    } catch (err) {
      showAlert({
        message: err.response?.data?.message || "Solo join failed",
        variant: "error",
      });
    } finally {
      setJoiningSolo(false);
    }
  };

  // ================= TEAM CREATE =================
  const createTeam = async () => {
    if (!teamName.trim()) {
      showAlert({ message: "Team name required", variant: "warning" });
      return;
    }

    try {
      setCreatingTeam(true);

      const res = await API.post("/team/create", {
        teamName: teamName.trim(),
        contest: contestId,
        teamType: "team",
      });

      setTeamId(res.data?.team?._id);

      showAlert({
        message: "Team created! Invite members now",
        variant: "success",
      });

    } catch (err) {
      showAlert({
        message: err.response?.data?.message || "Team creation failed",
        variant: "error",
      });
    } finally {
      setCreatingTeam(false);
    }
  };

  // ================= SEND INVITE =================
  const sendInvite = async () => {
    if (!selectedUser || !teamId) return;

    try {
      setSendingInvite(true);

      await API.post(`/team/${teamId}/invite`, {
        userId: selectedUser._id,
      });

      showAlert({
        message: "Invite sent successfully",
        variant: "success",
      });

      setSelectedUser(null);

    } catch (err) {
      showAlert({
        message: err.response?.data?.message || "Invite failed",
        variant: "error",
      });
    } finally {
      setSendingInvite(false);
    }
  };

  return (
    <>
      <div className="p-6">
        <button onClick={() => navigate(-1)} className="mb-4 flex gap-2">
          <ArrowLeft size={18} /> Back
        </button>

        <h2 className="text-xl font-bold">{contest?.title}</h2>

        {/* MODE SELECT */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          {allowSolo && (
            <div
              onClick={() => setMode("single")}
              className="border p-4 cursor-pointer"
            >
              <User /> Solo
            </div>
          )}
          {allowTeam && (
            <div
              onClick={() => setMode("team")}
              className="border p-4 cursor-pointer"
            >
              <Users /> Team
            </div>
          )}
        </div>

        {/* SOLO */}
        {mode === "single" && allowSolo && (
          <div className="mt-4">
            <input
              value={soloTeamName}
              onChange={(e) => setSoloTeamName(e.target.value)}
              placeholder="Team name"
              className="border p-2 w-full"
            />
            <button
              onClick={joinSolo}
              className="bg-green-600 text-white px-4 py-2 mt-2"
            >
              Join Solo
            </button>
          </div>
        )}

        {/* TEAM */}
        {mode === "team" && allowTeam && (
          <div className="mt-4 space-y-3">

            {!teamId && (
              <>
                <input
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Team name"
                  className="border p-2 w-full"
                />
                <button
                  onClick={createTeam}
                  className="bg-green-600 text-white px-4 py-2"
                >
                  Create Team
                </button>
              </>
            )}

            {/* INVITE SECTION */}
            {teamId && (
              <div>

                <input
                  value={selectedUser?.name || ""}
                  onFocus={() => setShowDropdown(true)}
                  readOnly
                  placeholder="Select student"
                  className="border p-2 w-full"
                />

                {showDropdown && (
                  <div className="border max-h-40 overflow-y-auto bg-white mt-1">
                    {loadingUsers ? (
                      <p className="p-2">Loading...</p>
                    ) : users.length === 0 ? (
                      <p className="p-2">No students</p>
                    ) : (
                      users.map((u) => (
                        <div
                          key={u._id}
                          onClick={() => {
                            setSelectedUser(u);
                            setShowDropdown(false);
                          }}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                        >
                          {u.name} ({u.email})
                        </div>
                      ))
                    )}
                  </div>
                )}

                <button
                  onClick={sendInvite}
                  className="bg-blue-600 text-white px-4 py-2 mt-2"
                >
                  Send Invite
                </button>

              </div>
            )}

          </div>
        )}
      </div>

      <AlertModal {...alertState} onClose={closeAlert} />
    </>
  );
};

export default ContestParticipatePage;