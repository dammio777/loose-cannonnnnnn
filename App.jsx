import { useEffect, useRef, useState } from 'react';

const LOGO_LOCAL = '/logo.png';
const LOGO_CDN =
  'https://cdn.abacus.ai/images/e7600576-4c09-4f4e-98d4-ae393993616d.png';
const IG = 'https://www.instagram.com/loosecannoncafe/';
const MAP =
  'https://www.google.com/maps/search/?api=1&query=Loose%20Cannon%20Cafe%202527%20Canada%20Blvd%20Glendale%20CA';

const MENU = {
  Coffee: [
    {
      name: 'Marlowe',
      note: 'Iced cortado · salted maple cold foam',
      tag: 'Signature',
    },
    { name: 'Espresso', note: 'The coffee classic', tag: 'Classic' },
    { name: 'Cortado', note: 'Coffee & milk', tag: 'Classic' },
    { name: 'Flat White', note: 'Coffee & milk', tag: 'Classic' },
    { name: 'Cappuccino', note: 'Coffee & milk', tag: 'Classic' },
    { name: 'Cold Brew', note: 'Served cold', tag: 'Classic' },
  ],
  Matcha: [
    {
      name: 'Matcha Marlowe',
      note: 'From the matcha selection',
      tag: 'Matcha',
    },
    { name: 'Matcha Latte', note: 'From the matcha selection', tag: 'Matcha' },
    {
      name: 'Matcha Americano',
      note: 'From the matcha selection',
      tag: 'Matcha',
    },
  ],
  Breakfast: [
    {
      name: 'Breakfast Sandwich',
      note: 'From the breakfast selection',
      tag: 'Breakfast',
    },
    { name: 'Eggs and Avo', note: 'From the breakfast selection', tag: 'Breakfast' },
    { name: 'Yogurt Bowl', note: 'From the breakfast selection', tag: 'Breakfast' },
  ],
  Lunch: [
    {
      name: 'Chef’s Tuna Melt',
      note: 'From the lunch selection',
      tag: 'Lunch',
    },
    { name: 'Grilled Cheese', note: 'From the lunch selection', tag: 'Lunch' },
    { name: 'Buddha Bowl', note: 'From the lunch selection', tag: 'Lunch' },
  ],
};

