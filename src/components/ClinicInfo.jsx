import { useEffect, useState } from "react";

/* REPLACEABLE PHOTO: save your picture as src/assets/clinic.jpg (or .png / .jpeg). */
const photos = import.meta.glob("../assets/clinic.{jpg,jpeg,png}", { eager: true, import: "default" });
const PHOTO = Object.values(photos)[0];

// days: 1 = Monday ... 6 = Saturday. ranges are in 24-hour time.
const SESSIONS = [
  { label: "Weekdays", icon: "sun", days: [1, 2, 3, 4, 5], ranges: [["08:00", "17:00"]],
    times: ["8:00 AM to 5:00 PM"], note: "No noon break" },
  { label: "Weekday evenings", icon: "moon", days: [1, 2, 3, 4, 5], ranges: [["18:00", "21:00"]],
    times: ["6:00 PM to 9:00 PM"], note: "Monday to Friday" },
  { label: "Saturday", icon: "calendar", days: [6], ranges: [["08:00", "12:00"], ["13:00", "17:00"]],
    times: ["8:00 AM to 12:00 PM", "1:00 PM to 5:00 PM"] },
];

const HIGHLIGHTS = ["No clinic fees", "Priority lane available", "Emergency care"];

const ICONS = {
  sun: "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5",
  moon: "M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5Z",
  calendar: "M4 6h16v14H4zM4 10h16M8 3v5M16 3v5",
};

// Current day and time in the Philippines, whatever the visitor's device is set to.
function manilaNow() {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Manila", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
    }).formatToParts(new Date()).map((p) => [p.type, p.value])
  );
  return {
    day: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(parts.weekday),
    time: `${parts.hour}:${parts.minute}`,
  };
}

