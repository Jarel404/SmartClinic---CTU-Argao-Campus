import { useState } from "react";
import LoginPage from "./components/LoginPage";
import ClinicHomePage from "./components/ClinicHomePage";

export default function App() {
  const [user, setUser] = useState(null);

  return user ? <ClinicHomePage /> : <LoginPage onLogin={setUser} />;
}