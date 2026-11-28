import { useEffect, useState } from "react";
import headerLogo from "../assets/CTU Logo.png";
import ClinicInfo from "./ClinicInfo";
import PriorityLane from "./PriorityLane";
import ClinicServices from "./ClinicServices";

const slideFiles = import.meta.glob("../assets/{first,second,third}.png", { eager: true, import: "default" });
const logoFiles = import.meta.glob("../assets/logo.png", { eager: true, import: "default" });

const LOGO = Object.values(logoFiles)[0];
const SLIDE_RATIO = "1 / 1"; // width / height of your pictures
const SLIDE_DELAY = 2750;

const FOUND = ["first", "second", "third"]
  .map((name) => slideFiles[`../assets/${name}.png`])
  .filter(Boolean);
// The carousel needs three slides, so pictures repeat if there are fewer.
const SLIDES = [0, 1, 2].map((i) => FOUND[i % FOUND.length]);

const HOURS = [
  { day: "Monday to Friday", times: ["8:00 AM to 5:00 PM (no noon break)", "6:00 PM to 9:00 PM"] },
  { day: "Saturday", times: ["8:00 AM to 12:00 noon", "1:00 PM to 5:00 PM"] },
];

const PRIORITY = ["Pregnant women", "Persons with disability (PWD)", "Senior citizens"];

const SERVICE_HOURS = "Monday to Friday, 8:00 AM to 5:00 PM (no noon break)";

// step: [what you do, what the clinic does, time, person in charge, form]
const SERVICES = [
  {
    id: "consultation",
    name: "Consultation and Treatment",
    who: ["All students, personnel and visitors"],
    requirements: ["School Identification Card and Visitor's Pass"],
    duration: "20 minutes",
    steps: [
      ["Submit yourself for check-up, treatment or medical advice", "Accommodates the patient", "30 seconds", "Nurse"],
      ["", "Asks for your name and chief complaint or reason for visiting", "30 seconds", "Nurse"],
      ["Log your name and personal data", "Instructs you to log your name and personal data", "30 seconds", "Nurse", "Daily Treatment Record"],
      ["", "Prepares your treatment record and reviews your health history", "5 minutes", "Nurse", "Patient's Treatment Record"],
      ["", "Takes your vital signs", "3 minutes", "Nurse", "Patient's Treatment Record"],
      ["", "Assesses you and provides treatment, medications and health teaching", "9 minutes", "Physician / Nurse", "Patient's Treatment Record"],
      ["", "Gives follow-up instructions if necessary", "30 seconds", "Physician / Nurse", "Patient's Treatment Record"],
      ["Answer the patient satisfaction survey", "", "1 minute", "Nurse", "Patient's Satisfaction Survey"],
    ],
  },
  {
    id: "emergency",
    name: "Emergency Care",
    who: ["Students, school personnel and visitors who need emergency treatment"],
    requirements: ["None"],
    duration: "6 minutes for assessment and first aid",
    steps: [
      ["The patient is brought to the clinic", "Assesses level of consciousness; circulation, airway and breathing (CAB); injuries and bleeding", "2 minutes", "Physician / Nurse"],
      ["", "Gives first aid", "4 minutes", "Physician / Nurse"],
      ["", "Transports the patient to the most appropriate health facility, accompanying them if necessary", "", "Nurse", "Physician / Nurse's Referral Note"],
      ["", "Notifies the patient's parent or guardian", "", "Nurse"],
      ["", "Documents the incident", "", "Nurse", "Daily Treatment Record"],
      ["", "Follows up on the patient", "", "Nurse"],
    ],
  },
  {
    id: "referral",
    name: "Referral",
    who: ["Students, school personnel and official visitors who need further medical treatment or laboratory examinations"],
    requirements: ["None"],
    duration: "15 minutes",
    steps: [
      ["Visit the clinic for consultation if symptoms persist after treatment, for serious illness, or if you need laboratory work-up", "Evaluates whether you need further observation or immediate referral", "5 minutes", "Physician / Nurse"],
      ["", "Explains the details of the referral", "7 minutes", "Physician / Nurse"],
      ["", "Calls or notifies your parent or guardian", "2 minutes", "Nurse"],
      ["", "Gives you the referral note and asks you to return for follow-up", "1 minute", "Physician / Nurse", "Physician / Nurse's Referral Note"],
    ],
  },
  {
    id: "physical",
    name: "Physical Examination",
    note: "Offered during the enrollment period.",
    who: [
      "All incoming students (undergraduate, special programs and graduate school)",
      "Undergraduate returnees not enrolled for one semester or more",
      "Graduate school and special program returnees not enrolled for two years or more",
      "Transferees",
      "Cross-enrollees",
    ],
    duration: "15 minutes",
    steps: [
      ["Submit your medical requirements", "Screens the requirements", "2 minutes", "Nurse"],
      ["", "Gives you the physical examination report and asks you to fill in your personal information", "1 minute", "Nurse", "Physical Examination Report"],
      ["Fill in your personal information and give the form to the school nurse", "Interviews you about your health history and present conditions, assesses your health and takes vital signs", "10 minutes", "Nurse", "Physical Examination Report"],
      ["", "Informs you of the findings", "1 minute", "Physician / Nurse", "Physical Examination Report"],
      ["", "Directs you to the next step of enrollment", "1 minute", "Physician / Nurse", "Physical Examination Report"],
    ],
  },
];

