import { useEffect, useState } from "react";
import first from "../assets/first.png";
import second from "../assets/second.png";

/* Edit these constants to use your own content. */
const BRAND = "Sample Clinic";
const PHONE = "(000) 000-0000";

/* Carousel images: put your files in the "public" folder, or change these paths. */
const SLIDES = [
  { src: first, alt: "Describe your first picture" },
  { src: second, alt: "Describe your second picture" },
  { src: first, alt: "Describe your third picture" },
];
const SLIDE_DELAY = 2500; // milliseconds between slides

const NAV = [
  ["Home", "home"],
  ["About", "about"],
  ["Clinics", "clinics"],
  ["Services", "services"],
  ["Careers", "careers"],
  ["Doctors", "doctors"],
];

const SERVICES = [
  ["Women's Health Center", "Check-ups, screening and prenatal care.", "women"],
  ["Rehabilitation Center", "Physical therapy and recovery programs.", "rehab"],
  ["Dental Center", "Cleaning, fillings and oral exams.", "dental"],
  ["Central Laboratory", "Blood tests and diagnostic work.", "lab"],
  ["Executive Medical Center", "Complete annual physical exams.", "executive"],
  ["Ambulatory Surgical Center", "Same-day minor procedures.", "surgery"],
];

const REVIEWS = ["Patient A", "Patient B", "Patient C"].map((name) => ({
  name,
  text: "Sample review. Replace this with real feedback that a patient has agreed to share.",
}));

const ICONS = {
  women: "M12 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 10v8m-4-4h8",
  rehab: "M3 12h4l3-7 4 14 3-7h4",
  dental: "M7 3C4 3 3 6 4 9c1 3 1 5 2 9 .5 3 3 3 3.5 0l1-4c.4-1.5 2.600-1.500 3 0l1 4c.5 3 3 3 3.500 0 1-4 1-6 2-9 1-3 0-6-3-6-2 0-3 1-5 1S9 3 7 3Z",
  lab: "M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3M7.5 15h9",
  executive: "M9 7V4h6v3M4 7h16v13H4zM12 10v7m-3.500-3.500h7",
  surgery: "M4 4h16v16H4zM12 8v8M8 12h8",
};

function Icon({ name }) {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor"
      strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={ICONS[name]} />
    </svg>
  );
}

