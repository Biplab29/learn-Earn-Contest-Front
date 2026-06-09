import { useState } from "react";
import { Calendar, Trophy } from "lucide-react";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const ContestSidebar = ({ form, setForm, prizes, setPrizes }) => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [inputValue, setInputValue] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ OPEN ADD
  const openAddModal = () => {
    setInputValue("");
    setEditIndex(null);
    setIsModalOpen(true);
  };

  // ✅ OPEN EDIT
  const openEditModal = (index) => {
    setInputValue(prizes[index]);
    setEditIndex(index);
    setIsModalOpen(true);
  };

  // ✅ SAVE
  const handleSave = () => {
    if (!inputValue.trim()) return;

    if (editIndex !== null) {
      const updated = [...prizes];
      updated[editIndex] = inputValue.trim();
      setPrizes(updated);
    } else {
      setPrizes([...prizes, inputValue.trim()]);
    }

    setIsModalOpen(false);
    setInputValue("");
    setEditIndex(null);
  };

  return (
    <>
      <div className="space-y-6">

        {/* 🔥 TIMELINE */}
        <div className="bg-white/90 backdrop-blur rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition">

          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 rounded-xl bg-[#82C600]/10 text-[#82C600]">
              <Calendar size={18} />
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 text-lg">
                Timeline
              </h3>
              <p className="text-xs text-gray-400">
                Set contest duration
              </p>
            </div>
          </div>

          <div className="space-y-4">

            <div className="bg-gray-50 p-3 rounded-xl border">
              <label className="text-xs text-gray-500 mb-1 block">
                Start Date
              </label>
              <Input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
              />
            </div>

            <div className="bg-gray-50 p-3 rounded-xl border">
              <label className="text-xs text-gray-500 mb-1 block">
                Deadline
              </label>
              <Input
                type="date"
                name="deadline"
                value={form.deadline}
                onChange={handleChange}
              />
            </div>

          </div>
        </div>

        {/* 🔥 PRIZES */}
        <div className="bg-white/90 backdrop-blur rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition">

          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 rounded-xl bg-yellow-100 text-yellow-600">
              <Trophy size={18} />
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 text-lg">
                Rewards & Prizes
              </h3>
              <p className="text-xs text-gray-400">
                Motivate participants 🎯
              </p>
            </div>
          </div>

          <div className="space-y-3">

            {prizes.map((p, i) => (
              <div
                key={i}
                className="group flex justify-between items-center px-4 py-3 rounded-xl border bg-gray-50 hover:bg-gray-100 transition"
              >

                {/* TEXT WITH ICON */}
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">

                  <span>
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}
                  </span>

                  <span>
                    {i === 0
                      ? "1st Place"
                      : i === 1
                        ? "2nd Place"
                        : "3rd Place"}{" "}
                    – {p}
                  </span>

                </div>
                {/* ACTIONS */}
                <div className="flex gap-2 text-xs opacity-0 group-hover:opacity-100 transition">

                  <button
                    onClick={() => openEditModal(i)}
                    className="px-2 py-1 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center gap-1"
                  >
                    <FiEdit2 size={12} /> Edit
                  </button>

                  <button
                    onClick={() =>
                      setPrizes(prizes.filter((_, idx) => idx !== i))
                    }
                    className="px-2 py-1 rounded bg-red-50 text-red-500 hover:bg-red-100 flex items-center gap-1"
                  >
                    <FiTrash2 size={12} /> Delete
                  </button>

                </div>

              </div>
            ))}

          </div>

          {/* ✅ ADD BUTTON (LIMIT 3 + DYNAMIC TEXT) */}
          {prizes.length < 3 && (
            <div className="mt-5">
              <Button
                variant="outline"
                className="w-full border-dashed border-2 hover:bg-[#82C600]/5 transition flex items-center justify-center gap-2"
                onClick={openAddModal}
              >
                <FiPlus />
                Add {prizes.length === 0 ? "1st" : prizes.length === 1 ? "2nd" : "3rd"} Prize
              </Button>
            </div>
          )}

        </div>

        {/* 🔥 TIP */}
        <div className="bg-gradient-to-r from-[#82C600]/10 via-green-50 to-[#82C600]/10 border border-[#82C600]/20 p-4 rounded-2xl text-sm text-[#82C600] shadow-sm">
          🎯 Contests with multiple prize categories attract more participants.
        </div>

      </div>

      {/* 🔥 MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">

          <div className="bg-white w-[90%] max-w-md rounded-2xl shadow-xl p-6 animate-fadeIn">

            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              {editIndex !== null ? "Edit Reward" : "Add Reward"}
            </h2>

            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter reward..."
              className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#82C600]"
            />

            <div className="flex justify-end gap-3 mt-5">

              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm rounded-lg border hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm rounded-lg bg-[#82C600] text-white hover:bg-[#6ea800]"
              >
                Save
              </button>

            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default ContestSidebar;