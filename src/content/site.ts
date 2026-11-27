/**
 * Copy del sitio (borrador de Marketing).
 * Solo se renderizan los favoritos. Las alternativas quedan comentadas junto a cada uno.
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
	'Aquí van a vivir nuestros productos propios. Hoy estamos construyendo el primero.';

// Aviso con enlace al correo: lo usan la ficha de la home y el cierre de la página /productos
const productosAviso =
	'Pronto te contamos de qué se trata. Si quieres que te avisemos cuando esté listo, escríbenos.';

export const site = {
	meta: {
		title: 'JuniorLabs | Software a la medida para negocios en México',
		// Alternativas: 'JuniorLabs | Software para el día a día de tu negocio' · 'JuniorLabs: software claro para negocios en México'
		description:
			'Software a la medida para negocios en México: sistemas internos, apps y plataformas web. Cuéntanos tu proyecto o escríbenos a contacto@juniorlabs.com.mx.',
		siteName: 'JuniorLabs',
		// Vista previa al compartir (Open Graph): public/og.png, 1200×630, hecha con el logo
		image: '/og.png',
		imageAlt: 'Logo de JuniorLabs',
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
			{ label: 'Proyectos a la medida', href: '/proyectos/' },
			{ label: 'Productos', href: '/productos/' },
		] satisfies Link[],
		cta: { label: 'Escríbenos', href: mailto } satisfies Link,
		// Alternativa: { label: 'Contacto', href: mailto }
	},

	hero: {
		// Slogan: acompaña al logo que se vuelve cohete con el scroll (RocketScene)
		title: 'Software que despega.',
		// Alternativas:
		// 'Software para que tu negocio despegue.'
		// 'Construimos el software que tu negocio usa todos los días.'
		// 'Software claro para el día a día de tu negocio en México.' (se quedó como frase del footer)
		subtitle:
			'Diseñamos y desarrollamos sistemas, apps y plataformas web a la medida para negocios en México. También estamos construyendo nuestros propios productos.',
		// Lleva al brief guiado de /proyectos (antes: { label: 'Escríbenos', href: mailto })
		primaryCta: { label: 'Cuéntanos tu proyecto', href: '/proyectos/' } satisfies Link,
		// Alternativas: 'Platiquemos' · 'Háblanos'
		secondaryCta: { label: 'Conoce qué hacemos', href: '#que-hacemos' } satisfies Link,
		// Alternativa: { label: 'Ver productos', href: '#productos' }
	},

	queHacemos: {
		id: 'que-hacemos',
		title: 'Qué hacemos',
		intro: 'Herramientas para operar tu negocio, no para presumirlo.',
		blocks: [
			{
				title: 'Primero lo esencial',
				text: 'Software para lo que tu equipo hace a diario: pedidos, inventario, atención a clientes. Empezamos por lo que más se usa y lo hacemos bien.',
			},
			{
				title: 'A la medida y productos propios',
				text: 'Desarrollamos software a la medida de tu negocio y construimos nuestros propios productos. El primero ya está en camino.',
			},
			{
				title: 'Pensado para México',
				text: 'Contemplamos desde el inicio la facturación electrónica y la forma en que se trabaja aquí. No es software de otro país traducido al español.',
			},
		],
	},

	quienesSomos: {
		id: 'quienes-somos',
		title: 'Quiénes somos',
		// Un solo bloque sobre la empresa: sin fotos ni presentación individual de los fundadores
		body: [
			'JuniorLabs es una empresa mexicana de software. Cuando trabajas con nosotros hablas directo con quienes diseñan y programan tu proyecto: sin intermediarios y sin perder el contexto entre una plática y otra.',
		],
		// Origen de la marca, bajo el texto de la empresa. Jorge primero: {JR_} viene de Jorge y Roger.
		// Los espacios de «J de Jorge» y «R de Roger» son de no separación (U+00A0): nunca se parten
		brandOrigin: 'La fundamos Jorge y Roger. De ahí viene nuestra marca, {JR_}: J de Jorge, R de Roger.',
		// Lleva al brief guiado de /proyectos (antes: { label: 'Escríbenos', href: mailto })
		cta: { label: 'Cuéntanos tu idea', href: '/proyectos/' } satisfies Link,
		ctaNote: 'No necesitas tenerlo todo definido: con una idea basta para empezar.',
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
			'Diseñamos y desarrollamos plataformas web, apps y sistemas internos para negocios que ya no caben en hojas de cálculo ni en herramientas genéricas. Un mismo equipo, de la primera plática al lanzamiento.',
		// Cómo trabajamos: en orden, de entender el negocio a que el sistema crezca
		pillars: [
			{
				title: 'Partimos de cómo trabajas',
				text: 'Antes de escribir código entendemos tu operación y lo que tiene que cambiar. El software se adapta a tu negocio, no al revés.',
			},
			{
				title: 'De la idea al lanzamiento',
				text: 'Diseño, desarrollo, pruebas y puesta en marcha en un solo lugar. No tienes que coordinar a varios proveedores.',
			},
			{
				title: 'Avances que puedes probar',
				text: 'Entregamos en etapas cortas: desde el principio pruebas partes que ya funcionan y ajustamos el rumbo con lo que aprendes.',
			},
			{
				title: 'Hecho para crecer',
				text: 'Lo construimos para que después puedas sumar usuarios, funciones y conexiones con otros sistemas sin empezar de cero.',
			},
		],
		pillarsLabel: 'Cómo trabajamos',
		cta: { label: 'Cuéntanos tu proyecto', href: '/proyectos/' } satisfies Link,
		// Alternativa: { label: 'Platícanos tu idea', href: '/proyectos/' }
		ctaNote: 'Son cinco preguntas y te respondemos por correo.',
		page: {
			title: 'Software a la medida | JuniorLabs',
			description:
				'Software a la medida en México: plataformas web, apps, sistemas internos y automatizaciones. Cuéntanos tu proyecto en cinco preguntas.',
			heading: 'Cuéntanos tu proyecto',
			intro:
				'Desarrollamos software a la medida: plataformas web, apps, sistemas internos y automatizaciones. Responde estas cinco preguntas y al final se abre tu correo con todo listo para enviar.',
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
		// Botón de la sección de la home hacia la página completa
		// La página aún no tiene productos publicados: el botón no promete verlos
		cta: { label: 'Conoce lo que viene', href: '/productos/' } satisfies Link,
		// Alternativa: { label: 'Ver productos', href: '/productos/' } (cuando haya uno disponible)
		// Página /productos (los recuadros del Bento Grid viven en content/productos.ts)
		page: {
			title: 'Productos | JuniorLabs',
			description:
				'Productos de software de JuniorLabs para negocios en México. Estamos construyendo el primero: escríbenos y te avisamos cuando esté listo.',
			gridLabel: 'Productos en camino',
			note: productosAviso,
			noteContactWord: 'escríbenos',
		},
		// Ficha de aviso en la home: para publicar un producto, se agrega un elemento a esta lista.
		items: [
			{
				// Nombre genérico hasta que el producto tenga nombre; estado igual al de su recuadro en /productos
				name: 'Nuestro primer producto',
				status: 'En desarrollo',
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
		// El año se toma al construir el sitio
		copyright: `© ${new Date().getFullYear()} JuniorLabs. Todos los derechos reservados.`,
	},
};
