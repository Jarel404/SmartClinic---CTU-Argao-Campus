import { useState } from "react";

const SERVICE_HOURS = "Monday to Friday, 8:00 AM to 5:00 PM (no noon break)";

// step: [what you do, what the clinic does, time, person in charge, form]
const SERVICES = [
  {
    id: "consultation",
    short: "Consultation",
    icon: "stethoscope",
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
    short: "Emergency",
    icon: "aid",
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
    short: "Referral",
    icon: "referral",
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
    short: "Physical Exam",
    icon: "exam",
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
    short: "General",
    group: "Freshmen, shiftees, transferees and returnees",
    items: ["Chest X-ray (PA view) result", "Complete Blood Count", "Medical Certificate", "Drug Test"],
  },
  {
    short: "Food programs",
    group: "Food-related programs: BSHM, BSTrM, Food Tech, BTTE major in Foods and Services Technology",
    items: ["Chest X-ray (PA view) result", "Complete Blood Count", "Stool Examination Result", "Medical Certificate", "Drug Test"],
  },
  {
    short: "BSMAR E",
    group: "All BSMAR E students (freshmen and old students)",
    items: ["Chest X-ray (PA view) result", "Audiometry", "Eyesight: Ishihara, Lantern or other color perception test", "HBs Ag", "Psychological test", "Urinalysis", "Complete Blood Count", "Stool Examination Result", "Medical Certificate", "Drug Test"],
    note: "All results must be from DOH and MARINA accredited laboratories.",
  },
];

const ICONS = {
  stethoscope: "M6 3v6a4 4 0 0 0 8 0V3M10 13v3a5 5 0 0 0 10 0v-2M20 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",
  aid: "M9 7V4h6v3M3 7h18v13H3zM12 10v7M8.5 13.5h7",
  referral: "M6 3h8l5 5v13H6zM14 3v5h5M9 15h7M13.5 12.5 16 15l-2.5 2.5",
  exam: "M9 5H5v16h14V5h-4M9 3h6v4H9zM7.5 14H10l1.5-3 2 6 1.5-3h1.5",
  calendar: "M4 6h16v14H4zM4 10h16M8 3v5M16 3v5",
  clock: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18ZM12 7v5l3 2",
  tag: "M3 12l9-9h9v9l-9 9zM16.5 7.5h.01",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM5 21c0-4 3-6 7-6s7 2 7 6",
  file: "M6 3h8l5 5v13H6zM14 3v5h5M9 13h7M9 17h7",
};

function Icon({ name, size = 20 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor"
      strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={ICONS[name]} />
    </svg>
  );
}

function Checklist({ items, checked, onToggle }) {
  const ready = items.filter((item) => checked[item]).length;
  return (
    <>
      <div className="cs-progress">
        <span style={{ width: `${(ready / items.length) * 100}%` }} />
      </div>
      <p className="cs-count" aria-live="polite">
        {ready === items.length ? "All set" : `${ready} of ${items.length} ready`}
      </p>
      <ul className="cs-checks">
        {items.map((item) => (
          <li key={item}>
            <label>
              <input type="checkbox" checked={!!checked[item]} onChange={() => onToggle(item)} />
              <span>{item}</span>
            </label>
          </li>
        ))}
      </ul>
    </>
  );
}