function Carousel() {
  const [{ index, last }, setSlide] = useState({ index: 0, last: 0 });
  const [missing, setMissing] = useState({});
  const total = SLIDES.length;
  const go = (n) =>
    setSlide((s) => ({ index: (n + total) % total, last: s.index }));
  // Where a slide sits: -1 = left of the frame, 0 = visible, 1 = right of the frame.
  const position = (i, current) => ((i - current + 1 + total) % total) - 1;

  useEffect(() => {
    const timer = setTimeout(() => go(index + 1), SLIDE_DELAY);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div className="carousel" role="region" aria-roledescription="carousel" aria-label="Clinic photos">
      {SLIDES.map((slide, i) => {
        // A slide moving to the other side jumps there out of view, so the loop never rewinds.
        const jump = Math.abs(position(i, index) - position(i, last)) > 1;
        return (
          <div key={i} className={jump ? "slide jump" : "slide"} aria-hidden={i !== index}
            style={{ transform: `translateX(${position(i, index) * 100}%)` }}>
            {missing[i] ? (
              <span>Add your picture: {slide.src}</span>
            ) : (
              <img src={slide.src} alt={slide.alt}
                onError={() => setMissing((m) => ({ ...m, [i]: true }))} />
            )}
          </div>
        );
      })}

      <button type="button" className="arrow prev" aria-label="Previous slide"
        onClick={() => go(index - 1)}>&#8249;</button>
      <button type="button" className="arrow next" aria-label="Next slide"
        onClick={() => go(index + 1)}>&#8250;</button>

      <div className="dots">
        {SLIDES.map((_, i) => (
          <button type="button" key={i} aria-label={`Go to slide ${i + 1}`}
            aria-current={i === index} onClick={() => go(i)} />
        ))}
      </div>
    </div>
  );
}

export default function ClinicHomePage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="cp" id="home">
      <style>{css}</style>

      <header className="nav">
        <div className="wrap nav-row">
          <a href="#home" className="logo">{BRAND}</a>
          <button className="menu-btn" aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? "Close" : "Menu"}
          </button>
          <nav className={menuOpen ? "links open" : "links"}>
            {NAV.map(([label, id]) => (
              <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>{label}</a>
            ))}
            <a href="#contact" className="btn solid" onClick={() => setMenuOpen(false)}>
              Contact us
            </a>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="wrap hero-grid">
            <h1 className="sr">An easier way to put your health first</h1>
            <Carousel />
            <div className="photo" role="img" aria-label="Photo placeholder">
              Add a clinic photo here
            </div>
          </div>
        </section>

        <section className="wrap" id="about">
          <div className="feature">
            <div>
              <h2>Care that is built around you</h2>
              <p>Learn how our team supports patients from the first visit to follow-up.</p>
              <div className="actions">
                <a href="#contact" className="btn light">Contact us</a>
                <a href="#clinics" className="btn ghost">Learn more</a>
              </div>
            </div>
            <div className="video">Video placeholder</div>
          </div>
        </section>

        <section className="wrap section" id="services">
          <h2>Our services</h2>
          <p className="sub">Choose a center to see what it offers.</p>
          <div className="cards">
            {SERVICES.map(([title, desc, icon]) => (
              <article className="card" key={title}>
                <span className="icon"><Icon name={icon} /></span>
                <h3>{title}</h3>
                <p>{desc}</p>
                <a href="#contact">Learn more<span className="sr"> about {title}</span></a>
              </article>
            ))}
          </div>
        </section>

        <section className="wrap promos" id="clinics">
          <div className="promo wide">
            <h2>Your gateway to simpler, better healthcare</h2>
            <a href="#contact" className="btn solid">Find a clinic near you</a>
          </div>
          <div className="stack">
            <div className="promo" id="doctors">
              <h3>Corporate benefit solutions</h3>
              <a href="#contact" className="btn line">Learn more</a>
            </div>
            <div className="promo">
              <h3>Hemodialysis</h3>
              <a href="#contact" className="btn line">Learn more</a>
            </div>
          </div>
        </section>

        <section className="band">
          <div className="wrap center">
            <h2>Accredited by</h2>
            <div className="partners">
              {[1, 2, 3, 4].map((n) => <div key={n}>Partner logo {n}</div>)}
            </div>
          </div>
        </section>

        <section className="wrap section center">
          <h2>Patient care experience</h2>
          <div className="reviews">
            {REVIEWS.map((r) => (
              <figure className="card" key={r.name}>
                <blockquote>{r.text}</blockquote>
                <figcaption>{r.name} (placeholder)</figcaption>
              </figure>
            ))}
          </div>
          <a href="#contact" className="btn line">Leave a review</a>
        </section>

        <section className="social" id="careers">
          <div className="wrap center">
            <h2>Connect with us</h2>
            <p>Follow us for health tips and clinic updates.</p>
            <div className="actions">
              <a href="#contact" className="btn ghost">Facebook</a>
              <a href="#contact" className="btn ghost">Instagram</a>
            </div>
            <div className="feed">Social media feed placeholder</div>
          </div>
        </section>
      </main>

      <footer id="contact">
        <div className="wrap foot">
          <div>
            <p className="logo">{BRAND}</p>
            <p>Phone: {PHONE}</p>
            <p>Email: hello@example.com</p>
          </div>
          <ul>
            {NAV.map(([label, id]) => <li key={id}><a href={`#${id}`}>{label}</a></li>)}
          </ul>
        </div>
        <p className="wrap copy">© {new Date().getFullYear()} {BRAND}. All rights reserved.</p>
      </footer>
    </div>
  );
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=Lexend:wght@500;600&family=Source+Sans+3:wght@400;600&display=swap');

html { scroll-behavior: smooth; }
body { margin: 0; }
.cp {
  --ink: #14272c; --muted: #52686e; --teal: #0e6068; --deep: #0a444a;
  --mist: #eef5f4; --line: #d5e3e2;
  font: 400 17px/1.6 'Source Sans 3', system-ui, sans-serif;
  color: var(--ink); background: #fff;
}
.cp *, .cp *::before, .cp *::after { box-sizing: border-box; }
.cp h1, .cp h2, .cp h3, .cp .logo {
  font-family: 'Lexend', system-ui, sans-serif; line-height: 1.25; margin: 0 0 12px;
}
.cp h2 { font-size: clamp(1.5rem, 3vw, 2rem); font-weight: 600; }
.cp h3 { font-size: 1.1rem; font-weight: 500; }
.cp p { margin: 0 0 16px; }
.cp a { color: var(--teal); text-underline-offset: 3px; }
.cp a:focus-visible, .cp button:focus-visible { outline: 3px solid #e9a23b; outline-offset: 2px; }
.cp section[id], .cp div[id], .cp footer[id] { scroll-margin-top: 80px; }
.cp .wrap { width: min(1120px, 100% - 32px); margin-inline: auto; }
.cp .section { padding-block: 72px; }
.cp .center { text-align: center; }
.cp .sub { color: var(--muted); }
.cp .sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }

