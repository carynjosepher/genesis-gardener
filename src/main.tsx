import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

console.log("main.tsx loaded");
console.log("Supabase URL:", import.meta.env.VITE_SUPABASE_URL);

const rootElement = document.getElementById("root");
console.log("Root element:", rootElement);

if (!rootElement) {
  console.error("Root element not found!");
} else {
  try {
    console.log("Creating root...");
    createRoot(rootElement).render(<App />);
    console.log("App rendered");
  } catch (error) {
    console.error("Error rendering app:", error);
  }
}