const EXAM_REQUIREMENTS = [
  {
    group: "Freshmen, shiftees, transferees and returnees",
    items: ["Chest X-ray (PA view) result", "Complete Blood Count", "Medical Certificate", "Drug Test"],
  },
  {
    group: "Food-related programs: BSHM, BSTrM, Food Tech, BTTE major in Foods and Services Technology",
    items: ["Chest X-ray (PA view) result", "Complete Blood Count", "Stool Examination Result", "Medical Certificate", "Drug Test"],
  },
  {
    group: "All BSMAR E students (freshmen and old students)",
    items: ["Chest X-ray (PA view) result", "Audiometry", "Eyesight: Ishihara, Lantern or other color perception test", "HBs Ag", "Psychological test", "Urinalysis", "Complete Blood Count", "Stool Examination Result", "Medical Certificate", "Drug Test"],
    note: "All results must be from DOH and MARINA accredited laboratories.",
  },
];

const NAV = [["Home", "home"], ["Services", "services"], ["Hours", "hours"], ["Contact", "contact"]];

function Carousel() {
  const [{ index, last }, setSlide] = useState({ index: 0, last: 0 });
  const total = SLIDES.length;
  const go = (n) => setSlide((s) => ({ index: (n + total) % total, last: s.index }));
  // -1 = left of the frame, 0 = visible, 1 = right of the frame
  const position = (i, current) => ((i - current + 1 + total) % total) - 1;

  useEffect(() => {
    const timer = setTimeout(() => go(index + 1), SLIDE_DELAY);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div className="carousel" style={{ aspectRatio: SLIDE_RATIO }} role="region"
      aria-roledescription="carousel" aria-label="Clinic announcements">
      {SLIDES.map((src, i) => {
        const jump = Math.abs(position(i, index) - position(i, last)) > 1;
        return (
          <div key={i} className={jump ? "slide jump" : "slide"} aria-hidden={i !== index}
            style={{ transform: `translateX(${position(i, index) * 100}%)` }}>
            {src ? <img src={src} alt={`Clinic announcement ${i + 1}`} />
              : <span>Add first.png, second.png and third.png to src/assets</span>}
          </div>
        );
      })}
      <button type="button" className="arrow prev" aria-label="Previous slide" onClick={() => go(index - 1)}>&#8249;</button>
      <button type="button" className="arrow next" aria-label="Next slide" onClick={() => go(index + 1)}>&#8250;</button>
      <div className="dots">
        {SLIDES.map((_, i) => (
          <button type="button" key={i} aria-label={`Go to slide ${i + 1}`}
            aria-current={i === index} onClick={() => go(i)} />
        ))}
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState(SERVICES[0].id);
  const service = SERVICES.find((s) => s.id === activeId);

  return (
    <div className="lp" id="home">
      <style>{css}</style>

      <header className="nav">
        <div className="wrap nav-row">
          <a href="#home" className="logo">
          <img src={headerLogo} alt="" />
          <span className="logo-text">
            <strong>Smart<em>Clinic</em></strong>
            <small>Kahimsug Clinic</small>
          </span>
        </a>
          <button type="button" className="menu-btn" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? "Close" : "Menu"}
          </button>
          <nav className={menuOpen ? "links open" : "links"}>
            {NAV.map(([label, id]) => (
              <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>{label}</a>
            ))}
          </nav>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="wrap hero-grid">
            <Carousel />
            <ClinicInfo />
          </div>
        </section>

        <aside className="wrap priority" aria-labelledby="priority-title">
          <PriorityLane />
        </aside>

        <section className="wrap services" id="services">
          <ClinicServices />
        </section>
      </main>

      <footer id="contact">
        <div className="wrap foot">
          <div>
            <h2>Cebu Technological University, Argao Campus</h2>
            <p>Ed Kintanar Street, Lamacan, Argao, Cebu, Philippines</p>
            <p><a href="http://www.argao.ctu.edu.ph" target="_blank" rel="noreferrer">www.argao.ctu.edu.ph</a></p>
          </div>
          <div>
            <p>Phone: (032) 485-8290 / 485-1109 loc. 1702</p>
            <p>Fax: (032) 485-8290</p>
            <p>Email: <a href="mailto:ctu.argao@yahoo.com">ctu.argao@yahoo.com</a></p>
          </div>
        </div>
        <p className="wrap copy">SmartClinic: a digital clinic management system</p>
      </footer>
    </div>
  );
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

html { scroll-behavior: smooth; }
body { margin: 0; }
#root { width: 100%; max-width: none; margin: 0; padding: 0; }
.lp {
  --blue: #0b72e7; --blue-text: #0867c9; --navy: #0c2d57; --mist: #f3f7fc; --line: #dde6f1; --muted: #55606e;
  width: 100%; text-align: left; background: #fff; color: #1b1d21;
  font: 400 15px/1.65 'Poppins', system-ui, sans-serif;
}
.lp *, .lp *::before, .lp *::after { box-sizing: border-box; }
.lp h1, .lp h2, .lp h3, .lp h4, .lp h5 { margin: 0 0 10px; line-height: 1.3; color: var(--navy); font-family: inherit; letter-spacing: normal; }
.lp h1 { font-size: clamp(1.8rem, 4vw, 2.6rem); font-weight: 700; }
.lp h2 { font-size: 1.35rem; font-weight: 600; }
.lp h3 { font-size: 1rem; font-weight: 600; }
.lp h4 { font-size: 1rem; font-weight: 600; margin-top: 28px; }
.lp h5 { font-size: .9rem; font-weight: 600; }
.lp p { margin: 0 0 8px; }
.lp ul { margin: 0; padding-left: 20px; }
.lp a { color: var(--blue-text); }
.lp a:focus-visible, .lp button:focus-visible { outline: 3px solid #f2a900; outline-offset: 2px; }
.lp button { font-family: inherit; cursor: pointer; }
.lp .wrap { width: min(1080px, 100% - 32px); margin-inline: auto; }
.lp .muted, .lp .lead { color: var(--muted); }
.lp [id] { scroll-margin-top: 84px; }

.lp .nav { position: sticky; top: 0; z-index: 10; background: #fff; border-bottom: 1px solid var(--line); }
.lp .nav-row { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; min-height: 70px; }
.lp .logo { display: flex; align-items: center; gap: 10px; font-size: 1.3rem; font-weight: 700; line-height: 1.2; text-decoration: none; }
.lp .logo img { display: block; height: 56px; width: auto; }
.lp .logo-text { display: block; padding-left: 12px; border-left: 2px solid #dde6f1; }
.lp .logo-text strong { display: block; font-size: 1.5rem; line-height: 1.15; color: #0c2d57; }
.lp .logo-text em { font-style: normal; color: #d89b00; }
.lp .logo .logo-text small { font-size: .85rem; font-weight: 600; color: #0c2d57; }
.lp .logo small { display: block; font-size: .72rem; font-weight: 400; color: var(--muted); }
.lp .links { display: flex; gap: 28px; }
.lp .links a { color: var(--navy); font-weight: 500; text-decoration: none; }
.lp .links a:hover { color: var(--blue-text); text-decoration: underline; }
.lp .menu-btn { display: none; padding: 6px 14px; background: #fff; border: 1px solid var(--line); border-radius: 8px; color: var(--navy); }

.lp .hero { background: var(--mist); padding-block: 48px; }
.lp .hero-grid { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 48px; align-items: center; }
.lp .hours { margin-top: 24px; padding: 24px; background: #fff; border: 1px solid var(--line); border-radius: 14px; }
.lp .day { padding-top: 12px; margin-top: 12px; border-top: 1px solid var(--line); }
.lp .day h3 { color: var(--blue-text); margin-bottom: 4px; }
.lp .day p { margin: 0; }

.lp .carousel { position: relative; width: 100%; overflow: hidden; border-radius: 16px; background: #fff; }
.lp .slide { position: absolute; inset: 0; display: grid; place-items: center; padding: 24px; text-align: center; color: var(--muted); transition: transform .6s ease; }
.lp .slide.jump { transition: none; }
.lp .slide img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; }
.lp .carousel button { position: absolute; z-index: 1; bottom: 12px; border: 0; }
.lp .carousel .arrow { width: 34px; height: 34px; border-radius: 50%; background: #fff; color: var(--navy); font-size: 22px; line-height: 1; box-shadow: 0 1px 6px #0004; }
.lp .arrow.prev { left: 12px; }
.lp .arrow.next { right: 12px; }
.lp .dots { position: absolute; z-index: 1; bottom: 18px; left: 50%; transform: translateX(-50%); display: flex; gap: 8px; padding: 6px 10px; border-radius: 20px; background: #fff; }
.lp .dots button { position: static; display: block; width: 10px; height: 10px; padding: 0; border-radius: 50%; background: #aac3e0; }
.lp .dots button[aria-current="true"] { background: var(--blue); }

.lp .priority { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 16px; margin-top: 32px; padding: 22px 28px; background: #fff6df; border: 2px solid #f2a900; border-radius: 14px; }
.lp .priority h2, .lp .priority p { margin: 0; }
.lp .priority ul { display: flex; flex-wrap: wrap; gap: 10px; list-style: none; padding: 0; }
.lp .priority li { padding: 7px 16px; background: #fff; border-radius: 24px; font-weight: 600; color: var(--navy); }

.lp .services { padding-block: 56px; }
.lp .tabs { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin: 20px 0; }
.lp .tabs button { padding: 14px 10px; font-size: .9rem; font-weight: 600; color: var(--blue-text); background: #fff; border: 1.5px solid var(--line); border-radius: 10px; }
.lp .tabs button:hover { border-color: var(--blue); }
.lp .tabs button[aria-pressed="true"] { background: var(--blue); border-color: var(--blue); color: #fff; }
.lp .panel { padding: clamp(18px, 4vw, 36px); border: 1px solid var(--line); border-radius: 16px; }
.lp .panel-title { font-size: 1.35rem; }
.lp .facts { display: grid; grid-template-columns: 2fr 1.4fr 1fr; gap: 16px; margin: 16px 0 0; padding: 16px 20px; background: var(--mist); border-radius: 10px; }
.lp .facts dt { font-size: .8rem; color: var(--muted); }
.lp .facts dd { margin: 0; font-weight: 600; }
.lp .info { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(280px, 100%), 1fr)); column-gap: 32px; }
.lp .reqs { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
.lp .reqs > div { padding: 16px; border: 1px solid var(--line); border-radius: 10px; font-size: .9rem; }
.lp .reqs p { margin: 12px 0 0; }
.lp .reminder { margin-top: 14px; font-weight: 600; color: var(--navy); }
.lp .steps { list-style: none; margin: 0; padding: 0; }
.lp .steps li { display: flex; gap: 16px; padding-block: 16px; border-top: 1px solid var(--line); }
.lp .steps p { margin: 0 0 4px; }
.lp .num { flex: 0 0 32px; height: 32px; display: grid; place-items: center; border-radius: 50%; background: var(--blue); color: #fff; font-weight: 600; font-size: .85rem; }
.lp .meta { display: flex; flex-wrap: wrap; gap: 6px; padding-top: 4px; }
.lp .meta span { padding: 2px 10px; border-radius: 20px; background: var(--mist); font-size: .78rem; color: var(--muted); }

.lp footer { background: var(--navy); color: #fff; padding-block: 40px 20px; }
.lp footer h2 { color: #fff; font-size: 1.1rem; }
.lp footer a { color: #bcdcff; }
.lp .foot { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 24px; }
.lp .copy { margin-top: 28px; padding-top: 16px; border-top: 1px solid #ffffff33; font-size: .82rem; }

@media (max-width: 800px) {
  .lp .menu-btn { display: block; }
  .lp .links { display: none; width: 100%; flex-direction: column; gap: 12px; padding-block: 10px 16px; }
  .lp .links.open { display: flex; }
  .lp .hero-grid { grid-template-columns: minmax(0, 1fr); gap: 32px; }
  .lp .tabs { grid-template-columns: repeat(2, 1fr); }
  .lp .facts, .lp .reqs { grid-template-columns: 1fr; }
}
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  .lp .slide { transition: none; }
}
`;