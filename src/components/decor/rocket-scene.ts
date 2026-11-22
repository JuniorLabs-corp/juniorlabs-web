/**
 * Lógica de la escena del cohete (ver RocketScene.astro). GSAP se importa en diferido.
 *
 * Etapas:
 *   hero     (ScrollTrigger sobre .hero-scene, scrub): morph logo → cohete, anticipación, despegue al carril.
 *   vuelo    (ticker): balanceo suave mientras se leen las secciones; fuego y humo vivos.
 *   aterrizaje (ticker): baja frenando hacia la posición VIVA de la plataforma y despliega patas;
 *            al tocar (fin de página) se aplasta, rebota y suelta una bocanada de humo.
 *            Seguir la plataforma en vivo lo mantiene pegado a ella aunque la barra del navegador
 *            móvil cambie el alto visible o el scroll sea muy rápido.
 *
 * Solo se mueven transform/opacity del contenedor y la forma (d) de las piezas del SVG.
 * prefers-reduced-motion: gsap.matchMedia revierte todo y vuelve al estado estático.
 */
import { ROCKET } from './rocket-geometry';

type Gsap = typeof import('gsap').gsap;

const PIECES: Record<string, string> = {
	nose: ROCKET.nose,
	body: ROCKET.body,
	nozzle: ROCKET.nozzle,
	finLeft: ROCKET.finLeft,
	finRight: ROCKET.finRight,
	window: ROCKET.window,
};

// Alto del cohete (punta → base de la tobera) en unidades del viewBox
const ROCKET_SPAN = 308;
// Ancho del logo en el viewBox (los glifos se escalaron para ocupar 340 unidades)
const LOGO_SPAN = 340;
// Base de la tobera y pie de las patas, relativos al centro (200,200) del viewBox
const NOZZLE_Y = 134;
const FEET_Y = 144;

export async function startRocketScene() {
	const stage = document.querySelector<HTMLElement>('[data-rocket-stage]');
	const home = document.querySelector<HTMLElement>('[data-rocket-home]');
	const heroScene = document.querySelector<HTMLElement>('[data-hero-scene]');
	if (!stage || !home || !heroScene) return;

	const [{ gsap }, { ScrollTrigger }, { MorphSVGPlugin }] = await Promise.all([
		import('gsap'),
		import('gsap/ScrollTrigger'),
		import('gsap/MorphSVGPlugin'),
	]);
	gsap.registerPlugin(ScrollTrigger, MorphSVGPlugin);

	// Misma condición que el CSS del hero (Hero.astro): sin soporte de (scripting) no hay escena alta y sticky
	const mm = gsap.matchMedia();
	mm.add('(prefers-reduced-motion: no-preference) and (scripting: enabled)', () =>
		setup(gsap, ScrollTrigger, { stage, home, heroScene }),
	);
}

