/**
 * Copy del sitio (borrador de Marketing).
 * Solo se renderizan los favoritos. Las alternativas quedan comentadas junto a cada uno.
 * Los literales [PENDIENTE: …] se mantienen tal cual hasta que Marketing los defina.
 */

export interface Link {
	label: string;
	href: string;
}

/** Ficha de producto en /proyectos y en la sección de la home. */
export interface Proyecto {
	name: string;
	status: string;
	description: string;
	/** Palabra de la descripción que enlaza al correo (mailto). Si no aparece en la descripción, el build falla. */
	contactWord?: string;
}

const email = 'contacto@juniorlabs.com.mx';
const mailto = `mailto:${email}`;

const proyectosIntro =
	'Aquí van a vivir nuestros productos cuando ya se puedan usar. Hoy estamos construyendo el primero.';

export const site = {
	meta: {
		title: 'JuniorLabs | Software para el día a día de tu negocio',
		// Alternativa: 'JuniorLabs: software claro para negocios en México'
		description:
			'JuniorLabs es una empresa de software en México. Construimos herramientas para operar tu negocio día a día. Escríbenos a contacto@juniorlabs.com.mx.',
	},

	contact: {
		email,
		mailto,
	},

	nav: {
		brand: 'JuniorLabs',
		links: [
			{ label: 'Inicio', href: '/' },
			{ label: 'Qué hacemos', href: '/#que-hacemos' },
			{ label: 'Quiénes somos', href: '/#quienes-somos' },
			// La página /proyectos ya existe; la sección #proyectos sigue en la home
			{ label: 'Proyectos', href: '/proyectos/' },
		] satisfies Link[],
		cta: { label: 'Escríbenos', href: mailto } satisfies Link,
		// Alternativa: { label: 'Contacto', href: mailto }
	},

	hero: {
		title: 'Software claro para el día a día de tu negocio en México.',
		// Alternativas:
		// 'Construimos el software que tu negocio usa todos los días.'
		// 'Herramientas para operar tu negocio, no para presumirlo.'
		subtitle:
			'Somos JuniorLabs, una empresa de software en México. Estamos construyendo nuestros primeros productos. Cuando uno esté listo, lo vas a ver aquí.',
		primaryCta: { label: 'Escríbenos', href: mailto } satisfies Link,
		// Alternativas: 'Platiquemos' · 'Háblanos'
		secondaryCta: { label: 'Conoce qué hacemos', href: '#que-hacemos' } satisfies Link,
		// Alternativa: { label: 'Ver proyectos', href: '#proyectos' }
	},

	queHacemos: {
		id: 'que-hacemos',
		title: 'Qué hacemos',
		intro: 'Hacemos software para negocios en México. Lo publicamos aquí cuando está listo para usarse.',
		blocks: [
			{
				title: 'Para el trabajo de todos los días',
				text: 'Diseñamos herramientas que tu negocio usa para operar. Lo simple primero.',
			},
			{
				title: 'Productos propios y por encargo',
				text: 'Creamos productos propios y también desarrollamos por encargo. Los productos propios aparecen aquí cuando ya se pueden usar.',
			},
			{
				title: 'Pensado para México',
				text: 'Facturación y la forma en que se trabaja aquí. No es software hecho para otro país y luego traducido.',
			},
		],
	},

	quienesSomos: {
		id: 'quienes-somos',
		title: 'Quiénes somos',
		// Un solo bloque sobre la empresa: sin fotos ni presentación individual de los fundadores
		body: [
			'Somos JuniorLabs, una empresa mexicana de software. Creamos nuestros propios productos y también desarrollamos por encargo: software a la medida, sistemas internos y páginas web para tu negocio.',
		],
		// Origen de la marca, bajo el texto de la empresa. Jorge primero: {JR_} viene de Jorge y Roger.
		// Los espacios de «J de Jorge» y «R de Roger» son de no separación (U+00A0): nunca se parten
		brandOrigin: 'La empezamos Jorge y Roger. De ahí viene nuestra marca, {JR_}: J de Jorge, R de Roger.',
		cta: { label: 'Escríbenos', href: mailto } satisfies Link,
		ctaNote: '¿Tienes una idea o un problema que resolver?',
	},

	proyectos: {
		id: 'proyectos',
		title: 'Proyectos',
		intro: proyectosIntro,
		status: 'Próximamente',
		// Página /proyectos
		page: {
			title: 'Proyectos | JuniorLabs',
			description: proyectosIntro,
		},
		// Fichas de producto: para publicar un producto, se agrega un elemento a esta lista.
		items: [
			{
				name: '[PENDIENTE: nombre del primer producto]',
				status: 'Próximamente',
				description:
					'Pronto vamos a contar qué estamos construyendo. Si quieres saber cuándo esté listo, escríbenos.',
				contactWord: 'escríbenos',
			},
		] satisfies Proyecto[],
	},

	footer: {
		tagline: 'Software claro para el día a día de tu negocio en México.',
		copyright: '© JuniorLabs. Todos los derechos reservados.',
	},
};
