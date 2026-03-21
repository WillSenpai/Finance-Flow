import fs from 'node:fs';
import path from 'node:path';

const sourcePath = path.resolve('docs/PRD.md');
const outputRoot = path.resolve('docs/prd');

const raw = fs.readFileSync(sourcePath, 'utf8');
const lines = raw.split(/\r?\n/);

const normalize = (s) =>
  s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();

const titleLine = lines.find((l) => l.startsWith('# ')) || '# PRD';
const sections = [];
let currentSection = null;
let currentElement = null;
let currentItem = null;

const finalizeItem = () => {
  if (currentItem && currentElement) {
    currentElement.items.push(currentItem);
  }
  currentItem = null;
};

const finalizeElement = () => {
  finalizeItem();
  if (currentElement && currentSection) {
    currentSection.elements.push(currentElement);
  }
  currentElement = null;
};

for (const line of lines) {
  const sectionMatch = line.match(/^##\s+(\d+)\.\s+(.+)$/);
  if (sectionMatch) {
    finalizeElement();
    const [, number, title] = sectionMatch;
    currentSection = {
      number: Number(number),
      title: title.trim(),
      elements: [],
    };
    sections.push(currentSection);
    continue;
  }

  if (!currentSection) {
    continue;
  }

  const elementMatch = line.match(/^-\s+\*\*(.+?)\*\*:\s*(.*)$/);
  if (elementMatch) {
    finalizeElement();
    const [, title, rest] = elementMatch;
    currentElement = {
      title: title.trim(),
      intro: rest ? rest.trim() : '',
      body: [],
      items: [],
    };
    continue;
  }

  if (!currentElement) {
    continue;
  }

  const itemMatch = line.match(/^\s{2}-\s+(.+)$/);
  if (itemMatch) {
    finalizeItem();
    currentItem = {
      title: itemMatch[1].trim(),
      details: [],
    };
    continue;
  }

  if (currentItem) {
    if (line.match(/^\s{4}-\s+(.+)$/)) {
      currentItem.details.push(line.trim());
      continue;
    }
    if (line.trim() === '') {
      currentItem.details.push('');
      continue;
    }
    if (line.match(/^\s{2}[^-\s].+$/)) {
      currentItem.details.push(line.trim());
      continue;
    }
  }

  currentElement.body.push(line);
}

finalizeElement();

fs.rmSync(outputRoot, { recursive: true, force: true });
fs.mkdirSync(outputRoot, { recursive: true });

const indexLines = [];
indexLines.push('# PRD Modulare - My Money Compass');
indexLines.push('');
indexLines.push(`Sorgente: \`${path.relative(process.cwd(), sourcePath)}\`.`);
indexLines.push('Questa cartella contiene il PRD suddiviso per sezione ed elemento in file separati, con naming semantico.');
indexLines.push('');
indexLines.push('## Mappa');
indexLines.push('');

for (const section of sections) {
  const sectionSlug = `${String(section.number).padStart(2, '0')}-${normalize(section.title)}`;
  const sectionDir = path.join(outputRoot, sectionSlug);
  fs.mkdirSync(sectionDir, { recursive: true });

  const sectionOverview = [
    `# ${section.number}. ${section.title}`,
    '',
    'Elementi inclusi:',
    ...section.elements.map((e, i) => `- ${(i + 1).toString().padStart(2, '0')}. ${e.title}`),
    '',
  ].join('\n');

  fs.writeFileSync(path.join(sectionDir, '00-section-overview.prd.md'), sectionOverview);

  indexLines.push(`- ${section.number}. ${section.title}: \`${sectionSlug}/\``);

  for (let i = 0; i < section.elements.length; i += 1) {
    const element = section.elements[i];
    const elementPrefix = String(i + 1).padStart(2, '0');
    const elementSlug = `${elementPrefix}-${normalize(element.title)}`;
    const elementFile = `${elementSlug}.prd.md`;

    const elementLines = [];
    elementLines.push(`# ${section.number}.${i + 1} ${element.title}`);
    elementLines.push('');
    if (element.intro) {
      elementLines.push(element.intro);
      elementLines.push('');
    }

    const cleanedBody = element.body
      .map((l) => l.replace(/^\s+$/, ''))
      .join('\n')
      .trim();

    if (cleanedBody) {
      elementLines.push(cleanedBody);
      elementLines.push('');
    }

    if (element.items.length > 0) {
      elementLines.push('Elementi collegati:');
      for (let j = 0; j < element.items.length; j += 1) {
        const item = element.items[j];
        const itemFile = `${String(j + 1).padStart(2, '0')}-${normalize(item.title)}.prd.md`;
        elementLines.push(`- [${item.title}](./${elementSlug}/${itemFile})`);
      }
      elementLines.push('');

      const elementItemsDir = path.join(sectionDir, elementSlug);
      fs.mkdirSync(elementItemsDir, { recursive: true });

      for (let j = 0; j < element.items.length; j += 1) {
        const item = element.items[j];
        const itemFile = `${String(j + 1).padStart(2, '0')}-${normalize(item.title)}.prd.md`;
        const itemLines = [];
        itemLines.push(`# ${section.number}.${i + 1}.${j + 1} ${item.title}`);
        itemLines.push('');
        if (item.details.length > 0) {
          for (const detail of item.details) {
            if (detail === '') {
              itemLines.push('');
            } else if (detail.startsWith('- ')) {
              itemLines.push(detail);
            } else {
              itemLines.push(`- ${detail}`);
            }
          }
          itemLines.push('');
        }

        fs.writeFileSync(path.join(elementItemsDir, itemFile), itemLines.join('\n'));
      }
    }

    fs.writeFileSync(path.join(sectionDir, elementFile), elementLines.join('\n'));
  }
}

const projectStructureFile = path.join(outputRoot, '00-project-structure-analysis.prd.md');
const projectStructure = [
  '# Analisi Struttura Progetto',
  '',
  'Estratto sintetico della struttura utile al contesto PRD:',
  '- App frontend: `src/` (React + TypeScript + Vite).',
  '- Native shell: `ios/`, `android/` (Capacitor).',
  '- Backend e database: `supabase/` + migrazioni/query in `docs/sql/`.',
  '- Documentazione: `docs/` con PRD principale in `docs/PRD.md` e piani specifici in `docs/plans/`.',
  '- Config/build: root (`vite.config.ts`, `tailwind.config.ts`, `package.json`).',
  '',
  'Obiettivo di questa modularizzazione: ridurre la frizione di ricerca e consentire deep-link diretti a sezione/elemento del PRD.',
  '',
].join('\n');
fs.writeFileSync(projectStructureFile, projectStructure);

indexLines.push('');
indexLines.push(`- Analisi struttura progetto: \`00-project-structure-analysis.prd.md\``);
indexLines.push('');
indexLines.push('## Metadati');
indexLines.push('');
indexLines.push(`- Documento sorgente: ${titleLine.replace(/^#\s+/, '')}`);
indexLines.push(`- Sezioni rilevate: ${sections.length}`);
indexLines.push(
  `- Elementi rilevati: ${sections.reduce((acc, s) => acc + s.elements.length, 0)}`
);
indexLines.push(
  `- Elementi dettagliati (file dedicati): ${sections.reduce((acc, s) => acc + s.elements.reduce((sum, e) => sum + e.items.length, 0), 0)}`
);

fs.writeFileSync(path.join(outputRoot, '00-index.prd.md'), indexLines.join('\n'));

console.log(`Created modular PRD in ${path.relative(process.cwd(), outputRoot)}`);
