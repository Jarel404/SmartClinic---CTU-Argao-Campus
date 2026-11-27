import { useState } from "react";
import LoginPage from "./components/LoginPage";
import CreateAccountPage from "./components/CreateAccountPage";
import ForgotPasswordPage from "./components/ForgotPasswordPage";
import ClinicHomePage from "./components/ClinicHomePage";

export default function App() {
  const [page, setPage] = useState("login");
  const [resetId, setResetId] = useState("");

  // Sends the new account to your server.
  const register = async (account) => {
    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(account),
    }).catch(() => null);
    const data = await response?.json().catch(() => null);
    if (!response?.ok) return alert(data?.message || "Could not reach the server.");
    alert("Account created. You can now log in.");
    setPage("login");
  };

  if (page === "register") {
    return (
      <CreateAccountPage
        onSubmit={register}
        onBackToLogin={() => setPage("login")}
      />
    );
  }

  if (page === "forgot") {
    return (
      <ForgotPasswordPage
        idNumber={resetId}
        onBackToLogin={() => setPage("login")}
      />
    );
  }

  if (page === "home") return <ClinicHomePage />;

  return (
    <LoginPage
      onLogin={() => setPage("home")}
      onCreateAccount={() => setPage("register")}
      onForgotPassword={(id) => {
        setResetId(id);
        setPage("forgot");
      }}
    />
  );
}