import fs from 'node:fs';
import path from 'node:path';
import { marked } from 'marked';

export interface PrompterTab {
  id: string;
  title: string;
  html: string;
}

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

export const APP_BASE = (import.meta.env.BASE_URL ?? '').replace(/\/$/, '');

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

const MODULE_METADATA: Record<string, { description: string; speaker: string }> = {
  'modelo-canvas': {
    description: 'Diagnóstico de fricciones en e-commerce, propuesta de valor D2C y lienzo de 9 bloques.',
    speaker: 'Juani'
  },
  'estrategia-de-mercado': {
    description: 'Datos CACE, diferenciación Porter, FODA cruzado y balance de catálogo en Matriz BCG.',
    speaker: 'Juan M.'
  },
  'tecnologia-y-plataforma': {
    description: 'Plataforma propia React 19 + Firestore vs WooCommerce, latencia <1,2s y 85% ahorro en cloud.',
    speaker: 'Juani'
  },
  'marco-legal-y-gantt': {
    description: 'Sociedad por Acciones Simplificada (Ley 27.349), blindaje patrimonial y Gantt de 8 semanas.',
    speaker: 'Juani & Juan M.'
  },
  'costos-laborales-y-logistica': {
    description: 'Nómina formal (5 dependientes), factor multiplicador de cargas (1,48x) y alianza Fulfillment Full.',
    speaker: 'Fer & Juan M.'
  },
  'evaluacion-financiera': {
    description: 'Capex inicial ($7,25M autofinanciado), Punto de Equilibrio y proyección neta a 12 meses (+$52M).',
    speaker: 'Fer'
  }
};

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
    const meta = MODULE_METADATA[folderId] ?? {
      description: `Defensa temática y análisis cuantitativo del módulo ${folderTitle}.`,
      speaker: 'Equipo'
    };

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
        url: `${APP_BASE}/galeria/${dir.name}/${file.name}`,
        // Nombre de transición único y consistente en cualquier vista:
        transitionName: `view-${folderId}-${itemId}`
      };
    });

    folders.push({
      id: folderId,
      title: folderTitle,
      description: meta.description,
      themeColor: THEME_COLORS[index % THEME_COLORS.length],
      items
    });
  });

  return folders;
}

export function getPlaylist(folders: GalleryFolder[]): string[] {
  const routes: string[] = [APP_BASE || '/'];
  for (const folder of folders) {
    // 1. Entra a la caja/módulo (vista de grilla general)
    routes.push(`${APP_BASE}/modulo/${folder.id}`);
    
    // 2. Muestra Card 1, Card 2, Card 3... en pantalla completa consecutivamente
    for (const item of folder.items) {
      routes.push(`${APP_BASE}/pantalla/${folder.id}/${item.id}`);
    }
  }
  return routes;
}

export function getPrompterData(): PrompterTab[] {
  const filePath = path.resolve('./material/guion_comercial_juanfer_shop.md');
  if (!fs.existsSync(filePath)) {
    return [];
  }

  const raw = fs.readFileSync(filePath, 'utf-8');
  // Dividir por bloques: ### [TAB:id] Titulo de pestaña
  const tabRegex = /###\s*\[TAB:([a-zA-Z0-9_-]+)\]\s*([^\n]+)/g;
  const matches = [...raw.matchAll(tabRegex)];

  if (matches.length === 0) {
    // Si no tiene tags, devolver todo como una sola pestaña general
    return [{ id: 'general', title: 'Guión General', html: marked.parse(raw) as string }];
  }

  const tabs: PrompterTab[] = [];

  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const tabId = match[1];
    const tabTitle = match[2].trim();
    const startIndex = match.index! + match[0].length;
    const nextMatch = matches[i + 1];
    const endIndex = nextMatch ? nextMatch.index! : raw.length;

    let contentMd = raw.slice(startIndex, endIndex).trim();
    // Limpieza de divisores markdown al final del bloque si existen
    contentMd = contentMd.replace(/---\s*$/, '').trim();

    // Reemplazos estéticos opcionales para cajas de pase de micrófono
    contentMd = contentMd.replace(/:::cue([\s\S]*?):::/g, '<div class="prompter-cue">$1</div>');

    const html = marked.parse(contentMd) as string;

    tabs.push({
      id: tabId,
      title: tabTitle,
      html
    });
  }

  return tabs;
}
