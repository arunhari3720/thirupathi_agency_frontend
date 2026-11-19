import { Fragment, useEffect, useRef, useState } from 'react';
import './landing.css';
import SiteHeader from './siterheader.jsx';

/* -------------------- DATA -------------------- */
const P = [
  { b: 'RKG', n: 'Agmark Cow Ghee', cat: 'Ghee & Dairy', s: '100ml – 2L', c: '#FFD44D', img: 'https://res.cloudinary.com/gtqzljit/image/upload/v1794284819/cow_ghee_jar.webp' },
  { b: 'Arusuvai', n: 'Sambar Powder', cat: 'Masalas', s: '50g – 500g', c: '#7BF0A8', img: 'https://res.cloudinary.com/gtqzljit/image/upload/v1794287477/Fennel-pic2-removebg-preview.png' },
  { b: 'MUGI', n: 'Ultra Liquid Detergent', cat: 'Home Care', s: '2L / 5L', c: '#6FA0FF', img: 'https://res.cloudinary.com/gtqzljit/image/upload/v1794288558/21-removebg-preview.png' },
  { b: 'MAS', n: 'Badam Drink Mix', cat: 'Beverage Mixes', s: '200g', c: '#FF9AD5', img: 'https://res.cloudinary.com/gtqzljit/image/upload/v1790737084/badam-mix-200g-pack.jpg' },
  { b: "Koya's", n: 'Chandan Sandalwood Agarbatti', cat: 'Agarbatti', s: '10 / 45 sticks', c: '#FFB16B', img: 'https://res.cloudinary.com/gtqzljit/image/upload/v1794287466/8-removebg-preview.png' },
  { b: '123', n: '1 Minute Noodles', cat: 'Noodles & Snacks', s: '25g packs', c: '#FF6B5B', img: 'https://res.cloudinary.com/gtqzljit/image/upload/v1794287454/29-removebg-preview.png' },
  { b: 'MAS', n: 'RoseMilk', cat: 'General Trade', s: 'Selected SKUs', c: '#B9A4FF', img: 'https://res.cloudinary.com/gtqzljit/image/upload/v1794288349/23__1_-removebg-preview.png' },
];

const GROUPS = [
  { t: 'Pantry & kitchen', d: 'Masalas, drink mixes and noodles that sit at the front of the shelf and move every week.', i: [1, 3, 5] },
  { t: 'Ghee & dairy', d: 'Agmark-certified cow ghee in jars from 100ml to 2 litres, for households and sweet shops alike.', i: [0] },
  { t: 'Home & everyday', d: 'Liquid detergent, incense and general trade lines that round out a retailer’s counter.', i: [2, 4, 6] },
];
const CHIPS = ['Pantry', 'Ghee & dairy', 'Home & everyday'];
const REASONS = [
  ['Genuine brand portfolio', 'Established consumer brands across food, home care and everyday essentials.', '#D2E823', '#111114', 'Genuine'],
  ['Multi-category supply', 'Ghee, masalas, drink mixes, detergent, incense and more from a single agency.', '#FF9AD5', '#111114', 'Multi'],
  ['Trade-first communication', 'Clear catalogue, direct contact and a simple bulk enquiry flow.', '#2D5BFF', '#fff', 'Trade'],
  ['Regional reach', 'Built around Madurai and the markets nearby, so supply stays close.', '#7BF0A8', '#111114', 'Madurai'],
  ['Consistent presentation', 'A clean, modern look that makes a traditional distribution business easy to trust.', '#6A4DFF', '#fff', 'Clean'],
  ['Long-term relationships', 'Made for repeat retail and business customers rather than one-off checkout.', '#111114', '#D2E823', 'Repeat'],
];
const ZOOM = [
  [0, 0, 24, 30, 5], [-30, -28, 30, 30, 6], [28, -26, 20, 42, 7], [-31, 2, 18, 26, 6],
  [30, 24, 28, 26, 7], [-12, 30, 22, 24, 8], [10, -34, 16, 22, 9],
];
const S0 = [[-.36, -.28, -14], [.34, -.32, 10], [-.41, .12, 8], [.41, .08, -9], [-.2, .4, -6], [.22, .42, 12], [.03, -.46, 4]];
const S1 = [[-.4, -.3, -14], [.38, -.34, 10], [-.46, .3, 8], [.46, .26, -9], [-.2, .45, -6], [.24, .46, 12], [.03, -.46, 4]];
const SAY = 'Good distribution is not just movement of products. It is the quiet system behind availability, trust and repeat business.';
const WORDS = SAY.split(' ');
const HL = /^(availability,|trust|repeat|business\.)$/;
const APP_ITEMS = P.concat(P.slice(0, 1)).slice(0, 8);

