// src/context/HabitsContext.jsx

// Mengimpor React, createContext, dan useState dari React
import React, { createContext, useState } from "react";

// Membuat context untuk mengelola state habits
const HabitsContext = createContext();

// Komponen HabitsProvider yang akan membungkus bagian aplikasi yang membutuhkan state habits
export const HabitsProvider = ({ children }) => {
  // State untuk menyimpan daftar habits, dimulai dengan array kosong
  const [habits, setHabits] = useState([]);

  // Fungsi untuk menambahkan habit baru ke dalam array habits
  const addHabit = (habit) => setHabits((prev) => [...prev, habit]);

  // Fungsi untuk memperbarui habit yang sudah ada berdasarkan id-nya
  const updateHabit = (id, updatedData) =>
    setHabits((prev) =>
      prev.map((habit) => 
        habit.id === id ? { ...habit, ...updatedData } : habit // Jika id cocok, update habit, jika tidak biarkan tetap sama
      )
    );

  // Fungsi untuk mengganti semua habits dengan daftar habits baru
  const setAllHabits = (habitsData) => setHabits(habitsData);

  // Menyediakan state habits dan fungsi-fungsi untuk menambah, memperbarui, atau mengganti semua habits ke komponen lain
  return (
    <HabitsContext.Provider value={{ habits, addHabit, updateHabit, setAllHabits }}>
      {children}
    </HabitsContext.Provider>
  );
};

// Mengekspor HabitsContext agar bisa digunakan di komponen lain
export default HabitsContext;