export default function ClinicServices() {
  const [{ index, direction }, setTab] = useState({ index: 0, direction: 1 });
  const [group, setGroup] = useState(0);
  const [ticks, setTicks] = useState({});

  const service = SERVICES[index];
  const isExam = service.id === "physical";
  const exam = EXAM_REQUIREMENTS[group];
  const items = isExam ? exam.items : (service.requirements || []).filter((r) => r !== "None");

  // Ticks are remembered separately for each service and student group.
  const listId = isExam ? `exam-${group}` : service.id;
  const checked = ticks[listId] || {};
  const toggle = (item) => setTicks({ ...ticks, [listId]: { ...checked, [item]: !checked[item] } });

  const choose = (next) => {
    if (next !== index) setTab({ index: next, direction: next > index ? 1 : -1 });
  };

  const facts = [
    ["calendar", "Available", SERVICE_HOURS],
    ["clock", "Duration", service.duration],
    ["tag", "Fees", "None"],
  ];

  return (
    <section className="wrap services cs" id="services">
      <style>{css}</style>
      <h2>Clinic services</h2>
      <p className="cs-intro">Choose a service to see who can use it, what to bring and what happens.</p>

      <div className="cs-tabs">
        <span className="cs-slider" style={{ transform: `translateX(${index * 100}%)` }} aria-hidden="true" />
        {SERVICES.map((s, i) => (
          <button type="button" key={s.id} aria-pressed={i === index} onClick={() => choose(i)}>
            <span className="cs-tab-icon"><Icon name={s.icon} size={24} /></span>
            {s.short}
          </button>
        ))}
      </div>

      {/* The key restarts the animation each time another service is chosen. */}
      <article className="cs-panel" key={service.id} style={{ "--from": `${direction * 32}px` }}>
        <header className="cs-head">
          <span className="cs-big"><Icon name={service.icon} size={30} /></span>
          <div>
            <h3>{service.name}</h3>
            {service.note && <p>{service.note}</p>}
          </div>
        </header>

        <dl className="cs-facts">
          {facts.map(([icon, label, value]) => (
            <div key={label}>
              <Icon name={icon} />
              <div><dt>{label}</dt><dd>{value}</dd></div>
            </div>
          ))}
        </dl>

        <div className="cs-body">
          <aside className="cs-side">
            <h4><Icon name="user" /> Who may avail</h4>
            <ul className="cs-who">{service.who.map((w) => <li key={w}>{w}</li>)}</ul>

            <h4><Icon name="file" /> What to bring</h4>
            {isExam && (
              <>
                <div className="cs-groups">
                  {EXAM_REQUIREMENTS.map((g, i) => (
                    <button type="button" key={g.short} aria-pressed={i === group} onClick={() => setGroup(i)}>
                      {g.short}
                    </button>
                  ))}
                </div>
                <p className="cs-small">{exam.group}</p>
              </>
            )}
            {items.length > 0
              ? <Checklist items={items} checked={checked} onToggle={toggle} />
              : <p>No requirements needed.</p>}
            {isExam && (
              <>
                {exam.note && <p className="cs-note">{exam.note}</p>}
                <p className="cs-note">Bring the original medical requirements with one photocopy of each page.</p>
              </>
            )}
          </aside>

          <div className="cs-main">
            <h4><Icon name={service.icon} /> How it works</h4>
            <ol className="cs-steps">
              {service.steps.map(([you, clinic, time, staff, form], i) => (
                <li key={i} style={{ animationDelay: `${150 + i * 80}ms` }}>
                  <span className="cs-num" aria-hidden="true">{i + 1}</span>
                  <div>
                    {you && <p><strong>You:</strong> {you}</p>}
                    {clinic && <p><strong>Clinic:</strong> {clinic}</p>}
                    <p className="cs-meta">
                      {time && <span><Icon name="clock" size={14} />{time}</span>}
                      <span><Icon name="user" size={14} />{staff}</span>
                      {form && <span><Icon name="file" size={14} />{form}</span>}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </article>
    </section>
  );
}

const css = `
.lp .cs h2 { margin-bottom: 4px; }
.lp .cs .cs-intro { color: #55606e; margin-bottom: 18px; }
.lp .cs ul, .lp .cs ol { margin: 0; padding: 0; list-style: none; }
.lp .cs h4 { display: flex; align-items: center; gap: 8px; margin: 0 0 10px; font-size: .95rem; }
.lp .cs h4 svg { color: #0b72e7; }

.lp .cs-tabs { position: relative; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); padding: 5px; background: #f3f7fc; border-radius: 16px; }
.lp .cs-slider { position: absolute; top: 5px; bottom: 5px; left: 5px; width: calc((100% - 10px) / 4); background: #fff; border: 1px solid #0b72e7; border-radius: 12px; transition: transform .4s cubic-bezier(.3, 1.3, .5, 1); }
.lp .cs-tabs button { position: relative; display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 12px 4px; border: 0; background: none; color: #55606e; font-size: .85rem; font-weight: 600; transition: color .2s; }
.lp .cs-tabs button:hover, .lp .cs-tabs button[aria-pressed="true"] { color: #0867c9; }
.lp .cs-tab-icon { display: flex; transition: transform .2s; }
.lp .cs-tabs button:hover .cs-tab-icon { transform: translateY(-3px); }
.lp .cs-tabs button[aria-pressed="true"] .cs-tab-icon { animation: cs-pop .45s ease; }

.lp .cs-panel { margin-top: 16px; padding: clamp(16px, 3vw, 28px); border: 1px solid #dde6f1; border-radius: 18px; animation: cs-in .4s ease both; }
.lp .cs-head { display: flex; align-items: center; gap: 14px; }
.lp .cs-big { flex: 0 0 56px; height: 56px; display: grid; place-items: center; border: 1px solid #dde6f1; border-radius: 50%; color: #0b72e7; }
.lp .cs-head h3 { margin: 0; font-size: 1.3rem; }
.lp .cs-head p { margin: 0; color: #55606e; font-size: .85rem; }
.lp .cs-facts { display: grid; grid-template-columns: 2fr 1.4fr .8fr; gap: 14px; margin: 18px 0 22px; padding: 14px 0; border-block: 1px solid #dde6f1; }
.lp .cs-facts > div { display: flex; gap: 10px; align-items: flex-start; color: #0b72e7; }
.lp .cs-facts svg { flex: none; margin-top: 3px; }
.lp .cs-facts dt { font-size: .75rem; color: #55606e; }
.lp .cs-facts dd { margin: 0; font-size: .88rem; font-weight: 600; color: #1b1d21; }

.lp .cs-body { display: grid; grid-template-columns: minmax(0, 1fr) 300px; grid-template-areas: "main side"; gap: 28px; align-items: start; }
.lp .cs-main { grid-area: main; }
.lp .cs-side { grid-area: side; padding: 18px; background: #f3f7fc; border-radius: 14px; font-size: .85rem; }
.lp .cs .cs-who { margin-bottom: 20px; }
.lp .cs-who li { margin-bottom: 6px; padding-left: 12px; border-left: 2px solid #0b72e7; }
.lp .cs-groups { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px; }
.lp .cs-groups button { padding: 5px 12px; border: 1px solid #c7d6ea; border-radius: 20px; background: #fff; color: #0c2d57; font-size: .75rem; font-weight: 600; }
.lp .cs-groups button[aria-pressed="true"] { background: #0c2d57; border-color: #0c2d57; color: #fff; }
.lp .cs-small { color: #55606e; font-size: .78rem; }
.lp .cs-progress { height: 5px; overflow: hidden; border-radius: 5px; background: #dde6f1; }
.lp .cs-progress span { display: block; height: 100%; background: #0b72e7; transition: width .3s ease; }
.lp .cs .cs-count { margin: 4px 0 8px; color: #55606e; font-size: .75rem; }
.lp .cs-checks label { display: flex; gap: 10px; align-items: flex-start; padding: 5px 0; cursor: pointer; }
.lp .cs-checks input { flex: none; width: 16px; height: 16px; margin: 3px 0 0; accent-color: #0b72e7; }
.lp .cs-checks input:checked + span { color: #55606e; text-decoration: line-through; }
.lp .cs .cs-note { margin: 10px 0 0; font-weight: 600; color: #0c2d57; }

.lp .cs-steps li { position: relative; display: flex; gap: 14px; padding-bottom: 16px; animation: cs-up .4s ease both; }
.lp .cs-steps li:not(:last-child)::before { content: ""; position: absolute; left: 15px; top: 34px; bottom: 2px; width: 1px; background: #c7d6ea; }
.lp .cs-num { flex: 0 0 31px; height: 31px; display: grid; place-items: center; border: 1px solid #0b72e7; border-radius: 50%; color: #0867c9; font-size: .8rem; font-weight: 600; transition: background .2s, color .2s; }
.lp .cs-steps li:hover .cs-num { background: #0b72e7; color: #fff; }
.lp .cs-steps p { margin: 0 0 2px; font-size: .88rem; }
.lp .cs-steps .cs-meta { display: flex; flex-wrap: wrap; gap: 4px 16px; padding-top: 4px; color: #55606e; font-size: .75rem; }
.lp .cs-meta span { display: inline-flex; align-items: center; gap: 5px; }

@keyframes cs-in { from { opacity: 0; transform: translateX(var(--from)); } }
@keyframes cs-up { from { opacity: 0; transform: translateY(14px); } }
@keyframes cs-pop { 50% { transform: scale(1.3); } }
@media (max-width: 760px) {
  .lp .cs-tabs button { font-size: .68rem; }
  .lp .cs-facts { grid-template-columns: 1fr; }
  .lp .cs-body { grid-template-columns: minmax(0, 1fr); grid-template-areas: "side" "main"; }
}
@media (prefers-reduced-motion: reduce) {
  .lp .cs-panel, .lp .cs-steps li, .lp .cs-tabs button[aria-pressed="true"] .cs-tab-icon { animation: none; }
  .lp .cs-slider, .lp .cs-progress span, .lp .cs-tab-icon { transition: none; }
}
`;