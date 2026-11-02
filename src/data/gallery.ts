import fs from 'node:fs';
import path from 'node:path';

export interface GalleryItem {
  id: string;          // e.g. "listado"
  title: string;       // e.g. "Listado"
  file: string;        // e.g. "listado.jpg"
  url: string;         // e.g. "/galeria/alumnos/listado.jpg"
  transitionName: string; // Deterministic transition name: "img-alumnos-listado"
}

export interface GalleryFolder {
  id: string;          // e.g. "alumnos"
  title: string;       // e.g. "Alumnos"
  description: string;
  themeColor: string;
  items: GalleryItem[];
}

const THEME_COLORS = [
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ec4899', // pink
  '#06b6d4', // cyan
];

const VALID_IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.svg', '.avif', '.gif']);

function formatTitle(rawName: string): string {
  // Quita prefijos numéricos opcionales: "01-alumnos" -> "alumnos"
  const cleaned = rawName.replace(/^\d+[-_ ]*/, '');
  // Reemplaza guiones y guiones bajos por espacios y capitaliza cada palabra
  return cleaned
    .replace(/[-_]+/g, ' ')
    .trim()
    .replace(/\b\w/g, char => char.toUpperCase());
}

function sanitizeId(rawName: string): string {
  return rawName
    .toLowerCase()
    .replace(/^\d+[-_ ]*/, '')
    .replace(/[^a-z0-9_-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function getGalleryData(): GalleryFolder[] {
  const galeriaDir = path.resolve('./public/galeria');
  
  if (!fs.existsSync(galeriaDir)) {
    return [];
  }

  const entries = fs.readdirSync(galeriaDir, { withFileTypes: true });
  // Solo subdirectorios (padres)
  const folderEntries = entries
    .filter(dirent => dirent.isDirectory() && !dirent.name.startsWith('.'))
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

  const folders: GalleryFolder[] = [];

  folderEntries.forEach((dir, index) => {
    const folderPath = path.join(galeriaDir, dir.name);
    const folderId = sanitizeId(dir.name) || `folder-${index + 1}`;
    const folderTitle = formatTitle(dir.name);

    const fileEntries = fs.readdirSync(folderPath, { withFileTypes: true });
    const imageFiles = fileEntries
      .filter(f => f.isFile() && !f.name.startsWith('.') && VALID_IMAGE_EXTENSIONS.has(path.extname(f.name).toLowerCase()))
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

    const items: GalleryItem[] = imageFiles.map((file) => {
      const ext = path.extname(file.name);
      const baseName = path.basename(file.name, ext);
      const itemId = sanitizeId(baseName);
      
      return {
        id: itemId,
        title: formatTitle(baseName),
        file: file.name,
        url: `${import.meta.env.BASE_URL.replace(/\/$/, '')}/galeria/${dir.name}/${file.name}`,
        // Nombre de transición único y consistente en cualquier vista:
        transitionName: `view-${folderId}-${itemId}`
      };
    });

    folders.push({
      id: folderId,
      title: folderTitle,
      description: `Módulo ${folderTitle} - ${items.length} vistas disponibles.`,
      themeColor: THEME_COLORS[index % THEME_COLORS.length],
      items
    });
  });

  return folders;
}

export function getPlaylist(folders: GalleryFolder[]): string[] {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const routes: string[] = [base || '/'];
  for (const folder of folders) {
    const moduloUrl = `${base}/modulo/${folder.id}`;
    // 1. Entra al módulo padre
    routes.push(moduloUrl);
    
    // 2. Por cada hijo: entra al detalle en zoom y luego vuelve al padre para mostrar la grilla antes del siguiente hijo
    for (const item of folder.items) {
      routes.push(`${base}/pantalla/${folder.id}/${item.id}`);
      routes.push(moduloUrl);
    }
  }
  return routes;
}
