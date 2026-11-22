/**
 * Lógica de la escena del cohete (ver RocketScene.astro). GSAP se importa en diferido.
 *
 * Etapas:
 *   hero     (ScrollTrigger sobre .hero-scene, scrub): morph logo → cohete, anticipación, despegue al carril.
 *   vuelo    (ticker): balanceo suave mientras se leen las secciones; fuego y humo vivos.
 *   aterrizaje (ScrollTrigger sobre la plataforma, scrub): baja frenando, despliega patas;
 *            al tocar (fin de página) se aplasta, rebota y suelta una bocanada de humo.
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

	const mm = gsap.matchMedia();
	mm.add('(prefers-reduced-motion: no-preference)', () => setup(gsap, ScrollTrigger, { stage, home, heroScene }));
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
	const pad = document.querySelector<HTMLElement>('[data-rocket-pad]');

	// ---------- Posiciones (se recalculan en cada refresh de ScrollTrigger) ----------
	const vw = () => window.innerWidth;
	const vh = () => window.innerHeight;

	/** El logo del hero está en un contenedor sticky: su posición en pantalla es estable durante la escena */
	const homePose = () => {
		const r = home.getBoundingClientRect();
		const s = r.width / LOGO_SPAN;
		return { x: r.left + r.width / 2 - 200, y: r.top + r.height / 2 - 200, scale: s };
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
	/** Posado en la plataforma del footer (posición en pantalla al final de la página) */
	const padPose = () => {
		if (!pad) return lanePose();
		const r = pad.getBoundingClientRect();
		const maxScroll = document.documentElement.scrollHeight - vh();
		const top = r.top + window.scrollY - maxScroll; // posición en pantalla con el scroll al máximo
		const s = 56 / 220; // mismo tamaño que el cohete estático del pad (3.5rem sobre 220 unidades)
		const ground = top + r.height - 4;
		return { x: r.left + r.width / 2 - 200, y: ground - FEET_Y * s - 200, scale: s };
	};

	// ---------- Estado inicial: el cohete se superpone exacto al logo estático ----------
	gsap.set(carrier, { ...homePose(), transformOrigin: '200px 200px' });
	gsap.set(land, { transformOrigin: '200px 200px' });
	gsap.set(legs, { scaleY: 0, svgOrigin: '200 290' });
	gsap.set(flame, { svgOrigin: '200 330', scaleY: 0 });
	document.documentElement.classList.add('rocket-on');

	const thrust = { v: 0 }; // 0–1: potencia del motor (fuego y humo)
	let landed = false;

	// ---------- Hero: transformación, anticipación y despegue ----------
	const hero = gsap.timeline({
		defaults: { ease: 'power2.inOut' },
		scrollTrigger: {
			trigger: heroScene,
			start: 'top top',
			end: 'bottom bottom',
			scrub: 0.6,
			invalidateOnRefresh: true,
		},
	});

	hero
		.addLabel('morph', 0)
		.to(heroCopy, { autoAlpha: 0, y: -24, duration: 2.2, ease: 'power1.in' }, 'morph')
		.to(carrier, { x: () => stagePose().x, y: () => stagePose().y, scale: () => stagePose().scale, duration: 5 }, 'morph')
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

	// ---------- Aterrizaje ----------
	let landing: gsap.core.Timeline | undefined;
	if (pad) {
		landing = gsap.timeline({
			scrollTrigger: {
				trigger: pad,
				start: 'top bottom',
				end: 'max',
				scrub: 0.6,
				invalidateOnRefresh: true,
				onUpdate: (self) => {
					if (self.progress > 0.985 && !landed) touchdown();
					else if (self.progress < 0.9 && landed) liftAgain();
				},
			},
		});
		/*
			El hero controla [data-carrier] (logo → carril). El aterrizaje mueve [data-land], que va dentro,
			con el desplazamiento relativo: así no compiten por el mismo transform. Compuesto con el carril
			(x_l, y_l, s_l), queda exacto en la plataforma (x_p, y_p, s_p).
		*/
		const rel = () => {
			const l = lanePose();
			const pp = padPose();
			return { x: (pp.x - l.x) / l.scale, y: (pp.y - l.y) / l.scale, scale: pp.scale / l.scale };
		};
		landing
			.fromTo(land, { x: 0, scale: 1 }, { x: () => rel().x, scale: () => rel().scale, duration: 1, ease: 'power2.inOut', immediateRender: false }, 0)
			.fromTo(land, { y: 0 }, { y: () => rel().y, duration: 1, ease: 'power3.out', immediateRender: false }, 0)
			.fromTo(legs, { scaleY: 0 }, { scaleY: 1, duration: 0.35, ease: 'back.out(2)', immediateRender: false }, 0.55)
			.fromTo(thrust, { v: 1 }, { v: 0.3, duration: 1, ease: 'power1.out', immediateRender: false }, 0);
	}

	function touchdown() {
		landed = true;
		gsap
			.timeline()
			.to(sway, { scaleY: 0.9, scaleX: 1.08, y: 2, duration: 0.12, ease: 'power2.out', transformOrigin: '50% 86%' })
			.to(sway, { scaleY: 1, scaleX: 1, y: -10, duration: 0.22, ease: 'power2.out' })
			.to(sway, { y: 0, duration: 0.5, ease: 'bounce.out' });
		burst(16);
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
	const starsOpacity = () => (matchMedia('(prefers-color-scheme: dark)').matches && document.documentElement.dataset.theme !== 'light') || document.documentElement.dataset.theme === 'dark' ? 0.7 : 0.18;

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

	function burst(n: number) {
		const { x, s } = nozzleWorld();
		const ground = (padPose().y + 200 + FEET_Y * s) | 0;
		for (let i = 0; i < n; i++) {
			const dir = i % 2 ? 1 : -1;
			emit(x + dir * Math.random() * 10, ground - 2, dir * (25 + Math.random() * 90), -Math.random() * 14, 3 + Math.random() * 4, 1 + Math.random() * 0.5);
		}
	}

	// ---------- Ticker: fuego que titila, humo, balanceo y estrellas ----------
	let lastEmit = 0;
	let lastScroll = -1;
	const tick = (time: number, delta: number) => {
		const dt = Math.min(delta / 1000, 0.05);
		const sy = window.scrollY;

		// fuego: vivo mientras el motor está encendido (no depende del scroll)
		const power = landed ? 0 : thrust.v;
		const flicker = 0.82 + 0.12 * Math.sin(time * 31) + 0.08 * Math.sin(time * 53 + 1.3) + 0.05 * Math.random();
		gsap.set(flame, { opacity: power > 0.02 ? 1 : 0, scaleY: power * flicker, scaleX: 0.9 + 0.1 * Math.sin(time * 23) });

		// balanceo durante el vuelo (sube y baja según la fase)
		const flight = flightAmount();
		if (!landed) gsap.set(sway, { x: Math.sin(sy / 190 + time * 0.8) * 7 * flight, rotation: Math.sin(sy / 260 + time * 0.6) * 3.5 * flight });

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
	const flightAmount = () => {
		const st = hero.scrollTrigger!;
		const heroEnd = st.end;
		const landStart = landing?.scrollTrigger?.start ?? document.documentElement.scrollHeight;
		const y = window.scrollY;
		const ramp = 260;
		return gsap.utils.clamp(0, 1, Math.min((y - heroEnd + ramp) / ramp, (landStart - y) / ramp));
	};

	gsap.ticker.add(tick);
	ScrollTrigger.refresh();

	return () => {
		gsap.ticker.remove(tick);
		document.documentElement.classList.remove('rocket-on');
		starsSvg.replaceChildren();
		smokeSvg.replaceChildren();
	};
}