/* -------------------- HELPERS -------------------- */
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const prog = (el) => {
  const r = el.getBoundingClientRect();
  return clamp(-r.top / Math.max(1, r.height - window.innerHeight));
};

/* -------------------- SMALL COMPONENTS -------------------- */
function Tile({ p, tag = true }) {
  const [ok, setOk] = useState(false);
  const [bad, setBad] = useState(false);

  return (
    <div className={`pc${ok ? ' ok' : ''}`} style={{ '--c': p.c }}>
      {tag && <span className="tag">{p.b}</span>}
      <span className="fb">{p.b}</span>
      {!bad && (
        <img
          src={p.img}
          alt={`${p.b} ${p.n}`}
          loading="lazy"
          referrerPolicy="no-referrer"
          onLoad={() => setOk(true)}
          onError={() => setBad(true)}
        />
      )}
    </div>
  );
}









function HeroSection({ heroEl, heroStage, heroCopy, heroSub, heroHint }) {
  return (
    <section className="pin" id="hero" ref={heroEl}>
      <div className="stage" ref={heroStage}>
        {P.map((p) => <div className="hc" key={p.b}><Tile p={p} /></div>)}
        <div className="hero-copy" ref={heroCopy}>
          <p className="eyebrow">Authorised distributor · Madurai</p>
          <h1>Trusted brands.<span>Reliable supply.</span></h1>
          <p ref={heroSub}>Ghee, masalas, drink mixes, home care and incense from seven brands, delivered to retailers and businesses across Madurai.</p>
        </div>
        <p className="hero-hint eyebrow" ref={heroHint}>Scroll ↓</p>
      </div>
    </section>
  );
}

function BrandMarquee({ marq }) {
  return (
    <div className="marq" aria-hidden="true">
      <div ref={marq}>{[0, 1].flatMap((k) => P.map((p) => <span key={`${k}-${p.b}`}>{p.b}</span>))}</div>
    </div>
  );
}

