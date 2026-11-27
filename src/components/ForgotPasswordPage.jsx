import { useEffect, useRef, useState } from "react";

/* TO ADD YOUR LOGO:
   1. Put your image in src/assets (example: logo.png).
   2. Remove the // from the import line below.
   3. Change "const LOGO = null;" to "const LOGO = logo;" */
// import logo from "../assets/logo.png";
const LOGO = null;

// Talks to your own server, never directly to Authentica.
async function api(path, body) {
  const response = await fetch(`/api/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).catch(() => null);
  const data = await response?.json().catch(() => null);
  if (!response?.ok || !data) throw new Error(data?.message || "Could not reach the server.");
  return data;
}

const TITLES = {
  otp: ["Enter Code", "Check your registered email for the code"],
  password: ["New Password", "Choose a password with at least 8 characters"],
  done: ["Password Updated", "You can now log in with your new password"],
};

export default function ForgotPasswordPage({ idNumber, onBackToLogin }) {
  const [step, setStep] = useState("otp");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  // Shows a loading state and any error while a request runs.
  const run = async (task) => {
    setBusy(true);
    setMessage("");
    try {
      await task();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  };

  const sendCode = () =>
    run(async () => {
      const data = await api("forgot-password", { idNumber });
      setOtp("");
      setMessage(data.message);
    });

  // Send the first code when the page opens (only once).
  const started = useRef(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    sendCode();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === "otp") {
      return run(async () => {
        const data = await api("verify-otp", { idNumber, otp });
        setResetToken(data.resetToken);
        setStep("password");
      });
    }
    if (password !== confirm) return setMessage("Passwords do not match.");
    return run(async () => {
      await api("reset-password", { idNumber, resetToken, password });
      setStep("done");
    });
  };

  const field = (id, label, value, setValue, props) => (
    <>
      <label htmlFor={id}>{label}</label>
      <input id={id} value={value} onChange={(e) => setValue(e.target.value)} required {...props} />
    </>
  );

  return (
    <main className="login">
      <style>{css}</style>

      <div className="login-card">
        {LOGO ? (
          <img className="login-logo" src={LOGO} alt="SmartClinic logo" />
        ) : (
          <div className="login-avatar" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="38" height="38" fill="currentColor">
              <circle cx="12" cy="7" r="4.5" />
              <path d="M3 20c0-4 4-6.5 9-6.5s9 2.5 9 6.5v1H3z" />
            </svg>
          </div>
        )}

        <p className="login-brand">SmartClinic</p>
        <p className="login-campus">CTU Argao Campus Clinic</p>

        <h1>{TITLES[step][0]}</h1>
        <p className="login-sub">{TITLES[step][1]}</p>

        {step !== "done" && (
          <form onSubmit={handleSubmit} noValidate>
            {step === "otp" && field("otp", "Verification Code", otp, setOtp,
              { inputMode: "numeric", autoComplete: "one-time-code", maxLength: 8, placeholder: "Enter the code" })}

            {step === "password" && (
              <>
                {field("password", "New Password", password, setPassword,
                  { type: "password", autoComplete: "new-password", placeholder: "Enter new password" })}
                {field("confirm", "Confirm Password", confirm, setConfirm,
                  { type: "password", autoComplete: "new-password", placeholder: "Re-enter new password" })}
              </>
            )}

            <p className="login-message" role="alert">{message}</p>

            <button type="submit" className="login-btn primary" disabled={busy}>
              {busy ? "Please wait..." : { otp: "Verify code", password: "Save password" }[step]}
            </button>
          </form>
        )}

        <div className="login-footer">
          {step === "otp" && (
            <button type="button" className="login-link" disabled={busy} onClick={sendCode}>
              Resend code
            </button>
          )}
          <button type="button" className="login-link"
            onClick={() => onBackToLogin ? onBackToLogin() : setMessage("Log in is not connected yet.")}>
            Back to log in
          </button>
        </div>
      </div>

      <p className="login-about">SmartClinic: a digital clinic management system</p>
    </main>
  );
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
body { margin: 0; }
.login {
  box-sizing: border-box; width: 100%; min-height: 100vh;
  display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px 16px;
  background: #f3f6f6; color: #1b1d21; text-align: center;
  font-family: 'Poppins', system-ui, sans-serif;
}
.login *, .login *::before, .login *::after { box-sizing: border-box; }
.login-card {
  width: 100%; max-width: 420px; background: #fff; border-radius: 18px;
  padding: 32px clamp(24px, 7vw, 52px) 24px;
  box-shadow: 0 8px 30px rgba(20, 40, 60, .07);
}
.login-avatar {
  width: 80px; height: 80px; margin: 0 auto 12px; border-radius: 50%;
  border: 2px solid #0b72e7; color: #0b72e7; display: grid; place-items: center;
}
.login-logo { display: block; width: 96px; height: 96px; margin: 0 auto 12px; object-fit: contain; }
.login-brand { margin: 0; font-size: 26px; font-weight: 800; color: #0867c9; }
.login-campus { margin: 0 0 20px; padding-bottom: 20px; font-size: 13px; color: #5f6670; border-bottom: 1px solid #e6e9ed; }
.login h1 { margin: 0 0 8px; font-size: 22px; line-height: 1.2; color: #1b1d21; }
.login-sub { margin: 0 0 28px; font-size: 14px; color: #5f6670; }
.login form { display: flex; flex-direction: column; text-align: left; }
.login label { display: block; margin-bottom: 8px; font-size: 12px; font-weight: 700; text-transform: uppercase; }
.login input {
  width: 100%; margin-bottom: 16px; padding: 13px 14px; font: inherit; font-size: 15px;
  color: #1b1d21; background: #fff; border: 1.5px solid #d8dce1; border-radius: 4px;
}
.login input:focus { outline: none; border-color: #0b72e7; box-shadow: 0 0 0 3px #0b72e733; }
.login button { font-family: inherit; cursor: pointer; }
.login button:focus-visible { outline: 3px solid #0b72e7; outline-offset: 2px; }
.login-link { padding: 0; border: 0; background: none; color: #0867c9; font-size: 13px; font-weight: 700; }
.login-link:hover { text-decoration: underline; }
.login-message { min-height: 20px; margin: 8px 0; font-size: 13px; line-height: 20px; text-align: center; color: #b3261e; }
.login-btn { padding: 14px; border-radius: 8px; border: 1.5px solid #0b72e7; font-size: 14px; font-weight: 700; }
.login-btn.primary { background: #0b72e7; color: #fff; text-transform: uppercase; box-shadow: 0 6px 16px #0b72e740; }
.login button:disabled { opacity: .6; cursor: wait; }
.login-btn.primary:hover { background: #085fc2; }
.login-footer { display: flex; flex-direction: column; align-items: center; gap: 4px; margin: 24px 0 0; font-size: 13px; color: #5f6670; }
.login-about { margin: 16px 0 0; font-size: 12px; color: #5f6670; }
`;