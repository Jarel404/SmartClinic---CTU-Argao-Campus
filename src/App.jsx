import { useState } from "react";
import LoginPage from "./components/LoginPage";
import CreateAccountPage from "./components/CreateAccountPage";
import ClinicHomePage from "./components/ClinicHomePage";

export default function App() {
  const [page, setPage] = useState("login");

  if (page === "register") {
    return (
      <CreateAccountPage
        onSubmit={() => setPage("login")}
        onBackToLogin={() => setPage("login")}
      />
    );
  }

  if (page === "home") return <ClinicHomePage />;

  return (
    <LoginPage
      onLogin={() => setPage("home")}
      onCreateAccount={() => setPage("register")}
    />
  );
}