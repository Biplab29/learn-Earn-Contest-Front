
import API from "../../../services/axios";
import { useEffect, useState } from "react";
import AdminDashboardView from "@/features/admin/components/AdminDashboardView";
import DashboardModal from "@/features/admin/components/DashboardModal";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; 

const AdminDashboardPage = () => {
  const [dashboardData, setDashboardData] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [modalType, setModalType] = useState("");
  const [chartData, setChartData] = useState([]);
  const [loadingModal, setLoadingModal] = useState(false);
  const [selectedContest, setSelectedContest] = useState(null);

  const reduxToken = useSelector((state) => state.auth.token);
  const navigate = useNavigate(); 

  const extractData = (res) => {
    return (
      res?.data?.data ||
      res?.data?.users ||
      res?.data?.contests ||
      res?.data?.submissions ||
      res?.data ||
      []
    );
  };

  // ================= DASHBOARD FETCH =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/dashboard");

        console.log("Dashboard API Response:", res.data);

        // ✅ FIXED
        const api = res?.data || {};

        const activeContests = api.activeContests || {};
        const completedContests = api.completedContests || {};
        const submissions = api.submissions || {};
        const evaluations = api.evaluations || {};
        const teams = api.teams || {};

        const formattedData = {
          activeContestList: {
            count: activeContests.count || 0,
            list: activeContests.list || [],
          },

          completedContestList: {
            count: completedContests.count || 0,
            list: completedContests.list || [],
          },

          users: {
            count: api.totalUsers || 0,
            list: [],
          },

          submissions: {
            count: submissions.total || 0,
            list: [],
          },

          pendingList: {
            count: evaluations.pending ?? 0,
            submissionPendingCount:
              submissions.pendingEvaluation ||
              submissions.pending ||
              0,
            teamPendingCount: teams.pendingApproval || 0,
            recentPendingTeams: teams.recentPending || [],
          },
        };

        setDashboardData(formattedData);

        const chartFormatted = [
          {
            name: "Active",
            value: activeContests.count || 0,
          },
          {
            name: "Completed",
            value: completedContests.count || 0,
          },
          {
            name: "Users",
            value: api.totalUsers || 0,
          },
          {
            name: "Submissions",
            value: submissions.total || 0,
          },
          {
            name: "Pending",
            value: evaluations.pending || 0,
          },
        ];

        setChartData(chartFormatted);
      } catch (err) {
        console.error("DASHBOARD FETCH ERROR:", err);
      }
    };

    fetchData();
  }, []);

  // ================= HANDLE CARD CLICK =================
  const handleCardClick = async (type) => {

    // ✅ ONLY CHANGE: USERS → NAVIGATE PAGE
    if (type === "TOTAL USERS") {
      navigate("/admin/users");
      return;
    }

    setModalType(type);
    setModalOpen(true);
    setSelectedContest(null);

    const token = reduxToken || localStorage.getItem("token");

    if (!token) {
      setModalData(null);
      return;
    }

    setLoadingModal(true);

    try {
      let res;
      let finalData = null;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      switch (type) {

        // ❌ USERS CASE REMOVED (NOW NAVIGATES)

        case "ACTIVE CONTESTS": {
          finalData = {
            totalActiveContests: dashboardData.activeContestList?.count || 0,
            contestList: dashboardData.activeContestList?.list || [],
          };
          break;
        }

        case "TOTAL SUBMISSIONS": {
          res = await API.get(
            "/submission/submitted-contests",
            config
          );
          finalData = extractData(res);
          break;
        }

        case "PENDING APPROVALS": {
          finalData = dashboardData.pendingList || null;
          break;
        }

        case "EVALUATION": {
          res = await API.get(
            "/submission/submitted-contests-count",
            config
          );

          const contestsEval = extractData(res);

          finalData = contestsEval.flatMap((contest) =>
            (contest.submissionDetails || []).map((sub) => ({
              ...sub,
              contest: {
                _id: contest._id,
                title: contest.title,
              },
            }))
          );

          break;
        }

        case "DASHBOARD STATS": {
          const usersRes = await API.get("/auth/users", config);
          const contestRes = await API.get("/contest/active", config);

          const usersData = extractData(usersRes);
          const contestData = extractData(contestRes);

          finalData = {
            totalUsers: usersData.length,
            totalActiveContests: contestData.filter(
              (c) => c.status?.toLowerCase() === "active"
            ).length,
          };
          break;
        }

        default: {
          finalData = null;
          break;
        }
      }

      setModalData(finalData);

    } catch (err) {
      console.error("MODAL FETCH ERROR:", err.response?.data || err.message);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
      }
      setModalData(null);
    } finally {
      setLoadingModal(false);
    }
  };

  const handleContestClick = (contest) => {
    setSelectedContest(contest);
  };

  return (
    <>
      <AdminDashboardView
        dashboardData={dashboardData}
        chartData={chartData}
        onCardClick={handleCardClick}
      />

      <DashboardModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedContest(null);
        }}
        data={modalData}
        title={modalType}
        loading={loadingModal}
        selectedContest={selectedContest}
        onContestClick={handleContestClick}
        setSelectedContest={setSelectedContest}
      />
    </>
  );
};

export default AdminDashboardPage;