.cp .btn {
  display: inline-block; padding: 10px 22px; border-radius: 8px;
  border: 1.5px solid transparent; font-weight: 600; text-decoration: none;
}
.cp .btn.solid { background: var(--teal); color: #fff; }
.cp .btn.solid:hover { background: var(--deep); }
.cp .btn.line { border-color: var(--teal); color: var(--teal); }
.cp .btn.line:hover { background: var(--mist); }
.cp .btn.light { background: #fff; color: var(--deep); }
.cp .btn.ghost { border-color: #ffffff99; color: #fff; }
.cp .btn.ghost:hover { background: #ffffff1f; }
.cp .actions { display: flex; flex-wrap: wrap; gap: 12px; margin: 24px 0 16px; }
.cp .center .actions { justify-content: center; }

.cp .nav { position: sticky; top: 0; z-index: 10; background: #fff; border-bottom: 1px solid var(--line); }
.cp .nav-row { display: flex; align-items: center; justify-content: space-between; min-height: 68px; flex-wrap: wrap; }
.cp .logo { font-size: 1.3rem; font-weight: 600; color: var(--teal); text-decoration: none; margin: 0; }
.cp .links { display: flex; align-items: center; gap: 24px; }
.cp .links a:not(.btn) { color: var(--ink); text-decoration: none; }
.cp .links a:not(.btn):hover { color: var(--teal); text-decoration: underline; }
.cp .menu-btn { display: none; font: inherit; padding: 6px 14px; background: none; border: 1px solid var(--line); border-radius: 8px; color: var(--ink); }

.cp .hero { background: var(--mist); padding-block: 72px; margin-bottom: 56px; }
.cp .hero-grid, .cp .feature { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: center; }
.cp .photo, .cp .video, .cp .feed { display: grid; place-items: center; text-align: center; padding: 16px; border-radius: 16px; }
.cp .photo { aspect-ratio: 4 / 3; border: 2px dashed #94b9b9; color: var(--muted); background: #fff; }

.cp .carousel { position: relative; aspect-ratio: 1 / 1; overflow: hidden; border-radius: 16px; background: #fff; }
.cp .slide { position: absolute; inset: 0; transition: transform .6s ease; display: grid; place-items: center; padding: 16px; text-align: center; color: var(--muted); }
.cp .slide.jump { transition: none; }
.cp .slide img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; }
.cp .carousel button { border: 0; cursor: pointer; }
.cp .arrow { z-index: 1; position: absolute; top: 50%; transform: translateY(-50%); width: 40px; height: 40px; border-radius: 50%; background: #ffffffe6; color: var(--deep); font-size: 26px; line-height: 1; box-shadow: 0 1px 6px #0003; }
.cp .arrow.prev { left: 12px; }
.cp .arrow.next { right: 12px; }
.cp .dots { z-index: 1; position: absolute; bottom: 12px; left: 50%; transform: translateX(-50%); display: flex; gap: 8px; padding: 6px 10px; border-radius: 20px; background: #ffffffe6; }
.cp .dots button { width: 10px; height: 10px; padding: 0; border-radius: 50%; background: #94b9b9; }
.cp .dots button[aria-current="true"] { background: var(--teal); }

.cp .feature { background: var(--deep); color: #fff; border-radius: 20px; padding: 48px; }
.cp .video { aspect-ratio: 16 / 9; background: #ffffff1a; }

.cp .cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 28px; }
.cp .card { margin: 0; padding: 24px; border: 1px solid var(--line); border-radius: 14px; display: flex; flex-direction: column; }
.cp .card p { color: var(--muted); }
.cp .card a { margin-top: auto; font-weight: 600; }
.cp .icon { color: var(--teal); margin-bottom: 14px; }

.cp .promos { display: grid; grid-template-columns: 3fr 2fr; gap: 20px; padding-bottom: 72px; }
.cp .promo { background: var(--mist); border-radius: 16px; padding: 24px; display: flex; flex-wrap: wrap; gap: 12px; align-items: center; justify-content: space-between; }
.cp .promo h3 { margin: 0; }
.cp .promo.wide { flex-direction: column; align-items: flex-start; justify-content: center; padding: 40px; }
.cp .stack { display: grid; gap: 20px; }

.cp .band { background: var(--mist); padding-block: 48px; }
.cp .partners { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-top: 24px; }
.cp .partners div { padding: 24px 8px; background: #fff; border-radius: 10px; color: var(--muted); }

.cp .reviews { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: 28px 0; text-align: left; }
.cp blockquote { margin: 0 0 16px; }
.cp figcaption { font-weight: 600; }

.cp .social { background: var(--teal); color: #fff; padding-block: 64px; }
.cp .feed { max-width: 760px; min-height: 260px; margin: 32px auto 0; background: #fff; color: var(--muted); }

.cp footer { padding-block: 48px 24px; }
.cp .foot { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 32px; }
.cp .foot p { margin-bottom: 4px; }
.cp footer ul { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(2, auto); gap: 6px 40px; }
.cp .copy { border-top: 1px solid var(--line); margin-top: 32px; padding-top: 16px; color: var(--muted); font-size: .9rem; }

@media (max-width: 860px) {
  .cp .menu-btn { display: block; }
  .cp .links { display: none; width: 100%; flex-direction: column; align-items: flex-start; gap: 14px; padding-block: 12px 18px; }
  .cp .links.open { display: flex; }
  .cp .hero-grid, .cp .feature, .cp .promos { grid-template-columns: 1fr; }
  .cp .feature { padding: 28px; }
  .cp .cards, .cp .reviews { grid-template-columns: repeat(2, 1fr); }
  .cp .partners { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 560px) {
  .cp .cards, .cp .reviews { grid-template-columns: 1fr; }
}
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  .cp .slide { transition: none; }
}
`;