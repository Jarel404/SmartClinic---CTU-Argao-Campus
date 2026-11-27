import { useState } from "react";
import logo from "../assets/CTU logo.png";
const LOGO = logo;

// [name, label, input type, autocomplete hint, placeholder]
const FIELDS = [
  ["idNumber", "ID Number", "text", "off", "Enter your ID number"],
  ["fullName", "Full Name", "text", "name", "Enter your full name"],
  ["email", "Email Address", "email", "email", "Enter your email address"],
  ["phone", "Phone", "tel", "tel", "Enter your phone number"],
  ["password", "Password", "password", "new-password", "At least 8 characters"],
  ["confirmPassword", "Confirm Password", "password", "new-password", "Re-enter your password"],
];

const EMPTY_FORM = Object.fromEntries(FIELDS.map(([name]) => [name, ""]));

// Returns a message for the first problem found, or "" if the form is valid.
function validate(form) {
  if (Object.values(form).some((value) => !value.trim())) return "Please fill in all fields.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return "Enter a valid email address.";
  if (!/^\+?[\d\s-]+$/.test(form.phone.trim()) || form.phone.replace(/\D/g, "").length < 7)
    return "Enter a valid phone number.";
  if (form.password.length < 8) return "Password must be at least 8 characters.";
  if (form.password !== form.confirmPassword) return "Passwords do not match.";
  return "";
}

export default function CreateAccountPage({ onSubmit, onBackToLogin }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMessage("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const error = validate(form);
    if (error) {
      setMessage(error);
      return;
    }
    if (!onSubmit) {
      setMessage("Account creation is not connected yet.");
      return;
    }
    const { confirmPassword, ...account } = form;
    onSubmit({
      ...account,
      idNumber: account.idNumber.trim(),
      fullName: account.fullName.trim(),
      email: account.email.trim(),
      phone: account.phone.trim(),
    });
  };

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

        <h1>Create Account</h1>
        <p className="login-sub">Register for your digital clinic account</p>

        <form onSubmit={handleSubmit} noValidate>
          {FIELDS.map(([name, label, type, autoComplete, placeholder]) => (
            <div className="login-field" key={name}>
              <label htmlFor={name}>{label}</label>
              <input id={name} name={name} type={type} autoComplete={autoComplete}
                placeholder={placeholder} value={form[name]} onChange={handleChange} />
            </div>
          ))}

          <p className="login-message" role="alert">{message}</p>

          <button type="submit" className="login-btn primary">Create Account</button>
        </form>

        <p className="login-footer">
          Already have an account?
          <button type="button" className="login-link"
            onClick={() => onBackToLogin ? onBackToLogin() : setMessage("Log in is not connected yet.")}>
            Log in
          </button>
        </p>
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
.login-btn.primary:hover { background: #085fc2; }
.login-footer { display: flex; flex-direction: column; align-items: center; gap: 4px; margin: 24px 0 0; font-size: 13px; color: #5f6670; }
.login-about { margin: 16px 0 0; font-size: 12px; color: #5f6670; }
`;