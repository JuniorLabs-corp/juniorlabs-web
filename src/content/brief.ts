/**
 * Brief guiado de /proyectos: preguntas, mensajes del formulario y armado del correo (mailto).
 * Lo usan el formulario (components/proyectos/BriefForm.astro) y su script en el navegador.
 * No importa site.ts para no mandar todo el copy del sitio al navegador; el destinatario
 * llega al script desde el atributo data-to del formulario.
 */

/** Respuestas del brief, ya sin espacios sobrantes. */
export interface BriefAnswers {
	correo: string;
	idea: string;
	tipos: string[];
	tipoDetalle: string;
	etapa: string;
	plazo: string;
	detalles: string;
}

export const brief = {
	intro: 'Son cinco preguntas y solo las dos primeras son obligatorias.',
	optional: 'Opcional',

	questions: {
		correo: {
			label: '¿A qué correo te respondemos?',
			hint: 'Solo lo usamos para contestarte.',
			placeholder: 'nombre@tuempresa.com',
			// Título de la respuesta dentro del correo
			summary: 'Correo de contacto',
			// Verificación en vivo: aviso para lector de pantalla y sugerencia ante errores de dedo en el dominio
			valid: 'Correo válido.',
			suggestPrefix: '¿Quisiste decir',
			suggestAction: 'Usar',
			// Un mensaje por cada problema: dice qué falta y cómo se ve bien
			errors: {
				empty: 'Escribe tu correo para que podamos responderte.',
				spaces: 'Quita los espacios: un correo no lleva espacios.',
				noAt: 'Falta la @: debe verse como nombre@empresa.com.',
				manyAt: 'Sobra una @: el correo lleva solo una.',
				noUser: 'Falta lo que va antes de la @, como nombre@.',
				noDomain: 'Falta lo que va después de la @, como empresa.com.',
				noTld: 'Falta la terminación, como .com o .mx.',
				badDomain: 'Revisa lo que va después de la @: debe verse como empresa.com.',
			},
		},
		idea: {
			label: '¿Qué problema quieres resolver o qué idea tienes?',
			hint: 'Cuéntalo con tus palabras, como se lo contarías a alguien de tu equipo. No hacen falta términos técnicos.',
			placeholder:
				'Ej. Llevamos pedidos e inventario en hojas de cálculo y se nos cruzan los datos. Queremos un sistema donde todo el equipo vea lo mismo.',
			summary: 'Problema o idea',
			errors: {
				empty: 'Cuéntanos en una o dos frases qué quieres resolver.',
			},
		},
		tipo: {
			label: '¿Qué tipo de solución buscas?',
			hint: 'Elige todas las que apliquen.',
			options: ['Plataforma web', 'App móvil', 'Sistema interno', 'Automatización', 'MVP o prototipo', 'Página web'],
			// Si se elige, las demás se desmarcan (y al revés)
			unsure: 'Aún no lo sé',
			detailLabel: '¿Algo más específico?',
			// Corto: en móvil el campo mide ~300px y el placeholder no se parte en líneas
			detailPlaceholder: 'Ej. Un portal para mis clientes',
			summary: 'Tipo de solución',
		},
		etapa: {
			label: '¿En qué etapa está tu proyecto?',
			hint: 'Elige la que más se parezca.',
			options: ['Solo es una idea', 'Tengo bocetos o diseño', 'Ya existe y quiero mejorarlo', 'Tengo fecha de lanzamiento'],
			plazoLabel: '¿Para cuándo lo necesitas?',
			plazoPlaceholder: 'Ej. En tres meses o sin prisa',
			summary: 'Etapa y plazo',
		},
		detalles: {
			label: '¿Algo más que debamos saber?',
			hint: 'Referencias que te gusten, sistemas que ya usas o un presupuesto aproximado. Todo ayuda.',
			placeholder: 'Ej. Nos gusta cómo funciona…, ya usamos un sistema de facturación, tenemos un presupuesto de…',
			summary: 'Detalles adicionales',
		},
	},

	submit: {
		label: 'Preparar correo',
		// Alternativas: 'Preparar solicitud' · 'Armar mi correo'
		note: 'Se abre tu app de correo con tus respuestas ordenadas. Tú lo revisas y lo envías.',
	},

	// Estado después de preparar el correo (respaldo por si no hay app de correo configurada)
	status: {
		title: 'Tu correo está listo',
		text: 'Abrimos tu app de correo con el mensaje armado. Revísalo y envíalo.',
		long: 'Tu mensaje es largo y algunas apps de correo lo recortan. Si no aparece completo, copia el resumen.',
		fallback: '¿No se abrió? Copia el resumen y pégalo en un correo nuevo para',
		copySummary: 'Copiar resumen',
		copySummaryDone: 'Resumen copiado',
		copyAddress: 'Copiar dirección',
		copyAddressDone: 'Dirección copiada',
		announceSummary: 'Resumen copiado. Pégalo en un correo nuevo.',
		announceAddress: 'Dirección copiada.',
		copyFailed: 'No pudimos copiar automáticamente. Selecciona el texto de abajo y cópialo.',
		manualLabel: 'Resumen del correo',
	},

	email: {
		subject: (correo: string) => `Nuevo proyecto a medida — ${correo}`,
		greeting: 'Hola, equipo de JuniorLabs:',
		opening: 'Les comparto mi proyecto.',
		closing: 'Gracias, quedo pendiente de su respuesta.',
		signature: 'Enviado desde juniorlabs.com.mx/proyectos',
		none: 'Sin especificar',
		detailPrefix: 'Más específico',
		plazoPrefix: 'Plazo',
	},
};