function setup(
	gsap: Gsap,
	ScrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger,
	els: { stage: HTMLElement; home: HTMLElement; heroScene: HTMLElement },
) {
	const { stage, home, heroScene } = els;
	const q = <T extends Element>(sel: string) => stage.querySelector<T>(sel)!;
	const qa = <T extends Element>(sel: string) => Array.from(stage.querySelectorAll<T>(sel));

	const carrier = q<HTMLElement>('[data-carrier]');
	const land = q<HTMLElement>('[data-land]');
	const sway = q<HTMLElement>('[data-sway]');
	const rocketSvg = q<SVGSVGElement>('[data-rocket]');
	const flame = q<SVGGElement>('[data-flame]');
	const legs = q<SVGPathElement>('[data-legs]');
	const wordmark = q<SVGGElement>('[data-wordmark]');
	const details = qa<SVGElement>('[data-detail]');
	const pieces = qa<SVGPathElement>('[data-piece]');
	const starsSvg = q<SVGSVGElement>('[data-stars]');
	const smokeSvg = q<SVGSVGElement>('[data-smoke]');
	const heroCopy = document.querySelector<HTMLElement>('[data-hero-copy]');
	const heroCtas = document.querySelector<HTMLElement>('[data-hero-ctas]');
	const pad = document.querySelector<HTMLElement>('[data-rocket-pad]');

	// ---------- Posiciones (se recalculan en cada refresh de ScrollTrigger) ----------
	const vw = () => window.innerWidth;
	// Alto estable: en móvil no cambia cuando la barra del navegador aparece o se oculta (innerHeight sí)
	const vh = () => document.documentElement.clientHeight;

	const sticky = home.closest<HTMLElement>('.hero-sticky') ?? heroScene;
	/**
	 * Pose del logo al inicio de la escena, sin importar el scroll actual (recarga a mitad de página,
	 * enlace con #ancla, resize): posición del logo dentro del contenedor sticky + su `top` fijo.
	 */
	const homePose = () => {
		const r = home.getBoundingClientRect();
		const st = sticky.getBoundingClientRect();
		const stickyTop = parseFloat(getComputedStyle(sticky).top) || 0;
		const s = r.width / LOGO_SPAN;
		return { x: r.left + r.width / 2 - 200, y: stickyTop + (r.top - st.top) + r.height / 2 - 200, scale: s };
	};
	/** Cohete grande en el centro del hero, antes de despegar */
	const stagePose = () => {
		const h = home.getBoundingClientRect();
		const header = document.querySelector('header')?.getBoundingClientRect().bottom ?? 72;
		const s = Math.min((vh() - header) * 0.56, 400) / ROCKET_SPAN;
		// centro del cohete (y≈176 en el viewBox) en el centro del área visible bajo el header
		const cy = header + (vh() - header) / 2;
		// con origen en (200,200): el punto y=176 queda en y + 200 + (176 - 200)·s
		return { x: h.left + h.width / 2 - 200, y: cy - 200 + 24 * s, scale: s };
	};
	/** Carril del vuelo, a la derecha y detrás del texto */
	const lanePose = () => {
		const s = Math.min(vh() * 0.26, 210) / ROCKET_SPAN;
		const x = vw() >= 1024 ? vw() * 0.88 : vw() * 0.84;
		return { x: x - 200, y: vh() * 0.46 - 200, scale: s };
	};
	/** Posado en la plataforma del footer, en su posición actual en pantalla (se mueve con el scroll) */
	const padPose = (r: DOMRect) => {
		const s = 56 / 220; // mismo tamaño que el cohete estático del pad (3.5rem sobre 220 unidades)
		return { x: r.left + r.width / 2 - 200, y: r.bottom - 4 - FEET_Y * s - 200, scale: s };
	};
	/** Scroll en el que la plataforma asoma por abajo (inicio del aterrizaje) */
	const landStartAt = (r: DOMRect) => r.top + window.scrollY - vh();

	// ---------- Estado inicial: el cohete se superpone exacto al logo estático ----------
	gsap.set(carrier, { ...homePose(), transformOrigin: '200px 200px' });
	gsap.set(land, { transformOrigin: '200px 200px' });
	// origen primero y escala después: con escala 0 GSAP no puede calcular el origen y las patas se desplazan
	gsap.set(legs, { svgOrigin: '200 290' });
	gsap.set(legs, { scaleY: 0.001 });
	gsap.set(flame, { svgOrigin: '200 330' });
	gsap.set(flame, { scaleY: 0.001 });
	document.documentElement.classList.add('rocket-on');

	// 0–1: potencia del motor que da el hero (solo la anima el hero: al volver arriba queda en 0)
	const thrust = { v: 0 };
	let landed = false;
	let landP = 0; // progreso del aterrizaje, suavizado (0 en vuelo, 1 posado)

	// ---------- Hero: transformación, anticipación y despegue ----------
	const hero = gsap.timeline({
		defaults: { ease: 'power2.inOut' },
		scrollTrigger: {
			trigger: heroScene,
			start: 0,
			end: 'bottom bottom',
			scrub: 0.6,
			invalidateOnRefresh: true,
		},
	});

	hero
		.addLabel('morph', 0)
		.to(heroCopy, { opacity: 0, y: -24, duration: 2.2, ease: 'power1.in' }, 'morph')
		.to(heroCtas, { autoAlpha: 0, duration: 1.6, ease: 'power1.in' }, 'morph')
		.fromTo(
			carrier,
			{ x: () => homePose().x, y: () => homePose().y, scale: () => homePose().scale },
			{ x: () => stagePose().x, y: () => stagePose().y, scale: () => stagePose().scale, duration: 5 },
			'morph',
		)
		.to(wordmark, { opacity: 0, x: 30, duration: 2, ease: 'power2.in' }, 'morph');

	pieces.forEach((p, i) => {
		const key = p.dataset.piece!;
		hero.to(
			p,
			{ morphSVG: { shape: PIECES[key], type: 'rotational' }, duration: 4.2, ease: 'power3.inOut' },
			`morph+=${0.25 + i * 0.12}`,
		);
	});

	hero
		.to(rocketSvg, { '--m': 1, duration: 3, ease: 'power1.inOut' }, 'morph+=1.4')
		.to(q('[data-piece="body"]'), { strokeWidth: 6, duration: 2 }, 'morph+=2.6')
		.to(details, { opacity: (i) => (i === 2 ? 0.75 : 1), duration: 1.2, stagger: 0.2, ease: 'power2.out' }, 'morph+=4.2')
		// anticipación: se agacha e inclina mientras el motor arranca
		.addLabel('crouch', 5.6)
		.to(carrier, { y: '+=12', rotation: -3, duration: 0.9, ease: 'power2.out' }, 'crouch')
		.to(thrust, { v: 0.35, duration: 0.9, ease: 'power1.in' }, 'crouch')
		.to(carrier, { y: '-=18', rotation: 1, duration: 0.5, ease: 'power2.inOut' }, 'crouch+=0.9')
		.to(thrust, { v: 1, duration: 0.5 }, 'crouch+=0.9')
		// despegue: sube acelerando y se acomoda en el carril del vuelo
		.addLabel('liftoff', 7)
		.to(carrier, { y: () => lanePose().y - vh() * 0.25, duration: 1.6, ease: 'power3.in' }, 'liftoff')
		.to(carrier, { rotation: 8, duration: 1.2, ease: 'power1.inOut' }, 'liftoff+=0.4')
		.to(carrier, { x: () => lanePose().x, scale: () => lanePose().scale, duration: 2.2, ease: 'power2.inOut' }, 'liftoff+=0.6')
		.to(carrier, { y: () => lanePose().y, rotation: 0, duration: 1.4, ease: 'power2.out' }, 'liftoff+=1.6');

	// ---------- Aterrizaje (lo mueve el ticker; ver tick) ----------
	/*
		El hero controla [data-carrier] (logo → carril). El aterrizaje mueve [data-land], que va dentro,
		con el desplazamiento relativo desde la pose actual del contenedor: así no compiten por el mismo
		transform y, compuesto, queda exacto sobre la plataforma.
	*/
	const easeMove = gsap.parseEase('power2.inOut');
	const easeDrop = gsap.parseEase('power3.out');
	const easeLegs = gsap.parseEase('back.out(2)');
	const setLand = {
		x: gsap.quickSetter(land, 'x', 'px'),
		y: gsap.quickSetter(land, 'y', 'px'),
		sx: gsap.quickSetter(land, 'scaleX'),
		sy: gsap.quickSetter(land, 'scaleY'),
		legs: gsap.quickSetter(legs, 'scaleY'),
	};
	let landIdle = true;
	const updateLanding = (r: DOMRect, dt: number) => {
		const start = landStartAt(r);
		// fin real del scroll con el alto visible de este momento (margen por la barra del navegador)
		const end = document.documentElement.scrollHeight - window.innerHeight - 8;
		const target = gsap.utils.clamp(0, 1, (window.scrollY - start) / Math.max(end - start, 1));
		landP += (target - landP) * (1 - Math.exp(-dt * 9));
		if (Math.abs(target - landP) < 0.001) landP = target;

		if (landP > 0) {
			const cs = gsap.getProperty(carrier, 'scale') as number;
			const pp = padPose(r);
			const rx = (pp.x - (gsap.getProperty(carrier, 'x') as number)) / cs;
			const ry = (pp.y - (gsap.getProperty(carrier, 'y') as number)) / cs;
			const m = easeMove(landP);
			setLand.x(rx * m);
			setLand.y(ry * easeDrop(landP));
			const ls = 1 + (pp.scale / cs - 1) * m;
			setLand.sx(ls);
			setLand.sy(ls);
			setLand.legs(Math.max(easeLegs(gsap.utils.clamp(0, 1, (landP - 0.55) / 0.35)), 0.001));
			landIdle = false;
		} else if (!landIdle) {
			setLand.x(0);
			setLand.y(0);
			setLand.sx(1);
			setLand.sy(1);
			setLand.legs(0.001);
			landIdle = true;
		}

		if (landP > 0.985 && !landed) touchdown(r);
		else if (landP < 0.9 && landed) liftAgain();
	};

	function touchdown(r: DOMRect) {
		landed = true;
		gsap
			.timeline()
			.to(sway, { scaleY: 0.9, scaleX: 1.08, y: 2, duration: 0.12, ease: 'power2.out', transformOrigin: '50% 86%' })
			.to(sway, { scaleY: 1, scaleX: 1, y: -10, duration: 0.22, ease: 'power2.out' })
			.to(sway, { y: 0, duration: 0.5, ease: 'bounce.out' });
		burst(16, r);
	}

	function liftAgain() {
		landed = false;
		gsap.to(sway, { scaleX: 1, scaleY: 1, y: 0, duration: 0.3 });
	}

	// ---------- Estrellas (paralaje con el scroll) ----------
	const NS = 'http://www.w3.org/2000/svg';
	const stars = Array.from({ length: 56 }, () => {
		const c = document.createElementNS(NS, 'circle');
		c.setAttribute('class', 'rocket-star');
		c.setAttribute('r', (0.5 + Math.random() * 1.3).toFixed(1));
		starsSvg.appendChild(c);
		return { c, x: Math.random(), base: Math.random(), depth: 0.04 + Math.random() * 0.22, o: 0.25 + Math.random() * 0.75 };
	});
	let lastScroll = -1;
	const darkMq = window.matchMedia('(prefers-color-scheme: dark)');
	const starsOpacity = () => {
		const t = document.documentElement.dataset.theme;
		return t === 'dark' || (t !== 'light' && darkMq.matches) ? 0.7 : 0.18;
	};
	const onTheme = () => (lastScroll = -1); // fuerza a repintar las estrellas
	darkMq.addEventListener('change', onTheme);

	// ---------- Humo (partículas reutilizadas) ----------
	const puffs = Array.from({ length: 40 }, () => {
		const c = document.createElementNS(NS, 'circle');
		c.setAttribute('class', 'rocket-puff');
		c.setAttribute('r', '0');
		smokeSvg.appendChild(c);
		return { c, life: 0, x: 0, y: 0, vx: 0, vy: 0, r: 0, dur: 1 };
	});
	const emit = (x: number, y: number, vx: number, vy: number, r: number, dur: number) => {
		const p = puffs.find((pp) => pp.life <= 0);
		if (p) Object.assign(p, { life: 1, x, y, vx, vy, r, dur });
	};

	/** Base de la tobera en pantalla, según la pose actual del contenedor */
	const nozzleWorld = () => {
		const cs = gsap.getProperty(carrier, 'scale') as number;
		const ls = gsap.getProperty(land, 'scale') as number;
		const s = cs * ls;
		// centro (200,200) en pantalla = carrier + desplazamiento de [data-land] escalado por el carrier
		const x = (gsap.getProperty(carrier, 'x') as number) + (gsap.getProperty(land, 'x') as number) * cs;
		const y = (gsap.getProperty(carrier, 'y') as number) + (gsap.getProperty(land, 'y') as number) * cs;
		const rot = (((gsap.getProperty(carrier, 'rotation') as number) + (gsap.getProperty(sway, 'rotation') as number)) * Math.PI) / 180;
		const ox = (gsap.getProperty(sway, 'x') as number) * s;
		const dy = NOZZLE_Y * s;
		return { x: x + 200 + ox - Math.sin(rot) * dy, y: y + 200 + Math.cos(rot) * dy, s, rot };
	};

	function burst(n: number, r: DOMRect) {
		const { x } = nozzleWorld();
		const ground = (r.bottom - 4) | 0;
		for (let i = 0; i < n; i++) {
			const dir = i % 2 ? 1 : -1;
			emit(x + dir * Math.random() * 10, ground - 2, dir * (25 + Math.random() * 90), -Math.random() * 14, 3 + Math.random() * 4, 1 + Math.random() * 0.5);
		}
	}

	// ---------- Ticker: fuego que titila, humo, balanceo y estrellas ----------
	const setFlame = { o: gsap.quickSetter(flame, 'opacity'), sy: gsap.quickSetter(flame, 'scaleY'), sx: gsap.quickSetter(flame, 'scaleX') };
	const setSway = { x: gsap.quickSetter(sway, 'x', 'px'), r: gsap.quickSetter(sway, 'rotation', 'deg') };
	const setCarrierOpacity = gsap.quickSetter(carrier, 'opacity');
	let carrierOpacity = 1;
	let flameOff = true;
	let swayIdle = true;
	let lastEmit = 0;
	const tick = (time: number, delta: number) => {
		const dt = Math.min(delta / 1000, 0.05);
		const sy = window.scrollY;
		const padRect = pad?.getBoundingClientRect();
		if (padRect) updateLanding(padRect, dt);

		// fuego: vivo mientras el motor está encendido; al bajar a la plataforma se va apagando
		const power = landed ? 0 : thrust.v * (1 - 0.8 * landP);
		if (power > 0.02) {
			const flicker = 0.82 + 0.12 * Math.sin(time * 31) + 0.08 * Math.sin(time * 53 + 1.3) + 0.05 * Math.random();
			setFlame.o(1);
			setFlame.sy(power * flicker);
			setFlame.sx(0.9 + 0.1 * Math.sin(time * 23));
			flameOff = false;
		} else if (!flameOff) {
			setFlame.o(0);
			flameOff = true;
		}

		// balanceo durante el vuelo (sube y baja según la fase)
		const flight = landed ? 0 : flightAmount(padRect);
		if (flight > 0) {
			setSway.x(Math.sin(sy / 190 + time * 0.8) * 7 * flight);
			setSway.r(Math.sin(sy / 260 + time * 0.6) * 3.5 * flight);
			swayIdle = false;
		} else if (!swayIdle && !landed) {
			setSway.x(0);
			setSway.r(0);
			swayIdle = true;
		}

		// pantallas angostas: el carril queda detrás de los párrafos; en vuelo se vuelve tenue para no restar
		// contraste al texto, y recupera su opacidad en el hero y al aterrizar
		const op = vw() < 768 ? 1 - 0.7 * flight : 1;
		if (Math.abs(op - carrierOpacity) > 0.005) {
			carrierOpacity = op;
			setCarrierOpacity(op);
		}

		// humo
		if (power > 0.25 && time - lastEmit > 0.05) {
			lastEmit = time;
			const n = nozzleWorld();
			const spread = (Math.random() - 0.5) * 24 * n.s * 4;
			emit(n.x + spread, n.y + 10 * n.s, (Math.random() - 0.5) * 26 - Math.sin(n.rot) * 50, 60 + Math.random() * 40, (3 + Math.random() * 4) * Math.max(n.s * 2.2, 0.5), 0.8 + Math.random() * 0.5);
		}
		for (const p of puffs) {
			if (p.life <= 0) continue;
			p.life -= dt / p.dur;
			p.x += p.vx * dt;
			p.y += p.vy * dt;
			p.vx *= 0.97;
			const k = 1 - Math.max(p.life, 0);
			p.c.setAttribute('cx', p.x.toFixed(1));
			p.c.setAttribute('cy', p.y.toFixed(1));
			p.c.setAttribute('r', (p.life > 0 ? p.r * (1 + k * 1.6) : 0).toFixed(1));
			p.c.setAttribute('opacity', (0.38 * Math.max(p.life, 0)).toFixed(2));
		}

		// estrellas: solo cuando cambia el scroll
		if (sy !== lastScroll) {
			lastScroll = sy;
			const h = vh() + 20;
			const w = vw();
			const so = starsOpacity();
			for (const s of stars) {
				s.c.setAttribute('cx', (s.x * w).toFixed(0));
				s.c.setAttribute('cy', ((((s.base * h - sy * s.depth) % h) + h) % h).toFixed(1));
				s.c.setAttribute('opacity', (s.o * so).toFixed(2));
			}
		}
	};

	/** 0 en el hero, 1 a mitad de página, 0 al llegar a la plataforma */
	const flightAmount = (padRect?: DOMRect) => {
		const heroEnd = hero.scrollTrigger!.end;
		const landStart = padRect ? landStartAt(padRect) : document.documentElement.scrollHeight;
		const y = window.scrollY;
		const ramp = 260;
		return gsap.utils.clamp(0, 1, Math.min((y - heroEnd + ramp) / ramp, (landStart - y) / ramp));
	};

	gsap.ticker.add(tick);
	ScrollTrigger.refresh();

	return () => {
		gsap.ticker.remove(tick);
		darkMq.removeEventListener('change', onTheme);
		gsap.killTweensOf([sway, flame]);
		gsap.set([sway, flame, land, legs], { clearProps: 'all' });
		gsap.set(carrier, { clearProps: 'opacity' });
		document.documentElement.classList.remove('rocket-on');
		starsSvg.replaceChildren();
		smokeSvg.replaceChildren();
	};
}