function Arrow({ diagonal = false }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d={diagonal ? 'M6 18 18 6M6 6h12v12' : 'M4 12h15m-6-6 6 6-6 6'}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function App() {
  const [mobile, setMobile] = useState(false);
  const [category, setCategory] = useState('Coffee');
  const [selected, setSelected] = useState(null);
  const [copied, setCopied] = useState(false);
  const [logoSrc, setLogoSrc] = useState(LOGO_LOCAL);

  const root = useRef(null);
  const hero = useRef(null);
  const progress = useRef(null);
  const close = useRef(null);
  const lastFocus = useRef(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const nodes = root.current.querySelectorAll('[data-reveal]');

    if (reduced) {
      nodes.forEach((n) => n.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            observer.unobserve(e.target);
          }
        }),
      { threshold: 0.12 }
    );

    nodes.forEach((n) => observer.observe(n));

    let raf;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const range = document.documentElement.scrollHeight - window.innerHeight;
        progress.current.style.transform = `scaleX(${range ? window.scrollY / range : 0})`;
        if (hero.current) {
          hero.current.style.transform = `translateY(${Math.min(
            window.scrollY * 0.12,
            90
          )}px) rotate(${Math.min(window.scrollY * 0.003, 2)}deg)`;
        }
      });
    };

    window.addEventListener('scroll', update, { passive: true });
    update();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', update);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    if (!selected && !mobile) return;
    const old = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    if (selected) close.current?.focus();

    const handler = (e) => {
      if (e.key === 'Escape') {
        setSelected(null);
        setMobile(false);
      }
      if (e.key === 'Tab' && selected) {
        const controls = root.current.querySelectorAll('.dialog a,.dialog button');
        const first = controls[0];
        const last = controls[controls.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handler);
    return () => {
      document.body.style.overflow = old;
      document.removeEventListener('keydown', handler);
      if (selected) lastFocus.current?.focus();
    };
  }, [selected, mobile]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText('2527 Cañada Blvd, Glendale, CA 91208');
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (error) {
      window.prompt('Copy our address', '2527 Cañada Blvd, Glendale, CA 91208');
    }
  };

  const openItem = (item, e) => {
    lastFocus.current = e.currentTarget;
    setSelected(item);
  };

  const handleLogoError = (e) => {
    if (e.currentTarget.src !== LOGO_CDN) {
      setLogoSrc(LOGO_CDN);
    }
  };

  return (
    <div ref={root} className="font-inter site">
      <style>{`
      :root{--cream:#f3f0e4;--wine:#803638;--ink:#302c27;--line:rgba(48,44,39,.22)}*{box-sizing:border-box}html{scroll-behavior:smooth;scroll-padding-top:100px}body{margin:0}.font-inter{font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,sans-serif}.site{background:var(--cream);color:var(--ink);overflow:hidden}h1,h2,h3,p{margin:0}h1,h2,h3{color:inherit;text-wrap:balance}p{text-wrap:pretty}button,a{-webkit-tap-highlight-color:transparent}a{color:inherit;text-decoration:none}button{font:inherit;cursor:pointer;color:inherit}a:focus-visible,button:focus-visible{outline:2px solid var(--wine);outline-offset:6px}button{border:0;background:none}.wrap{max-width:1440px;margin:auto;padding:0 5vw}.label{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.16em;line-height:1.6}.nav{height:88px;display:flex;align-items:center;justify-content:space-between;gap:24px;border-bottom:1px solid var(--line)}.brand{font-size:19px;letter-spacing:-.06em;font-weight:800;line-height:.9}.brand small{font-size:9px;letter-spacing:.18em;display:block;margin-top:8px}.navlinks{display:flex;align-items:center;gap:32px;font-size:12px}.navlinks a:not(.btn):hover,.textlink:hover{color:var(--wine)}.btn{display:inline-flex;align-items:center;justify-content:center;gap:24px;padding:17px 25px;border:1px solid var(--wine);background:var(--wine);color:var(--cream);font-size:12px;font-weight:500;border-radius:3px;transition:background .2s,color .2s}.btn:hover{background:var(--cream);color:var(--wine)}.btn.outline{background:transparent;color:var(--wine)}.btn.outline:hover{background:var(--wine);color:var(--cream)}.textlink{display:inline-flex;align-items:center;gap:12px;font-size:12px;transition:color .2s}.hero{min-height:760px;min-height:calc(100svh - 88px);position:relative;padding-top:58px;padding-bottom:30px;display:flex;flex-direction:column}.hero-top{display:flex;justify-content:space-between;gap:20px}.hero-main{display:grid;grid-template-columns:1.15fr 1fr;align-items:center;flex:1;position:relative;padding:25px 0 35px}.hero h1{font-family:Fraunces,Georgia,serif;font-weight:500;font-size:clamp(76px,10.6vw,156px);letter-spacing:-.075em;line-height:.88;position:relative;z-index:2}.hero h1 em{color:var(--wine);font-weight:400}.hero-art{width:100%;max-width:530px;justify-self:end;will-change:transform}.hero-art img{width:100%;display:block;mix-blend-mode:multiply}.hero-bottom{display:grid;grid-template-columns:1.15fr 1fr;gap:30px;align-items:end}.hero-description{max-width:340px;font-size:15px;line-height:1.8}.hero-actions{display:flex;gap:28px;align-items:center;justify-content:flex-end}.hero-index{margin-top:44px;display:flex;justify-content:space-between;border-top:1px solid var(--line);padding-top:20px}.chapter{display:grid;grid-template-columns:1fr 2.1fr;gap:40px}.section{padding-top:110px;padding-bottom:110px}.section h2{font-family:Fraunces,Georgia,serif;font-weight:400;font-size:clamp(42px,5.6vw,80px);line-height:1.05;letter-spacing:-.055em}.intro{border-top:1px solid var(--line)}.intro .body{max-width:470px;margin:30px 0;font-size:16px;line-height:1.9}.intro .facts{display:flex;gap:45px;border-top:1px solid var(--line);padding-top:25px}.facts strong{display:block;font-size:30px;font-weight:400;letter-spacing:-.04em;margin-bottom:8px}.menu-band{background:var(--wine);color:var(--cream)}.menu-band a:focus-visible,.menu-band button:focus-visible{outline-color:var(--cream)}.menu-top{display:flex;justify-content:space-between;align-items:end;gap:40px;margin:35px 0 55px}.menu-top p{font-size:14px;line-height:1.8;max-width:270px;color:var(--cream)}.tabs{display:flex;flex-wrap:wrap;border-bottom:1px solid rgba(243,240,228,.3);gap:24px}.tab{padding:18px 0;font-size:12px;border-bottom:2px solid transparent;opacity:.7}.tab.active{opacity:1;border-color:var(--cream)}.tab:hover{opacity:1}.menu-list{min-height:408px}.menu-row{width:100%;text-align:left;border-bottom:1px solid rgba(243,240,228,.25);display:flex;justify-content:space-between;align-items:center;padding:24px 0;gap:20px;transition:padding .2s,background .2s}.menu-row:hover{padding-left:12px;padding-right:12px;background:rgba(243,240,228,.04)}.menu-row h3{font-family:Fraunces,Georgia,serif;font-size:29px;font-weight:400;letter-spacing:-.035em}.menu-row p{font-size:11px;margin-top:7px;opacity:.85}.menu-row .row-end{display:flex;gap:30px;align-items:center}.menu-foot{display:flex;justify-content:space-between;align-items:center;gap:30px;padding-top:30px}.menu-foot p{font-size:11px;line-height:1.8;max-width:420px}.ritual{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center}.ritual-logo{max-width:400px;width:85%;margin:auto;mix-blend-mode:multiply}.ritual p{margin-top:30px;font-size:15px;line-height:1.9;max-width:380px}.ritual h2{margin-top:30px}.ritual .textlink{margin-top:32px}.visit{border-top:1px solid var(--line)}.visit-grid{display:grid;grid-template-columns:1.2fr 1fr;gap:90px;margin-top:40px}.visit h2{font-size:clamp(56px,7vw,100px)}.visit-details{padding-top:8px}.detail{display:flex;justify-content:space-between;align-items:start;gap:25px;border-bottom:1px solid var(--line);padding:24px 0}.detail p{font-size:14px;line-height:1.8;text-align:right}.visit-actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:32px}.address-copy{font-size:11px;text-decoration:underline;text-underline-offset:4px}.footer{background:var(--ink);color:var(--cream);padding:50px 0 25px}.footer a:focus-visible{outline-color:var(--cream)}.footer-top{display:flex;justify-content:space-between;gap:30px;align-items:start}.footer-wordmark{font-family:Fraunces,Georgia,serif;font-size:clamp(52px,10vw,145px);letter-spacing:-.065em;line-height:1.1;margin-top:65px}.footer-bottom{display:flex;justify-content:space-between;gap:20px;border-top:1px solid rgba(243,240,228,.25);padding-top:20px;margin-top:25px}.progress{height:3px;position:fixed;top:0;left:0;right:0;background:var(--wine);transform:scaleX(0);transform-origin:left;z-index:60}.mobile-toggle{display:none}.mobile-panel{position:fixed;inset:88px 0 0;background:var(--cream);z-index:45;padding:40px 6vw;display:flex;flex-direction:column;gap:25px}.mobile-panel>a:not(.btn){font-family:Fraunces,Georgia,serif;font-size:42px;letter-spacing:-.04em}.modal{position:fixed;inset:0;background:rgba(48,44,39,.55);z-index:80;display:flex;align-items:center;justify-content:center;padding:22px}.dialog{position:relative;background:var(--cream);width:100%;max-width:550px;padding:55px 40px;border-radius:3px}.dialog h2{font-family:Fraunces,Georgia,serif;font-size:48px;line-height:1.1;letter-spacing:-.045em;margin:24px 0}.dialog p{font-size:14px;line-height:1.8;margin-bottom:28px}.dialog-close{position:absolute;top:16px;right:16px;padding:8px;font-size:22px}.dialog .btn{width:100%}.dialog .fine{font-size:11px;margin-top:20px;margin-bottom:0}[data-reveal]{opacity:0;transform:translateY(28px);transition:opacity .8s ease,transform .8s cubic-bezier(.2,.7,.2,1)}[data-reveal].visible{opacity:1;transform:translateY(0)}
      @media(min-width:1600px){.hero{min-height:900px}}@media(max-width:900px){.navlinks{gap:18px}.hero{min-height:auto}.hero h1{font-size:clamp(68px,12vw,116px)}.hero-main{padding:65px 0}.hero-actions{gap:18px}.chapter{grid-template-columns:1fr 2fr}.ritual{gap:30px}.visit-grid{gap:40px}.section{padding-top:80px;padding-bottom:80px}}
      @media(max-width:640px){.wrap{padding:0 6vw}.nav{height:76px}.navlinks{display:none}.mobile-toggle{display:flex;align-items:center;gap:12px;font-size:11px}.mobile-panel{top:76px}.hero{padding-top:32px;padding-bottom:25px}.hero-top .label{font-size:9px}.hero-top .location{max-width:115px;text-align:right}.hero-main{grid-template-columns:1fr;padding:43px 0 18px}.hero h1{font-size:clamp(77px,20vw,125px);max-width:100%}.hero-art{width:76%;max-width:360px;margin-top:8px;justify-self:end}.hero-bottom{grid-template-columns:1fr;gap:24px}.hero-description{font-size:14px;max-width:300px}.hero-actions{justify-content:flex-start;gap:22px;flex-wrap:wrap}.hero-index{margin-top:32px}.hero-index .label{font-size:9px}.section{padding-top:64px;padding-bottom:64px}.chapter{grid-template-columns:1fr;gap:28px}.intro .body{font-size:14px}.intro .facts{gap:35px}.menu-top{display:block;margin:30px 0}.menu-top p{margin-top:20px}.tabs{gap:22px}.menu-row h3{font-size:25px}.menu-row .row-end{gap:16px}.menu-row .row-end .label{display:none}.menu-foot{align-items:start;flex-direction:column}.menu-list{min-height:350px}.ritual{grid-template-columns:1fr;gap:35px}.ritual-logo{max-width:280px;width:80%}.ritual h2{margin-top:20px}.visit-grid{grid-template-columns:1fr;gap:15px}.visit-details{padding-top:0}.visit-actions .btn{flex:1}.footer{padding-top:35px}.footer-top{flex-direction:column;gap:25px}.footer-wordmark{margin-top:40px;font-size:17vw}.footer-bottom{flex-wrap:wrap}.dialog{padding:45px 25px}.dialog h2{font-size:38px}}
      @media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}*,*:before,*:after{transition:none!important;animation:none!important}[data-reveal]{opacity:1;transform:none}.hero-art{transform:none!important}.progress{display:none}}
      `}</style>

      <div className="progress" ref={progress} aria-hidden="true" />

      <header className="wrap">
        <nav className="nav" aria-label="Main navigation">
          <a href="#home" className="brand" aria-label="Loose Cannon Cafe home">
            LOOSE CANNON<small>NEIGHBORHOOD CAFE</small>
          </a>
          <div className="navlinks">
            <a href="#about">The cafe</a>
            <a href="#menu">On the menu</a>
            <a href="#visit">Find us</a>
            <a href={IG} target="_blank" rel="noopener noreferrer" className="btn">
              Say hello <Arrow diagonal />
            </a>
          </div>
          <button
            className="mobile-toggle"
            aria-expanded={mobile}
            aria-controls="mobile-menu"
            onClick={() => setMobile(!mobile)}
          >
            {mobile ? 'Close' : 'Menu'}
            <span aria-hidden="true">{mobile ? '×' : '☰'}</span>
          </button>
        </nav>
      </header>

      {mobile && (
        <nav id="mobile-menu" className="mobile-panel" aria-label="Mobile navigation">
          <a href="#about" onClick={() => setMobile(false)}>
            The cafe
          </a>
          <a href="#menu" onClick={() => setMobile(false)}>
            On the menu
          </a>
          <a href="#visit" onClick={() => setMobile(false)}>
            Find us
          </a>
          <a href={IG} target="_blank" rel="noopener noreferrer" className="btn">
            Instagram <Arrow diagonal />
          </a>
        </nav>
      )}

      <main>
        <section id="home" className="hero wrap">
          <div className="hero-top">
            <span className="label">Good coffee. A little character.</span>
            <span className="label location">
              Glendale, California
              <br />7 AM — 4 PM · Every day
            </span>
          </div>
          <div className="hero-main">
            <h1 data-reveal>
              A little
              <br />
              <em>unruly.</em>
              <br />
              Very local.
            </h1>
            <div className="hero-art" ref={hero}>
              <img
                src={logoSrc}
                onError={handleLogoError}
                alt="Loose Cannon Cafe logo: a mischievous monkey hanging from a cafe chair beside a coffee cup"
                fetchPriority="high"
              />
            </div>
          </div>
          <div className="hero-bottom">
            <p className="hero-description" data-reveal>
              Specialty coffee, breakfast & lunch.
              <br />
              Your neighborhood cafe on Cañada Blvd.
            </p>
            <div className="hero-actions" data-reveal>
              <a href={MAP} target="_blank" rel="noopener noreferrer" className="btn">
                Come on over <Arrow diagonal />
              </a>
              <a href="#menu" className="textlink">
                Explore the menu <Arrow />
              </a>
            </div>
          </div>
          <div className="hero-index">
            <a href="#about" className="textlink label">
              Take a look around <span aria-hidden="true">↓</span>
            </a>
            <span className="label">2527 Cañada Blvd</span>
          </div>
        </section>

        <section id="about" className="section intro wrap">
          <div className="chapter">
            <span className="label" data-reveal>
              01 / The neighborhood spot
            </span>
            <div data-reveal>
              <h2>
                Some places are
                <br />
                part of your day.
              </h2>
              <p className="body">
                A morning coffee. A breakfast break. Lunch with a friend. Loose Cannon is
                a neighborhood cafe in Glendale, serving specialty coffee, breakfast and
                lunch seven days a week.
              </p>
              <div className="facts">
                <div>
                  <strong>7 days</strong>
                  <span className="label">A week</span>
                </div>
                <div>
                  <strong>7 — 4</strong>
                  <span className="label">AM to PM</span>
                </div>
                <div>
                  <strong>LC</strong>
                  <span className="label">Your local</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="menu" className="menu-band">
          <div className="wrap section">
            <span className="label" data-reveal>
              02 / Something for your day
            </span>
            <div className="menu-top" data-reveal>
              <h2>
                Your usual.
                <br />
                Or your next usual.
              </h2>
              <p>
                Start with a coffee classic, try the Marlowe, or make a little more room
                for breakfast and lunch.
              </p>
            </div>
            <div data-reveal>
              <div role="tablist" aria-label="Menu categories" className="tabs">
                {Object.keys(MENU).map((c) => (
                  <button
                    key={c}
                    id={`tab-${c}`}
                    role="tab"
                    aria-selected={category === c}
                    aria-controls="menu-panel"
                    className={`tab ${category === c ? 'active' : ''}`}
                    onClick={() => setCategory(c)}
                    onKeyDown={(e) => {
                      const keys = Object.keys(MENU);
                      let i = keys.indexOf(c);
                      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                        e.preventDefault();
                        i =
                          (i + (e.key === 'ArrowRight' ? 1 : -1) + keys.length) %
                          keys.length;
                        setCategory(keys[i]);
                        document.getElementById(`tab-${keys[i]}`)?.focus();
                      }
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <div
                className="menu-list"
                id="menu-panel"
                role="tabpanel"
                aria-labelledby={`tab-${category}`}
              >
                {MENU[category].map((item) => (
                  <button
                    className="menu-row"
                    key={item.name}
                    onClick={(e) => openItem(item, e)}
                    aria-label={`Learn about ${item.name}`}
                  >
                    <div>
                      <h3>{item.name}</h3>
                      <p>{item.note}</p>
                    </div>
                    <div className="row-end">
                      <span className="label">{item.tag}</span>
                      <Arrow diagonal />
                    </div>
                  </button>
                ))}
              </div>
              <div className="menu-foot">
                <p>
                  A selection from the menu. Ask the cafe about today’s availability,
                  prices and dietary requirements.
                </p>
                <a href={IG} className="textlink" target="_blank" rel="noopener noreferrer">
                  What’s happening today <Arrow diagonal />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="wrap section ritual" id="character">
          <img
            src={logoSrc}
            onError={handleLogoError}
            className="ritual-logo"
            alt="The Loose Cannon monkey illustration"
            loading="lazy"
            data-reveal
          />
          <div data-reveal>
            <span className="label">03 / Coffee with character</span>
            <h2>
              Good company.
              <br />
              A loose cannon.
            </h2>
            <p>
              You’ve met the monkey. Now meet the cafe. Follow along for a look at Loose
              Cannon, then stop by on Cañada Blvd for the real thing.
            </p>
            <p>
              And it’s not just coffee.
              <br />
              Wine and beer are on the menu, too.
            </p>
            <a href={IG} className="textlink" target="_blank" rel="noopener noreferrer">
              @loosecannoncafe <Arrow diagonal />
            </a>
          </div>
        </section>

        <section id="visit" className="wrap section visit">
          <span className="label" data-reveal>
            04 / Meet you on Cañada
          </span>
          <div className="visit-grid">
            <div data-reveal>
              <h2>
                A coffee away
                <br />
                from your
                <br />
                <span style={{ color: 'var(--wine)' }}>usual day.</span>
              </h2>
            </div>
            <div className="visit-details" data-reveal>
              <div className="detail">
                <span className="label">Find us</span>
                <p>
                  2527 Cañada Blvd
                  <br />
                  Glendale, CA 91208
                </p>
              </div>
              <div className="detail">
                <span className="label">Drop in</span>
                <p>
                  Monday — Sunday
                  <br />
                  <span className="tabular-nums">7:00 AM — 4:00 PM</span>
                </p>
              </div>
              <div className="detail">
                <span className="label">Keep in touch</span>
                <a href={IG} className="textlink" target="_blank" rel="noopener noreferrer">
                  Instagram <Arrow diagonal />
                </a>
              </div>
              <div className="visit-actions">
                <a href={MAP} className="btn" target="_blank" rel="noopener noreferrer">
                  Get directions <Arrow diagonal />
                </a>
                <button className="btn outline" onClick={copy}>
                  {copied ? 'Address copied' : 'Copy address'}
                </button>
              </div>
              <p aria-live="polite" style={{ fontSize: 11, minHeight: 20, marginTop: 12 }}>
                {copied ? '2527 Cañada Blvd — ready to paste.' : ''}
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="wrap">
          <div className="footer-top">
            <a href="#home" className="brand">
              LOOSE CANNON<small>NEIGHBORHOOD CAFE</small>
            </a>
            <span className="label">
              Specialty coffee. Breakfast. Lunch.
              <br />
              Glendale, California.
            </span>
            <a href={IG} target="_blank" rel="noopener noreferrer" className="textlink">
              Find us on Instagram <Arrow diagonal />
            </a>
          </div>
          <div className="footer-wordmark">See you tomorrow.</div>
          <div className="footer-bottom">
            <span className="label">Loose Cannon Cafe</span>
            <span className="label">7 AM — 4 PM / Seven days a week</span>
            <a href="#home" className="textlink label">
              Back to top ↑
            </a>
          </div>
        </div>
      </footer>

      {selected && (
        <div
          className="modal"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelected(null);
          }}
        >
          <section className="dialog" role="dialog" aria-modal="true" aria-labelledby="item-title">
            <button
              ref={close}
              className="dialog-close"
              onClick={() => setSelected(null)}
              aria-label="Close menu details"
            >
              ×
            </button>
            <span className="label">On the menu / {selected.tag}</span>
            <h2 id="item-title">{selected.name}</h2>
            <p>{selected.note}.</p>
            <a href={IG} className="btn" target="_blank" rel="noopener noreferrer">
              Ask the cafe on Instagram <Arrow diagonal />
            </a>
            <p className="fine">
              For current prices, ingredients, allergens and availability, please check
              directly with the cafe.
            </p>
          </section>
        </div>
      )}
    </div>
  );
}
