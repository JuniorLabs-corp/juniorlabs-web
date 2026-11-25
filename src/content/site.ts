/**
 * Copy del sitio (borrador de Marketing).
 * Solo se renderizan los favoritos. Las alternativas quedan comentadas junto a cada uno.
 * Los literales [PENDIENTE: …] se mantienen tal cual hasta que Marketing los defina.
 */

export interface Link {
	label: string;
	href: string;
}

/** Ficha de aviso en la sección Productos de la home. */
export interface FichaProducto {
	name: string;
	status: string;
	description: string;
	/** Palabra de la descripción que enlaza al correo (mailto). Si no aparece en la descripción, el build falla. */
	contactWord?: string;
}

const email = 'contacto@juniorlabs.com.mx';
const mailto = `mailto:${email}`;

const productosIntro =
	'Aquí van a vivir nuestros productos cuando ya se puedan usar. Hoy estamos construyendo el primero.';

// Aviso con enlace al correo: lo usan la ficha de la home y el cierre de la página /productos
const productosAviso =
	'Pronto vamos a contar qué estamos construyendo. Si quieres saber cuándo esté listo, escríbenos.';

export const site = {
	meta: {
		title: 'JuniorLabs | Software para el día a día de tu negocio',
		// Alternativa: 'JuniorLabs: software claro para negocios en México'
		description:
			'JuniorLabs es una empresa de software en México. Construimos herramientas para operar tu negocio día a día. Escríbenos a contacto@juniorlabs.com.mx.',
		siteName: 'JuniorLabs',
		// Vista previa al compartir (Open Graph): public/og.png, 1200×630, hecha con el logo
		image: '/og.png',
		imageAlt: 'Logo {JR_} labs de JuniorLabs',
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
			// Dos páginas distintas: el servicio por encargo (/proyectos) y los productos propios (/productos)
			{ label: 'Proyectos a medida', href: '/proyectos/' },
			{ label: 'Productos', href: '/productos/' },
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
		// Alternativa: { label: 'Ver productos', href: '#productos' }
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
		// Lleva al brief guiado de /proyectos (antes: { label: 'Escríbenos', href: mailto })
		cta: { label: 'Cuéntanos tu idea', href: '/proyectos/' } satisfies Link,
		ctaNote: '¿Tienes una idea o un problema que resolver?',
	},

	// Desarrollo por encargo: sección de la home (#proyectos) y página /proyectos con el brief guiado
	proyectos: {
		id: 'proyectos',
		// Espacios de no separación (U+00A0): «a la medida» y «de tu negocio» nunca se parten
		title: 'Software a la medida de tu negocio',
		// Alternativas:
		// 'Tu idea, convertida en software que funciona.'
		// 'Lo que tu negocio necesita y ninguna app resuelve.'
		intro:
			'Diseñamos y desarrollamos plataformas web, apps y sistemas internos para negocios que ya no caben en hojas de cálculo ni en apps genéricas. Un mismo equipo, de la primera plática al lanzamiento.',
		// Cómo trabajamos: en orden, de entender el negocio a que el sistema crezca
		pillars: [
			{
				title: 'Partimos de cómo trabajas',
				text: 'Antes de escribir código entendemos tu operación y lo que tiene que cambiar. El software se adapta a tu negocio, no al revés.',
			},
			{
				title: 'De la idea al lanzamiento',
				text: 'Diseño, desarrollo, pruebas y puesta en marcha con el mismo equipo. No tienes que coordinar a varios proveedores.',
			},
			{
				title: 'Avances que puedes probar',
				text: 'Entregamos por etapas cortas. Usas partes funcionando desde temprano y ajustamos con lo que aprendes.',
			},
			{
				title: 'Hecho para crecer',
				text: 'Arquitectura pensada para sumar usuarios, módulos e integraciones sin empezar de cero.',
			},
		],
		pillarsLabel: 'Cómo trabajamos',
		cta: { label: 'Cuéntanos tu proyecto', href: '/proyectos/' } satisfies Link,
		// Alternativa: { label: 'Platícanos tu idea', href: '/proyectos/' }
		ctaNote: 'Son cinco preguntas y te respondemos por correo.',
		page: {
			title: 'Proyectos a medida | JuniorLabs',
			description:
				'Software a la medida en México: plataformas web, apps, sistemas internos y automatizaciones. Cuéntanos tu proyecto en cinco preguntas.',
			heading: 'Cuéntanos tu proyecto',
			intro:
				'Desarrollamos software a la medida: plataformas web, apps, sistemas internos y automatizaciones. Responde el brief y al final se abre tu correo con todo listo para enviarlo.',
			nextTitle: 'Qué pasa después',
			next: [
				{ title: 'Envías el correo', text: 'desde tu cuenta, con tus respuestas ordenadas.' },
				{ title: 'Lo leemos y te respondemos', text: 'con dudas o una propuesta para platicarlo.' },
				{ title: 'Definimos juntos', text: 'alcance, tiempos y costo antes de empezar.' },
			],
			directNote: '¿Prefieres escribir directo?',
		},
	},

	productos: {
		id: 'productos',
		title: 'Productos',
		intro: productosIntro,
		status: 'Próximamente',
		// Botón de la sección de la home hacia la página completa
		cta: { label: 'Ver productos', href: '/productos/' } satisfies Link,
		// Alternativa: { label: 'Conoce lo que viene', href: '/productos/' }
		// Página /productos (los recuadros del Bento Grid viven en content/productos.ts)
		page: {
			title: 'Productos | JuniorLabs',
			description: productosIntro,
			gridLabel: 'Productos en camino',
			note: productosAviso,
			noteContactWord: 'escríbenos',
		},
		// Ficha de aviso en la home: para publicar un producto, se agrega un elemento a esta lista.
		items: [
			{
				name: '[PENDIENTE: nombre del primer producto]',
				status: 'Próximamente',
				description: productosAviso,
				contactWord: 'escríbenos',
			},
		] satisfies FichaProducto[],
	},

	// Página 404
	notFound: {
		title: 'Página no encontrada | JuniorLabs',
		description: 'La página que buscas no existe o cambió de lugar.',
		heading: 'Página no encontrada',
		text: 'La página que buscas no existe o cambió de lugar.',
		cta: { label: 'Volver al inicio', href: '/' } satisfies Link,
	},

	footer: {
		tagline: 'Software claro para el día a día de tu negocio en México.',
		copyright: '© JuniorLabs. Todos los derechos reservados.',
	},
};
