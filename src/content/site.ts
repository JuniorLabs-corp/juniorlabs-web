/**
 * Copy del sitio (borrador de Marketing).
 * Solo se renderizan los favoritos. Las alternativas quedan comentadas junto a cada uno.
 * Los literales [PENDIENTE: …] se mantienen tal cual hasta que Marketing los defina.
 */

export interface Link {
	label: string;
	href: string;
}

const email = 'contacto@juniorlabs.com.mx';
const mailto = `mailto:${email}`;

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
			// Cuando exista la página /proyectos (feat/proyectos), también se puede enlazar ahí.
			{ label: 'Proyectos', href: '/#proyectos' },
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
				title: 'Productos nuestros, no una agencia',
				text: 'No somos una agencia genérica. Construimos productos propios y los mostramos aquí cuando ya se pueden usar.',
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
		paragraphs: [
			// Jorge primero: {JR_} viene de Jorge y Rogelio
			'JuniorLabs es una empresa de software en México. La empezamos Jorge y Rogelio.',
			//   = espacio de no separación: «J de Jorge» y «R de Rogelio» nunca se parten
			'De ahí viene nuestra marca, {JR_}: J de Jorge, R de Rogelio.',
			'Estamos construyendo nuestros primeros productos, pensados para negocios que operan aquí.',
		],
		// Sin fotos de los fundadores (decisión de JuniorLabs): la sección usa sus iniciales, J y R.
		founders: [
			{
				initial: 'J',
				line: '[PENDIENTE: una línea de presentación de Jorge, con apellido y el nombre que quieran mostrar]',
			},
			{
				initial: 'R',
				line: '[PENDIENTE: una línea de presentación de Rogelio, con el nombre que quieran mostrar]',
			},
		],
	},

	proyectos: {
		id: 'proyectos',
		title: 'Proyectos',
		intro: 'Aquí van a vivir nuestros productos cuando ya se puedan usar. Hoy estamos construyendo el primero.',
		status: 'Próximamente',
		// Página /proyectos
		page: {
			title: 'Proyectos | JuniorLabs',
			description:
				'Aquí van a vivir nuestros productos cuando ya se puedan usar. Hoy estamos construyendo el primero.',
		},
		// Fichas de producto: para publicar un producto, se agrega un elemento a esta lista.
		// `contactWord` es la palabra de la descripción que enlaza al correo (mailto).
		items: [
			{
				name: '[PENDIENTE: nombre del primer producto]',
				status: 'Próximamente',
				description:
					'Pronto vamos a contar qué estamos construyendo. Si quieres saber cuándo esté listo, escríbenos.',
				contactWord: 'escríbenos',
			},
		],
	},

	footer: {
		tagline: 'Software claro para el día a día de tu negocio en México.',
		copyright: '© JuniorLabs. Todos los derechos reservados.',
	},
};
