import React, { useState } from "react";
import { Button, TextInput, Spinner } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import useHabits from "../../hooks/useHabits";
import { generateRecommendations } from "../../services/ai";
import { saveUserHabit } from "../../services/api";
import AppNavbar from "../layout/Navbar";

const LandingPengguna = () => {
  const navigate = useNavigate();
  const { addHabit } = useHabits();
  const [habit, setHabit] = useState("");
  const [messages, setMessages] = useState([]); // Change to store chat messages
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmitHabit = async (e) => {
    e.preventDefault();
    if (!habit.trim()) {
      setError("Kebiasaan tidak boleh kosong");
      return;
    }
    setError("");
    setLoading(true);
    try {
      // Add user's message to chat first
      const userMessage = { text: habit, sender: "user" };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
  
      // Generate recommendations from the AI
      const recs = await generateRecommendations(habit);
      
      // Check if recs is an array, and if not, treat it as a single string.
      const botMessage = { text: Array.isArray(recs) ? recs.join("\n") : recs, sender: "bot" };
      
      setMessages((prevMessages) => [...prevMessages, botMessage]); // Add bot's response to chat
    } catch (err) {
      console.error("Error generating recommendations:", err);
      setError("Gagal mendapatkan rekomendasi");
    } finally {
      setLoading(false);
    }
  };
  

  const handleSelectHabit = (e) => {
    const habitName = e.target.value;
    setSelectedHabits((prev) =>
      prev.includes(habitName)
        ? prev.filter((h) => h !== habitName)
        : [...prev, habitName]
    );
  };

  const saveSelectedHabitsToAPI = async () => {
    const userId = JSON.parse(localStorage.getItem("user")).id;
    if (!userId || selectedHabits.length === 0) {
      alert("Tidak ada kebiasaan yang dipilih atau pengguna tidak terautentikasi");
      return;
    }

    setLoading(true);
    try {
      const habitPromises = selectedHabits.map((habitName, index) => {
        const newHabit = {
          habit_name: habitName,
          id: (index + 1).toString(),
          userId: userId,
          status: "belum selesai",
        };
        return saveUserHabit(userId, newHabit);
      });

      await Promise.all(habitPromises);
      alert("Semua kebiasaan berhasil disimpan!");
      navigate("/selected-habits");
    } catch (err) {
      console.error("Error saving habits:", err);
      alert("Terjadi kesalahan saat menyimpan kebiasaan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-300 to-green-500">
      <AppNavbar />
      <div className="flex flex-col items-center justify-center text-center py-10 px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Chat dengan Kami untuk Mendapatkan Rekomendasi Kebiasaan Sehat
        </h2>

        {/* Chatbox */}
        <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md mb-4 h-80 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.sender === "user" ? "justify-start" : "justify-end"}`}>
                <div className={`p-3 rounded-md ${msg.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Input for Habit */}
        <form onSubmit={handleSubmitHabit} className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md">
          <TextInput
            id="habit"
            type="text"
            placeholder="Silahkan Tanyakan Apa Saja"
            required
            value={habit}
            onChange={(e) => setHabit(e.target.value)}
            className="mb-4"
          />
          <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2" disabled={loading}>
            {loading ? <Spinner size="sm" light={true} /> : "Kirim"}
          </Button>
        </form>

        {error && <p className="text-red-600 mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default LandingPengguna;
