/**
 * Parte un texto para enlazar una de sus palabras al correo (mailto).
 * Si la palabra no aparece (p. ej. Marketing cambió el copy), el build falla en vez de perder el enlace en silencio.
 */
export const splitContactWord = (text: string, contactWord: string | undefined, where: string) => {
	if (!contactWord) return { before: text, word: '', after: '' };
	const body = text.normalize('NFC');
	const word = contactWord.normalize('NFC');
	const at = body.lastIndexOf(word);
	if (at === -1) {
		throw new Error(`${where}: «${word}» no aparece en el texto; no se puede enlazar al correo.`);
	}
	return { before: body.slice(0, at), word, after: body.slice(at + word.length) };
};
