/* LOGOS: save ctu.png, asean.png and tuv.png in src/assets. */
const logos = import.meta.glob("../assets/{ctu,asean,tuv}.png", { eager: true, import: "default" });

function Logo({ file, alt }) {
  const src = logos[`../assets/${file}.png`];
  return src
    ? <img className={`cf-${file}`} src={src} alt={alt} />
    : <span className="cf-missing">{file}.png</span>;
}

export default function CampusFooter() {
  return (
    <footer id="contact" className="cf">
      <style>{css}</style>
      <div className="cf-row">
        <div className="cf-left">
          <Logo file="ctu" alt="Cebu Technological University seal" />
          <Logo file="asean" alt="ASEAN logo" />
        </div>

        <address className="cf-text">
          <p className="cf-republic">Republic of the Philippines</p>
          <p className="cf-name">CEBU TECHNOLOGICAL UNIVERSITY</p>
          <p className="cf-campus">ARGAO CAMPUS</p>
          <p>Ed Kintanar Street Lamacan, Argao, Cebu, Philippines</p>
          <p className="cf-line">
            <span>Website: <a href="http://www.argao.ctu.edu.ph" target="_blank" rel="noreferrer">http://www.argao.ctu.edu.ph</a></span>
            <span>Email: <a href="mailto:ctu.argao@yahoo.com">ctu.argao@yahoo.com</a></span>
          </p>
          <p className="cf-line">
            <span>Phone No.: (032) 485-8290 / 485-1109 loc 1702</span>
            <span>Fax No.: (032) 485-8290</span>
          </p>
        </address>

        <div className="cf-right">
          <Logo file="tuv" alt="TÜV Rheinland certified" />
          <p className="cf-cert">
            <span>Management<br />System<br />ISO 9001:2015</span>
            <small>www.tuv.com<br />ID 9108652629</small>
          </p>
        </div>
      </div>
    </footer>
  );
}

const css = `
.lp footer.cf { padding: 24px 16px; background: #fff; color: #333; border-top: 1px solid #dde6f1; font-family: Arial, Helvetica, sans-serif; }
.lp .cf-row { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; grid-template-areas: "left text right"; align-items: center; gap: 24px; max-width: 1100px; margin: 0 auto; }
.lp .cf-left { grid-area: left; display: flex; align-items: center; gap: 12px; }
.lp .cf-right { grid-area: right; display: flex; align-items: center; gap: 10px; }
.lp .cf-cert { display: flex; flex-direction: column; gap: 10px; margin: 0; font-size: .8rem; line-height: 1.35; white-space: nowrap; }
.lp .cf-cert small { font-size: .68rem; }
.lp .cf img { display: block; width: auto; object-fit: contain; }
.lp .cf-ctu, .lp .cf-asean { height: 92px; }
.lp .cf-tuv { height: 84px; max-width: 190px; }
.lp .cf-missing { width: 84px; height: 84px; display: grid; place-items: center; border: 1px dashed #99a6b5; border-radius: 50%; color: #55606e; font-size: .72rem; }
.lp .cf-text { grid-area: text; text-align: center; font-style: normal; font-size: .85rem; line-height: 1.5; }
.lp .cf-text p { margin: 0; }
.lp .cf-text .cf-republic { font-size: 1rem; }
.lp .cf-text .cf-name { font-size: clamp(1.05rem, 2.2vw, 1.4rem); font-weight: 700; line-height: 1.3; }
.lp .cf-text .cf-campus { font-size: 1.1rem; }
.lp .cf-text .cf-line { display: flex; flex-wrap: wrap; justify-content: center; column-gap: 24px; }
.lp footer.cf a { color: #1a55a8; overflow-wrap: anywhere; }
@media (max-width: 820px) {
  .lp .cf-row { grid-template-columns: auto auto; grid-template-areas: "left right" "text text"; justify-content: center; gap: 16px; }
  .lp .cf-ctu, .lp .cf-asean { height: 64px; }
  .lp .cf-tuv { height: 60px; max-width: 130px; }
  .lp .cf-missing { width: 60px; height: 60px; font-size: .6rem; }
}
`;  