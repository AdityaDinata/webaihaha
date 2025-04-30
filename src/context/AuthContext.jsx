// src/context/AuthContext.jsx

// Mengimpor React, createContext, useState, dan useEffect dari React
import React, { createContext, useState, useEffect } from "react";

// Membuat context untuk mengelola state autentikasi pengguna
const AuthContext = createContext();

// Komponen AuthProvider yang akan membungkus bagian aplikasi yang membutuhkan state autentikasi
export const AuthProvider = ({ children }) => {
  // State untuk menyimpan data pengguna (user), dimulai dengan null (belum login)
  const [user, setUser] = useState(null);

  // Menggunakan useEffect untuk memuat data pengguna dari localStorage saat komponen pertama kali di-mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user"); // Mengambil data user dari localStorage
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Jika ada, set data user ke state user
    }
  }, []); // Empty dependency array, artinya hanya dijalankan sekali saat komponen mount

  // Fungsi untuk login dan menyimpan data pengguna ke state dan localStorage
  const login = (userData) => {
    setUser(userData); // Set state user dengan data pengguna yang diberikan
    localStorage.setItem("user", JSON.stringify(userData)); // Simpan data pengguna ke localStorage
  };

  // Fungsi untuk logout dan menghapus data pengguna dari state dan localStorage
  const logout = () => {
    setUser(null); // Set state user menjadi null
    localStorage.removeItem("user"); // Hapus data pengguna dari localStorage
  };

  // Menyediakan state user, status login (isLoggedIn), dan fungsi login/logout ke komponen anak melalui context
  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Mengekspor AuthContext agar bisa digunakan di komponen lain
export default AuthContext;