export default function ClinicInfo() {
  const [now, setNow] = useState(manilaNow);

  useEffect(() => {
    const timer = setInterval(() => setNow(manilaNow()), 30000);
    return () => clearInterval(timer);
  }, []);

  const isOpen = (s) =>
    s.days.includes(now.day) && s.ranges.some(([from, to]) => now.time >= from && now.time < to);
  const open = SESSIONS.some(isOpen);

  return (
    <div className="ci">
      <style>{css}</style>

      <div className={PHOTO ? "ci-banner has-photo" : "ci-banner"}>
        {PHOTO && <img className="ci-photo" src={PHOTO} alt="" />}
        <div className="ci-content">
          <p className={open ? "ci-status open" : "ci-status"}>
            {open ? "Open now" : "Closed now"}
          </p>
          <h1>Your campus clinic at CTU Argao</h1>
          <p>Care for students, school personnel and visitors.</p>
        </div>
        <svg className="ci-pulse" viewBox="0 0 400 40" preserveAspectRatio="none" aria-hidden="true">
          <path pathLength="1" d="M0 24H140l12-10 12 20 16-32 16 36 12-14h192" />
        </svg>
      </div>

      <ul className="ci-highlights">
        {HIGHLIGHTS.map((h) => <li key={h}>{h}</li>)}
      </ul>

      <div id="hours">
        <h2>Clinic schedule</h2>
        <div className="ci-schedule">
          {SESSIONS.map((s) => (
            <div key={s.label}
              className={`ci-card${s.days.includes(now.day) ? " today" : ""}${isOpen(s) ? " live" : ""}`}>
              <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor"
                strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d={ICONS[s.icon]} />
              </svg>
              <h3>{s.label}</h3>
              {s.times.map((t) => <p key={t}>{t}</p>)}
              {s.note && <small>{s.note}</small>}
              {s.days.includes(now.day) && <span className="ci-today">Today</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="ci-actions">
        <a className="ci-btn primary" href="#services">View services</a>
        <a className="ci-btn" href="#contact">Contact the clinic</a>
      </div>
    </div>
  );
}

const css = `
.lp .ci { display: flex; flex-direction: column; gap: 18px; min-width: 0; }
.lp .ci-banner { position: relative; overflow: hidden; border-radius: 20px; color: #fff; background: linear-gradient(135deg, #0c2d57, #0b72e7); }
.lp .ci-banner.has-photo { min-height: 270px; display: flex; flex-direction: column; justify-content: flex-end; }
.lp .ci-photo { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.lp .ci-banner.has-photo::after { content: ""; position: absolute; inset: 0; background: linear-gradient(to top, #0c2d57f2 25%, #0c2d5766); }
.lp .ci-content { position: relative; z-index: 1; padding: 24px 26px 40px; }
.lp .ci-banner h1 { color: #fff; font-size: clamp(1.6rem, 3.2vw, 2.15rem); margin: 12px 0 6px; }
.lp .ci-banner p { margin: 0; }
.lp .ci-banner .ci-status { display: inline-flex; align-items: center; gap: 8px; padding: 4px 14px; border-radius: 20px; background: #fff; color: #8a2a22; font-size: .8rem; font-weight: 600; }
.lp .ci-status::before { content: ""; width: 9px; height: 9px; border-radius: 50%; background: #d33a2c; }
.lp .ci-banner .ci-status.open { color: #13683a; }
.lp .ci-status.open::before { background: #1faa59; }
.lp .ci-pulse { position: absolute; z-index: 1; left: 0; bottom: 2px; width: 100%; height: 40px; fill: none; stroke: #ffc933; stroke-width: 2.5; vector-effect: non-scaling-stroke; }
.lp .ci-pulse path { stroke-dasharray: 1; animation: ci-draw 2.5s linear infinite; }
@keyframes ci-draw {
  0% { stroke-dashoffset: 1; }
  80%, 100% { stroke-dashoffset: 0; }
}
.lp .ci-highlights { display: flex; flex-wrap: wrap; gap: 8px; margin: 0; padding: 0; list-style: none; }
.lp .ci-highlights li { padding: 5px 14px; border-radius: 20px; background: #fff3cf; color: #5c4300; font-size: .8rem; font-weight: 600; }
.lp .ci h2 { margin-bottom: 18px; }
.lp .ci-schedule { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
.lp .ci-card { position: relative; padding: 18px 14px 14px; background: #fff; border: 2px solid #dde6f1; border-radius: 14px; color: #0867c9; }
.lp .ci-card h3 { font-size: .9rem; margin: 8px 0 4px; }
.lp .ci-card p { margin: 0; color: #1b1d21; font-size: .8rem; }
.lp .ci-card small { display: block; margin-top: 4px; color: #55606e; font-size: .72rem; }
.lp .ci-card.today { border-color: #0b72e7; background: #eef6ff; }
.lp .ci-card.live { border-color: #1faa59; background: #effaf3; }
.lp .ci-today { position: absolute; top: -10px; right: 10px; padding: 1px 10px; border-radius: 12px; background: #0b72e7; color: #fff; font-size: .7rem; font-weight: 600; }
.lp .ci-card.live .ci-today { background: #13683a; }
.lp .ci-actions { display: flex; flex-wrap: wrap; gap: 10px; }
.lp a.ci-btn { padding: 11px 22px; border: 1.5px solid #0b72e7; border-radius: 10px; font-weight: 600; text-decoration: none; background: #fff; }
.lp a.ci-btn.primary { background: #0b72e7; color: #fff; }
.lp a.ci-btn:hover { box-shadow: 0 4px 14px #0b72e74d; }
@media (max-width: 520px) { .lp .ci-schedule { grid-template-columns: 1fr; gap: 18px; } }
@media (prefers-reduced-motion: reduce) { .lp .ci-pulse path { animation: none; } }
/* Compact spacing */
.lp .hero { padding-block: 24px; }
.lp .carousel { max-width: 440px; justify-self: center; }
.lp .ci { gap: 10px; }
.lp .ci-banner.has-photo { min-height: 170px; }
.lp .ci-content { padding: 14px 20px 34px; }
.lp .ci-banner h1 { font-size: 1.5rem; margin: 8px 0 2px; }
.lp .ci h2 { font-size: 1.1rem; margin-bottom: 14px; }
.lp .ci-card { padding: 12px 10px 10px; }
.lp .ci-card svg { width: 20px; height: 20px; }
.lp .ci-card h3 { margin: 4px 0 2px; }
.lp a.ci-btn { padding: 7px 18px; font-size: .85rem; }
`;