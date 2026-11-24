/**
 * Recuadros del Bento Grid de /productos.
 *
 * Hoy todos están bloqueados. Para publicar un producto se cambia su recuadro a `status: 'disponible'`
 * y se llenan name, description y href (image es opcional). El tamaño y el orden del arreglo definen
 * la composición: en escritorio son 4 columnas y las piezas deben llenar filas completas
 * (hero 2×2, tall 1×2, wide 2×1, square 1×1).
 */
import type { ImageMetadata } from 'astro';

/** Lugar que ocupa el recuadro en la cuadrícula de escritorio. */
export type BentoSize = 'hero' | 'tall' | 'wide' | 'square';

/** Silueta difuminada que sugiere un tipo de software sin mostrarlo. */
export type ProductoSilueta = 'panel' | 'lista' | 'grafica' | 'calendario' | 'formulario' | 'mensajes';

interface SlotBase {
	/** Identificador estable (key del recuadro). */
	id: string;
	size: BentoSize;
	silhouette: ProductoSilueta;
}

/** Recuadro sin publicar: solo candado y estado. */
export interface ProductoBloqueado extends SlotBase {
	status: 'en-desarrollo' | 'proximamente';
}

/** Producto publicado: reemplaza al recuadro bloqueado en el mismo lugar de la cuadrícula. */
export interface ProductoDisponible extends SlotBase {
	status: 'disponible';
	name: string;
	description: string;
	href: string;
	/** Captura o imagen del producto (src/assets). Sin imagen, se ve la silueta. */
	image?: { src: ImageMetadata; alt: string };
}

export type ProductoSlot = ProductoBloqueado | ProductoDisponible;

export const statusLabel = {
	'en-desarrollo': 'En desarrollo',
	proximamente: 'Próximamente',
	disponible: 'Disponible',
} satisfies Record<ProductoSlot['status'], string>;

export const upcomingProducts = [
	// El que estamos construyendo hoy («Hoy estamos construyendo el primero»)
	{ id: 'producto-1', size: 'hero', status: 'en-desarrollo', silhouette: 'panel' },
	{ id: 'producto-2', size: 'tall', status: 'proximamente', silhouette: 'lista' },
	{ id: 'producto-3', size: 'square', status: 'proximamente', silhouette: 'grafica' },
	{ id: 'producto-4', size: 'square', status: 'proximamente', silhouette: 'calendario' },
	{ id: 'producto-5', size: 'wide', status: 'proximamente', silhouette: 'formulario' },
	{ id: 'producto-6', size: 'wide', status: 'proximamente', silhouette: 'mensajes' },
] satisfies ProductoSlot[];