function WhatWeDoSection({ blocksEl, bAct }) {
  return (
    <section id="what" className="g">
      <div className="in">
        <div className="left">
          <p className="eyebrow">What we do</p>
          <h2>One agency. Many trusted shelves.</h2>
          <ul className="chips">
            {CHIPS.map((c, i) => <li key={c} className={i === bAct ? 'on' : ''}>{c}</li>)}
          </ul>
        </div>
        <div className="right" ref={blocksEl}>
          {GROUPS.map((g, gi) => (
            <article className={`blk${gi === bAct ? ' on' : ''}`} key={g.t}>
              <h3>{g.t}</h3>
              <p>{g.d}</p>
              <div className="minis">{g.i.map((i) => <Tile p={P[i]} key={P[i].b} />)}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function BrandWheelSection({ wheelSec, wheelEl, wAct }) {
  return (
    <section className="pin" id="wheel" ref={wheelSec}>
      <div className="stage">
        <div className="top">
          <p className="eyebrow">Our brands</p>
          <h2>{P[wAct].b}</h2>
          <p>{`${P[wAct].n} · ${P[wAct].s}`}</p>
        </div>
        <div className="wheel" ref={wheelEl}>
          {P.map((p) => <div className="it" key={p.b}><Tile p={p} tag={false} /></div>)}
        </div>
      </div>
    </section>
  );
}

function HorizontalGallerySection({ hgal, track }) {
  return (
    <section className="pin" id="hgal" ref={hgal}>
      <div className="stage">
        <div className="track" ref={track}>
          <div className="lead" id="brands">
            <p className="eyebrow">The portfolio</p>
            <h2>Seven brands. One delivery.</h2>
            <p>Keep scrolling. Each pack below is available in the sizes shown, for trade and bulk orders.</p>
          </div>
          {P.map((p) => (
            <div className="card" key={p.b}>
              <Tile p={p} />
              <div className="meta"><b>{p.n}</b><span>{p.cat}<br />{p.s}</span></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CatalogueSection({ cont, contH, appEl }) {
  return (
    <section className="pin" id="cont" ref={cont}>
      <div className="stage g">
        <h2 ref={contH}>Your trade catalogue, <span>one scroll away.</span></h2>
        <div className="persp">
          <div className="app" ref={appEl}>
            <div className="bar"><i></i><i></i><i></i><em>thirupathi-agency / catalogue</em></div>
            <div className="body">
              <div className="fil">
                <span>All</span><span>Ghee &amp; Dairy</span><span>Masalas</span>
                <span>Home Care</span><span>Beverage Mixes</span><span>Agarbatti</span>
              </div>
              <div className="grid">{APP_ITEMS.map((p, i) => <Tile p={p} key={`${p.b}-${i}`} />)}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ZoomSection({ zoomSec, zoomStage, zoomEnd }) {
  return (
    <section className="pin" id="zoom" ref={zoomSec}>
      <div className="stage" ref={zoomStage}>
        {ZOOM.map((z, i) => (
          <div className="zi" key={i} style={{ width: `${z[2]}vw`, height: `${z[3]}vh` }}>
            <Tile p={P[i % P.length]} tag={false} />
          </div>
        ))}
        <p className="cap eyebrow">From one shelf to every shelf</p>
        <div className="end" ref={zoomEnd}><h2>Every shelf.<br />Every day.</h2></div>
      </div>
    </section>
  );
}

function WhyUsSection({ stackEl }) {
  return (
    <section id="why" className="g">
      <div className="hd">
        <p className="eyebrow">Why choose us</p>
        <h2>Why partners choose to stay.</h2>
      </div>
      <div className="stack" ref={stackEl}>
        {REASONS.map((r, i) => (
          <article className="sc" key={r[0]} style={{ '--i': i, '--bg': r[2], '--fg': r[3] }}>
            <p className="eyebrow">Reason {i + 1} of {REASONS.length}</p>
            <div><h3>{r[0]}</h3></div>
            <p>{r[1]}</p>
            <span className="big" aria-hidden="true">{r[4]}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

function StorySection({ saySec, lit }) {
  return (
    <section className="pin" id="say" ref={saySec}>
      <div className="stage g">
        <p aria-label={SAY}>
          {WORDS.map((w, i) => {
            const cls = [HL.test(w) ? 'hl' : '', i < lit ? 'on' : ''].filter(Boolean).join(' ');
            return <Fragment key={i}>{i > 0 && ' '}<span className={cls || undefined}>{w}</span></Fragment>;
          })}
          <small className="eyebrow by">Thirupathi Agency</small>
        </p>
      </div>
    </section>
  );
}

function ContactSection({ onSubmit, note }) {
  return (
    <section id="contact" className="g">
      <div className="in">
        <div className="info">
          <p className="eyebrow">Contact</p>
          <h2>Let’s build the next supply line.</h2>
          <dl>
            <div><dt>Phone</dt><dd><a href="tel:+919876543210">+91 98765 43210</a></dd></div>
            <div><dt>Email</dt><dd><a href="mailto:thirupathiagency@gmail.com">thirupathiagency@gmail.com</a></dd></div>
            <div><dt>Service area</dt><dd>Madurai &amp; surrounding markets, Tamil Nadu</dd></div>
            <div><dt>Hours</dt><dd>Mon – Sat · 9:00 AM – 7:00 PM</dd></div>
          </dl>
        </div>
        <form onSubmit={onSubmit} noValidate>
          <div className="row">
            <label htmlFor="fn">Name<input id="fn" name="name" required placeholder="Your name" /></label>
            <label htmlFor="fp">Phone<input id="fp" name="phone" required placeholder="Mobile number" inputMode="tel" /></label>
          </div>
          <label htmlFor="fe">Email<input id="fe" name="email" type="email" placeholder="you@example.com" /></label>
          <label htmlFor="fr">Requirement
            <select id="fr" name="requirement">
              <option>Retail / trade enquiry</option><option>Bulk order</option>
              <option>Product catalogue</option><option>Distribution enquiry</option>
            </select>
          </label>
          <label htmlFor="fm">Message<textarea id="fm" name="message" rows={4} placeholder="Tell us what you need" /></label>
          <button className="btn" type="submit">Send enquiry ↗</button>
          <p className="note" role="status">{note}</p>
        </form>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="g">
      <div className="in">
        <span>© Thirupathi Agency, Madurai</span>
        <span>RKG · Arusuvai · MUGI · MAS · Koya’s · 123 · ARASHI</span>
      </div>
    </footer>
  );
}

/* -------------------- MAIN LANDING PAGE -------------------- */
export default function Landing() {
  const heroEl = useRef(null);
  const heroStage = useRef(null);
  const heroCopy = useRef(null);
  const heroSub = useRef(null);
  const heroHint = useRef(null);
  const marq = useRef(null);
  const blocksEl = useRef(null);
  const wheelSec = useRef(null);
  const wheelEl = useRef(null);
  const hgal = useRef(null);
  const track = useRef(null);
  const cont = useRef(null);
  const appEl = useRef(null);
  const contH = useRef(null);
  const zoomSec = useRef(null);
  const zoomStage = useRef(null);
  const zoomEnd = useRef(null);
  const stackEl = useRef(null);
  const saySec = useRef(null);

  const [bAct, setBAct] = useState(0);
  const [wAct, setWAct] = useState(0);
  const [lit, setLit] = useState(0);
  const [note, setNote] = useState('');

  /* Scroll animation controller */
  useEffect(() => {
    const hcs = [...heroStage.current.querySelectorAll('.hc')];
    const blks = [...blocksEl.current.querySelectorAll('.blk')];
    const wits = [...wheelEl.current.querySelectorAll('.it')];
    const zis = [...zoomStage.current.querySelectorAll('.zi')];
    const scs = [...stackEl.current.querySelectorAll('.sc')];
    let raf = 0;
    let previousBAct = -1;
    let previousWAct = -1;
    let previousLit = -1;

    function frame() {
      const W = window.innerWidth;
      const H = window.innerHeight;

      // Hero product-card morph
      const hp = prog(heroEl.current);
      const q = ease(clamp(hp / 0.75));
      const sw = heroStage.current.clientWidth;
      const sh = heroStage.current.clientHeight;
      const spread = Math.min(sw * 0.42, 560);
      const S = sw < 700 ? S1 : S0;
      hcs.forEach((c, i) => {
        const s = S[i];
        const t = (i - 3) / 3;
        const x = lerp(s[0] * sw, t * spread, q);
        const y = lerp(s[1] * sh, sh * 0.22 + t * t * sh * 0.05, q);
        const r = lerp(s[2], t * 9, q);
        c.style.transform = `translate(-50%,-50%) translate(${x}px,${y}px) rotate(${r}deg)`;
        c.style.zIndex = 5 + (3 - Math.abs(i - 3));
      });
      heroCopy.current.style.transform = `translateY(-50%) translateY(${-q * sh * 0.2}px) scale(${1 - 0.28 * q})`;
      heroSub.current.style.opacity = 1 - clamp(q * 1.6);
      heroHint.current.style.opacity = 1 - clamp(hp * 8);

      // Brand marquee
      const mw = marq.current.scrollWidth / 2;
      if (mw > 0) marq.current.style.transform = `translateX(${-((window.scrollY * 0.7) % mw)}px)`;

      // Sticky content groups
      let best = 0;
      let bd = 1e9;
      blks.forEach((b, i) => {
        const r = b.getBoundingClientRect();
        const d = Math.abs(r.top + r.height / 2 - H * 0.5);
        if (d < bd) { bd = d; best = i; }
      });
      if (best !== previousBAct) { previousBAct = best; setBAct(best); }

      // Circular brand wheel
      const wp = prog(wheelSec.current);
      const n = P.length;
      const step = 360 / n;
      const rot = -wp * (n - 1) * step;
      wheelEl.current.style.transform = `rotate(${rot}deg)`;
      const D = wheelEl.current.clientWidth;
      const rad = D / 2 - D * 0.17;
      const ai = Math.round(wp * (n - 1));
      wits.forEach((it, i) => {
        const a = ((i * step - 90) * Math.PI) / 180;
        const x = Math.cos(a) * rad;
        const y = Math.sin(a) * rad;
        const act = i === ai;
        it.style.transform = `translate(-50%,-50%) translate(${x}px,${y}px) rotate(${-rot}deg) scale(${act ? 1.18 : 0.9})`;
        it.style.zIndex = act ? 5 : 1;
      });
      if (ai !== previousWAct) { previousWAct = ai; setWAct(ai); }

      // Horizontal product gallery
      const hpg = prog(hgal.current);
      const dist = Math.max(0, track.current.scrollWidth - W);
      track.current.style.transform = `translateX(${-hpg * dist}px)`;

      // 3D catalogue animation
      const cp = prog(cont.current);
      const ce = ease(clamp(cp / 0.7));
      appEl.current.style.transform = `rotateX(${22 * (1 - ce)}deg) scale(${lerp(0.88, 1, ce)})`;
      contH.current.style.transform = `translateY(${-cp * 30}px)`;

      // Zoom parallax
      const zp = prog(zoomSec.current);
      zis.forEach((z, i) => {
        const d = ZOOM[i];
        z.style.transform = `translate(-50%,-50%) translate(${(d[0] * W) / 100}px,${(d[1] * H) / 100}px) scale(${lerp(1, d[4], zp)})`;
        z.style.zIndex = i === 0 ? 3 : 2;
      });
      zoomEnd.current.style.opacity = clamp((zp - 0.6) / 0.25);

      // Stacking cards
      scs.forEach((c, i) => {
        const nx = scs[i + 1];
        if (!nx) return;
        const r = nx.getBoundingClientRect();
        const c0 = c.getBoundingClientRect();
        const o = clamp(1 - (r.top - c0.top) / c0.height);
        c.style.transform = `scale(${1 - o * 0.05})`;
      });

      // Word-by-word text reveal
      const sp = prog(saySec.current);
      const nextLit = Math.round(clamp(sp / 0.8) * WORDS.length);
      if (nextLit !== previousLit) { previousLit = nextLit; setLit(nextLit); }
    }

    const req = () => {
      if (!raf) raf = requestAnimationFrame(() => { raf = 0; frame(); });
    };
    const onLoad = () => { frame(); setTimeout(frame, 300); };

    window.addEventListener('scroll', req, { passive: true });
    window.addEventListener('resize', req);
    window.addEventListener('load', onLoad);
    frame();
    const timeoutId = setTimeout(frame, 300);

    return () => {
      window.removeEventListener('scroll', req);
      window.removeEventListener('resize', req);
      window.removeEventListener('load', onLoad);
      cancelAnimationFrame(raf);
      clearTimeout(timeoutId);
    };
  }, []);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const hasRequiredFields = String(formData.get('name') || '').trim() && String(formData.get('phone') || '').trim();
    setNote(
      hasRequiredFields
        ? 'Thanks. This preview form is not connected to email yet, so nothing was sent. Please call or email using the details here.'
        : 'Please add your name and phone number.'
    );
  };

  return (
    <>
      <SiteHeader />
      <main>
        <HeroSection heroEl={heroEl} heroStage={heroStage} heroCopy={heroCopy} heroSub={heroSub} heroHint={heroHint} />
        <BrandMarquee marq={marq} />
        <WhatWeDoSection blocksEl={blocksEl} bAct={bAct} />
        <BrandWheelSection wheelSec={wheelSec} wheelEl={wheelEl} wAct={wAct} />
        <HorizontalGallerySection hgal={hgal} track={track} />
        <CatalogueSection cont={cont} contH={contH} appEl={appEl} />
        <ZoomSection zoomSec={zoomSec} zoomStage={zoomStage} zoomEnd={zoomEnd} />
        <WhyUsSection stackEl={stackEl} />
        <StorySection saySec={saySec} lit={lit} />
        <ContactSection onSubmit={handleContactSubmit} note={note} />
      </main>
      <SiteFooter />
    </>
  );
}
