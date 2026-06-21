
import { useEffect, useState } from "react";
import API from "../../../services/axios";
import { Search, Users } from "lucide-react";
import { toast } from "react-toastify";
import UserAvatar from "@/components/ui/UserAvatar";
import { UsersTableSkeleton } from "@/components/ui/SkeletonLoaders";
import {
  formatRegistrationDate,
  normalizeUserProfileData,
} from "@/utils/userProfile";

const emptyForm = {
  _id: "",
  name: "",
  email: "",
  phoneNumber: "",
  gender: "",
  role: "",
};

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingUser, setEditingUser] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteUser, setDeleteUser] = useState(null);

  const token = localStorage.getItem("token");

  // FETCH USERS
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await API.get("/auth/users", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data =
          res?.data?.data ||
          res?.data?.users ||
          res?.data ||
          [];

        setUsers(data.map((u) => normalizeUserProfileData(u)));
      } catch (err) {
        toast.error("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  // DELETE USER
  const handleDelete = async (userId) => {
    try {
      await API.delete(`/auth/delete/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers((prev) => prev.filter((u) => u._id !== userId));
      toast.success("User deleted successfully");
    } catch {
      toast.error("Delete failed");
    }
  };

  // OPEN EDIT
  const handleEditOpen = (user) => {
    setEditingUser({
      _id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      gender: user.gender,
      role: user.role,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingUser((prev) => ({ ...prev, [name]: value }));
  };

  // UPDATE USER
  const handleUpdate = async () => {
    if (!editingUser._id) return;

    try {
      setSaving(true);

      const payload = {
        name: editingUser.name.trim(),
        email: editingUser.email.trim(),
        phoneNumber: editingUser.phoneNumber,
        gender: editingUser.gender,
      };

      const res = await API.put(
        `/auth/user/update/${editingUser._id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedUser = normalizeUserProfileData(
        res?.data?.user || payload
      );

      setUsers((prev) =>
        prev.map((u) =>
          u._id === editingUser._id ? { ...u, ...updatedUser } : u
        )
      );

      // ✅ SUCCESS TOAST
      toast.success("User updated successfully 🚀");

      // ✅ CLOSE MODAL
      setEditingUser(emptyForm);

    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Update failed ❌"
      );
    } finally {
      setSaving(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="theme-page-shell min-h-screen p-4 md:p-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Users className="text-[#82C600]" />
          <h1 className="text-xl md:text-2xl font-bold">All Users</h1>
        </div>

        <div className="flex items-center gap-2 theme-input px-3 py-2 rounded-xl w-full md:w-72">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search users..."
            className="bg-transparent outline-none w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="theme-surface rounded-2xl overflow-hidden">

        {/* HEADER */}
        <div className="hidden md:grid grid-cols-5 px-4 py-3 text-sm font-semibold border-b theme-border">
          <div>User</div>
          <div>Email</div>
          <div>Role</div>
          <div>Date</div>
          <div className="text-right">Actions</div>
        </div>

        {loading ? (
          <UsersTableSkeleton rows={7} />
        ) : filteredUsers.length === 0 ? (
          <div className="p-6 text-center">No users found</div>
        ) : (
          filteredUsers.map((user) => (
            <div key={user._id} className="border-b theme-border p-4">

              {/* MOBILE */}
              <div className="flex flex-col gap-3 md:hidden">
                <div className="flex items-center gap-3">
                  <UserAvatar user={user} size="sm" />
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs theme-text-muted">{user.email}</p>
                  </div>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="theme-text-muted">Role</span>
                  <span>{user.role}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="theme-text-muted">Joined</span>
                  <span>{formatRegistrationDate(user)}</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditOpen(user)}
                    className="flex-1 theme-outline-button py-2 rounded-lg"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteUser(user)}
                    className="flex-1 theme-outline-button text-red-500 py-2 rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* DESKTOP */}
              <div className="hidden md:grid grid-cols-5 items-center">
                <div className="flex gap-2 items-center">
                  <UserAvatar user={user} size="sm" />
                  {user.name}
                </div>
                <div>{user.email}</div>
                <div>{user.role}</div>
                <div>{formatRegistrationDate(user)}</div>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handleEditOpen(user)}
                    className="px-3 py-1 theme-outline-button rounded-lg"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteUser(user)}
                    className="px-3 py-1 theme-outline-button text-red-500 rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>

            </div>
          ))
        )}
      </div>

      {/* EDIT MODAL */}
      {editingUser._id && (
        <div className="fixed inset-0 flex items-center justify-center theme-modal-overlay">
          <div className="theme-modal-panel p-6 rounded-3xl w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Edit User</h2>

            <div className="space-y-3">
              <input
                name="name"
                value={editingUser.name}
                onChange={handleEditChange}
                placeholder="Name"
                className="w-full p-3 rounded-xl theme-input"
              />
              <input
                name="email"
                value={editingUser.email}
                onChange={handleEditChange}
                placeholder="Email"
                className="w-full p-3 rounded-xl theme-input"
              />
              <input
                name="phoneNumber"
                value={editingUser.phoneNumber}
                onChange={handleEditChange}
                placeholder="Phone"
                className="w-full p-3 rounded-xl theme-input"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditingUser(emptyForm)}
                className="theme-outline-button px-4 py-2 rounded-xl"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                disabled={saving}
                className="theme-brand-button px-4 py-2 rounded-xl"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteUser && (
        <div className="fixed inset-0 flex items-center justify-center theme-modal-overlay">
          <div className="theme-modal-panel p-6 rounded-2xl w-full max-w-md">
            <h2 className="font-bold mb-4">Delete User</h2>
            <p className="mb-4">
              Delete <span className="font-semibold">{deleteUser.name}</span>?
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteUser(null)}
                className="theme-outline-button px-3 py-1 rounded"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await handleDelete(deleteUser._id);
                  setDeleteUser(null);
                }}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default UsersPage;