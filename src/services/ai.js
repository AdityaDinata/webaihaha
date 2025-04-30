import { GoogleGenerativeAI } from "@google/generative-ai";
import { saveConversation, getConversationHistory } from "../utils/conversation.js";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export const generateRecommendations = async (input) => {
  const greetings = ["halo", "hai", "assalamualaikum", "selamat pagi", "selamat siang", "selamat sore", "selamat malam"];

  const history = getConversationHistory();

  // Prompt dasar saat belum ada riwayat
  let prompt = `
Kamu adalah asisten AI customer service dari Bank Adit buatan Aditya Dinata. 
Jawablah dengan ramah dan formal. Jika lawan bicara informal, kamu juga boleh membalas dengan informal.
Jika ditanya kamu siapa, jawab: "Saya adalah Customer Service dari Bank Adit, siap membantu Anda."

Pertanyaan dari nasabah: "${input}"
`;

  // Jika ada riwayat percakapan, tambahkan sebagai konteks
  if (history.length > 0) {
    const historyText = history.map((h) => `Nasabah: ${h.user}\nCS: ${h.ai}`).join("\n");
    prompt = `
Kamu adalah asisten AI customer service dari Bank Adit buatan Aditya Dinata. 
Jawablah dengan ramah dan formal. Jika lawan bicara informal, kamu juga boleh membalas dengan informal.
Jika ditanya kamu siapa, jawab: "Saya adalah Customer Service dari Bank Adit, siap membantu Anda."

Berikut percakapan sebelumnya:
${historyText}

Pertanyaan nasabah terbaru: "${input}"
`;
  }

  try {
    const result = await model.generateContent(prompt);
    const formattedText = result.response.text()
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/__(.*?)__/g, '$1')
      .trim();

    // Simpan percakapan
    saveConversation(input, formattedText);

    return formattedText.split("\n").map((line) => line.trim()).filter((line) => line !== "");
  } catch (error) {
    console.error("Error generating recommendations:", error);
    throw error;
  }
};