/**
 * Qué le falta al correo, en palabras de la persona ('' si está bien).
 * Más estricto que type="email" del navegador (que acepta «a@b»): pide dominio con terminación.
 */
export const emailIssue = (raw: string) => {
	const value = raw.trim();
	const e = brief.questions.correo.errors;
	if (!value) return e.empty;
	if (/\s/.test(value)) return e.spaces;

	const parts = value.split('@');
	if (parts.length === 1) return e.noAt;
	if (parts.length > 2) return e.manyAt;

	const [user, domain] = parts;
	if (!user) return e.noUser;
	if (!domain) return e.noDomain;

	const labels = domain.split('.');
	const tld = labels.at(-1) ?? '';
	// «empresa» o «empresa.» todavía no tienen terminación; «empresa.c» la tiene incompleta
	if (labels.length === 1 || tld.length < 2) return labels.slice(0, -1).some((l) => !l) ? e.badDomain : e.noTld;
	if (labels.some((label) => !/^[\p{L}\p{N}-]+$/u.test(label)) || !/^\p{L}{2,}$/u.test(tld)) return e.badDomain;
	return '';
};

export const isEmail = (value: string) => emailIssue(value) === '';

// Dominios comunes en México. También evitan sugerencias falsas (mail.com y ymail.com existen).
const COMMON_DOMAINS = [
	'gmail.com',
	'hotmail.com',
	'outlook.com',
	'yahoo.com',
	'yahoo.com.mx',
	'icloud.com',
	'live.com',
	'live.com.mx',
	'msn.com',
	'prodigy.net.mx',
	'hotmail.es',
	'outlook.es',
	'ymail.com',
	'mail.com',
	'aol.com',
	'gmx.com',
	'protonmail.com',
	'proton.me',
	'zoho.com',
];

// Terminaciones que no existen y casi siempre son «.com» mal tecleado
const TLD_TYPOS = /\.(con|cmo|cpm|vom|xom|comm|coom|ocm)$/;

/** Distancia de edición entre dos textos (cuántas letras hay que cambiar, quitar o poner). */
const editDistance = (a: string, b: string) => {
	let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
	for (let i = 1; i <= a.length; i++) {
		const row = [i];
		for (let j = 1; j <= b.length; j++) {
			row[j] = Math.min(prev[j] + 1, row[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
		}
		prev = row;
	}
	return prev[b.length];
};

/**
 * Sugerencia ante un error de dedo en el dominio: «nombre@gmial.com» → «nombre@gmail.com».
 * null si el dominio es conocido o no se parece lo suficiente a uno. No bloquea el envío.
 */
export const suggestEmail = (raw: string): string | null => {
	const value = raw.trim();
	const at = value.lastIndexOf('@');
	if (at < 1 || /\s/.test(value)) return null;

	const user = value.slice(0, at);
	const domain = value.slice(at + 1).toLowerCase();
	if (user.includes('@') || domain.length < 4 || COMMON_DOMAINS.includes(domain)) return null;

	let best = '';
	let bestDistance = Infinity;
	for (const known of COMMON_DOMAINS) {
		const distance = editDistance(domain, known);
		if (distance < bestDistance) {
			best = known;
			bestDistance = distance;
		}
	}
	// Dominios cortos solo admiten una letra de diferencia: con dos, «mi.com» se volvería otro
	if (bestDistance <= (domain.length < 8 ? 1 : 2)) return `${user}@${best}`;
	if (TLD_TYPOS.test(domain)) return `${user}@${domain.replace(TLD_TYPOS, '.com')}`;
	return null;
};

/** Saltos de línea de lo que escribe la persona: siempre \n (se convierten a CRLF solo en el mailto). */
const clean = (value: string) => value.replace(/\r\n?/g, '\n').trim();

/** Asunto y cuerpo del correo, con todas las preguntas y sus respuestas. */
export const buildEmail = (answers: BriefAnswers) => {
	const q = brief.questions;
	const e = brief.email;
	const a = { ...answers, idea: clean(answers.idea), detalles: clean(answers.detalles) };

	const sections: [string, string][] = [
		[q.correo.summary, a.correo],
		[q.idea.summary, a.idea],
		[
			q.tipo.summary,
			[a.tipos.join(', '), a.tipoDetalle && `${e.detailPrefix}: ${a.tipoDetalle}`].filter(Boolean).join('\n'),
		],
		[q.etapa.summary, [a.etapa, a.plazo && `${e.plazoPrefix}: ${a.plazo}`].filter(Boolean).join('\n')],
		[q.detalles.summary, a.detalles],
	];

	const body = [
		e.greeting,
		'',
		e.opening,
		'',
		...sections.flatMap(([title, value], i) => [`${i + 1}. ${title}`, value || e.none, '']),
		e.closing,
		'',
		'—',
		e.signature,
	].join('\n');

	return { subject: e.subject(a.correo), body };
};

/** Enlace mailto con asunto y cuerpo codificados (acentos, saltos de línea CRLF, &, ?, #…). */
export const mailtoHref = (to: string, { subject, body }: { subject: string; body: string }) =>
	`mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body.replace(/\n/g, '\r\n'))}`;

/** Texto para pegar a mano en Gmail, Outlook web, etc. */
export const summaryText = (to: string, { subject, body }: { subject: string; body: string }) =>
	`Para: ${to}\nAsunto: ${subject}\n\n${body}`;

/** Por arriba de este largo algunos clientes (Outlook de escritorio, por ejemplo) recortan el mailto. */
export const MAILTO_SAFE_LENGTH = 1900;
