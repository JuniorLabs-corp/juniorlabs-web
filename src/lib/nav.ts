/**
 * ¿El enlace apunta a la página actual? Lo usan la navbar y el footer para `aria-current="page"`.
 * Solo cuenta enlaces a páginas (no a anclas como /#que-hacemos). '/productos' y '/productos/' son la misma página.
 */
const normalize = (path: string) => (path.length > 1 ? path.replace(/\/$/, '') : path);

export const isCurrentPage = (href: string, pathname: string) =>
	!href.includes('#') && normalize(href) === normalize(pathname);
