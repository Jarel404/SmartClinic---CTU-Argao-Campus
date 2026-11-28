/* PICTURES: save pregnant.png, pwd.png and senior.png in src/assets. */
const images = import.meta.glob("../assets/{pregnant,pwd,senior}.png", { eager: true, import: "default" });

const GROUPS = [
  { file: "pregnant", name: "Pregnant Women", color: "#c2255c" },
  { file: "pwd", name: "Persons with Disability (PWD)", color: "#5f3dc4" },
  { file: "senior", name: "Senior Citizens", color: "#b35309" },
];

export default function PriorityLane() {
  return (
    <section className="wrap pl" aria-labelledby="pl-title">
      <style>{css}</style>

      <h2 id="pl-title">We prioritize</h2>

      <div className="pl-grid">
        {GROUPS.map(({ file, name, color }, i) => {
          const src = images[`../assets/${file}.png`];
          return (
            <div className="pl-card" key={file}
              style={{ "--color": color, "--delay": `${i * 0.6}s` }}>
              <span className="pl-badge" aria-hidden="true">&#9733;</span>
              <div className="pl-photo">
                {src ? <img src={src} alt="" /> : <span>Add {file}.png</span>}
              </div>
              <p>{name}</p>
            </div>
          );
        })}
      </div>

      <p className="pl-proceed">
        Please proceed inside
        <span className="pl-arrows" aria-hidden="true"><i /><i /><i /></span>
      </p>
    </section>
  );
}

const css = `
/* Clears the old yellow box if it still wraps this section */
.lp .priority { display: block; margin: 0 auto; padding: 0; background: none; border: 0; }
.lp .services { padding-block: 24px 40px; }
.lp .pl { max-width: 700px; margin-top: 20px; padding: 0; text-align: center; }
.lp .pl h2 { margin: 0 0 18px; font-size: clamp(1.4rem, 3vw, 1.8rem); font-weight: 700; }
.lp .pl h2 {
  width: fit-content;
  margin-inline: auto;
  background: linear-gradient(90deg, #c2255c, #5f3dc4, #b35309, #c2255c);
  background-size: 200% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: pl-title 5s linear infinite;
}
@keyframes pl-title { to { background-position: 200% 0; } }
@media (prefers-reduced-motion: reduce) { .lp .pl h2 { animation: none; } }
.lp .pl-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 26px; }
.lp .pl-card { position: relative; display: flex; flex-direction: column; animation: pl-float 3.6s ease-in-out var(--delay) infinite; }
.lp .pl-photo { aspect-ratio: 1 / 1; overflow: hidden; display: grid; place-items: center; border: 1px solid var(--color); border-radius: 999px 999px 14px 14px; color: var(--color); font-weight: 600; }
.lp .pl-photo img { display: block; width: 100%; height: 100%; object-fit: cover; transition: transform .5s ease; }
.lp .pl-card:hover img { transform: scale(1.12); }
.lp .pl-badge { position: absolute; z-index: 1; top: 4px; right: 4px; width: 38px; height: 38px; display: grid; place-items: center; border: 3px solid #fff; border-radius: 50%; background: #ffc933; color: #5c3b00; font-size: 18px; animation: pl-pop 1.8s ease-in-out var(--delay) infinite; }
.lp .pl-card p { flex: 1; display: grid; place-items: center; margin: 8px 0 0; padding: 6px 10px; border: 1px solid var(--color); border-radius: 10px; color: var(--color); font-size: .85rem; font-weight: 600; line-height: 1.35; }
.lp .pl p.pl-proceed { display: inline-flex; align-items: center; gap: 14px; margin: 16px 0 0; padding: 9px 24px; background: #0c2d57; color: #fff; border-radius: 40px; font-size: .9rem; font-weight: 600; }
.lp .pl-arrows { display: inline-flex; gap: 4px; }
.lp .pl-arrows i { width: 10px; height: 10px; border-top: 3px solid #ffc933; border-right: 3px solid #ffc933; transform: rotate(45deg); animation: pl-go 1.2s ease-in-out infinite; }
.lp .pl-arrows i:nth-child(2) { animation-delay: .2s; }
.lp .pl-arrows i:nth-child(3) { animation-delay: .4s; }
@keyframes pl-float { 0%, 100% { translate: 0 0; } 50% { translate: 0 -12px; } }
@keyframes pl-pop { 0%, 100% { scale: 1; rotate: 0deg; } 50% { scale: 1.2; rotate: 20deg; } }
@keyframes pl-go { 0%, 100% { opacity: .2; translate: -3px 0; } 50% { opacity: 1; translate: 3px 0; } }
@media (max-width: 640px) {
  .lp .pl-grid { gap: 8px; }
  .lp .pl-photo { font-size: .65rem; }
  .lp .pl-badge { width: 26px; height: 26px; border-width: 2px; font-size: 12px; }
  .lp .pl-card p { padding: 6px 3px; font-size: .68rem; }
}
@media (prefers-reduced-motion: reduce) {
  .lp .pl-card, .lp .pl-badge, .lp .pl-arrows i { animation: none; }
  .lp .pl-photo img { transition: none; }
}
`;