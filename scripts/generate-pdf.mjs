import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from 'node:fs';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { tmpdir } from 'node:os';
import { marked } from 'marked';

const execFileAsync = promisify(execFile);
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const mdPath = join(root, 'docs', 'GDD.md');
const htmlPath = join(root, 'docs', 'GDD.html');
const pdfPath = join(root, 'docs', 'GDD.pdf');

const markdown = readFileSync(mdPath, 'utf8');
const withoutTitle = markdown
  .replace(/^#\s+.*\r?\n/, '')
  .replace(/\n---\s*\n\*Mini GDD[\s\S]*$/, '\n');
const body = marked.parse(withoutTitle, { gfm: true });

const month = new Date().toLocaleDateString('es-AR', { month: 'long', year: 'numeric' });
const coverDate = month.charAt(0).toUpperCase() + month.slice(1);

const html = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<title>Brasa — El último fuego · Mini GDD</title>
<style>
  @page { size: A4; margin: 17mm 16mm 18mm; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body {
    font-family: "Segoe UI", Arial, sans-serif;
    font-size: 11pt;
    line-height: 1.55;
    color: #1f2933;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .cover {
    min-height: 255mm;
    display: flex;
    flex-direction: column;
    justify-content: center;
    page-break-after: always;
    padding: 0 6mm;
  }
  .kicker {
    font-size: 10pt;
    letter-spacing: 4px;
    color: #b45309;
    font-weight: 600;
    margin-bottom: 14mm;
  }
  .cover-title {
    font-family: Georgia, "Times New Roman", serif;
    font-size: 86pt;
    line-height: 0.95;
    letter-spacing: 6px;
    color: #0f172a;
    margin: 0;
  }
  .cover-sub {
    font-family: Georgia, serif;
    font-size: 24pt;
    letter-spacing: 7px;
    text-transform: uppercase;
    color: #b45309;
    margin-top: 5mm;
  }
  .cover-rule {
    width: 42mm;
    height: 3px;
    background: #f59e0b;
    margin: 12mm 0 10mm;
  }
  .cover-desc {
    font-family: Georgia, serif;
    font-style: italic;
    font-size: 15pt;
    color: #475569;
    max-width: 130mm;
    margin: 0 0 22mm;
  }
  .cover-meta {
    border-top: 1px solid #cbd5e1;
    padding-top: 8mm;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 5mm 12mm;
    max-width: 165mm;
    font-size: 10.5pt;
  }
  .cover-meta div { color: #334155; }
  .cover-meta span {
    display: block;
    font-size: 8pt;
    letter-spacing: 1.6px;
    text-transform: uppercase;
    color: #94a3b8;
    margin-bottom: 1.5mm;
  }

  h1, h2, h3, h4 {
    font-family: Georgia, "Times New Roman", serif;
    color: #0f172a;
    line-height: 1.2;
    break-after: avoid;
  }
  h2 {
    font-size: 19pt;
    margin: 26px 0 10px;
    padding-bottom: 5px;
    border-bottom: 2px solid #f59e0b;
  }
  h2.first { margin-top: 0; }
  h3 {
    font-size: 14pt;
    margin: 20px 0 6px;
    color: #7c2d12;
  }
  h4 { font-size: 12pt; margin: 16px 0 4px; }
  p { margin: 0 0 9px; }
  strong { color: #0f172a; }
  a { color: #b45309; text-decoration: none; }
  ul, ol { margin: 4px 0 12px; padding-left: 22px; }
  li { margin: 3px 0; }
  hr { border: 0; border-top: 1px solid #e2e8f0; margin: 22px 0; }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 8px 0 16px;
    font-size: 9.8pt;
    break-inside: avoid;
  }
  th, td {
    border: 1px solid #cbd5e1;
    padding: 6px 8px;
    text-align: left;
    vertical-align: top;
  }
  th {
    background: #f1f5f9;
    color: #0f172a;
    font-weight: 600;
  }
  tr:nth-child(even) td { background: #f8fafc; }

  code {
    font-family: Consolas, "Courier New", monospace;
    font-size: 9.6pt;
    background: #f1f5f9;
    color: #9a3412;
    padding: 1px 4px;
    border-radius: 3px;
  }
  pre {
    background: #0f172a;
    color: #e2e8f0;
    padding: 12px 14px;
    border-radius: 6px;
    overflow-wrap: anywhere;
    white-space: pre-wrap;
    break-inside: avoid;
  }
  pre code { background: none; color: inherit; padding: 0; }
  blockquote {
    margin: 12px 0;
    padding: 8px 14px;
    border-left: 4px solid #f59e0b;
    background: #fffbeb;
    color: #57534e;
  }
  input[type="checkbox"] { margin-right: 6px; }
  .signature {
    margin-top: 30px;
    padding-top: 12px;
    border-top: 1px solid #e2e8f0;
    font-size: 9pt;
    color: #94a3b8;
  }
  @media print {
    h2 { page-break-after: avoid; }
    table, pre, blockquote { page-break-inside: avoid; }
  }
</style>
</head>
<body>
  <section class="cover">
    <div class="kicker">TRABAJO PRÁCTICO · MÓDULO 7</div>
    <h1 class="cover-title">BRASA</h1>
    <div class="cover-sub">El último fuego</div>
    <div class="cover-rule"></div>
    <p class="cover-desc">Plataformas 2D donde el calor es vida, luz y munición.</p>
    <div class="cover-meta">
      <div><span>Materia</span>Desarrollo Tecnológico 2</div>
      <div><span>Stack</span>JavaScript · Node.js · Vite · Phaser 3</div>
      <div><span>Equipo</span>Santiago Tornau</div>
      <div><span>Fecha</span>${coverDate}</div>
    </div>
  </section>

  <main>
    <h2 class="first">Ficha del proyecto</h2>
    ${body}
  </main>
</body>
</html>`;

writeFileSync(htmlPath, html, 'utf8');
console.log(`HTML generado: ${htmlPath}`);

const candidates = [
  process.env.EDGE_PATH,
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
].filter(Boolean);

const browser = candidates.find((candidate) => existsSync(candidate));
if (!browser) {
  console.error('No se encontró Edge/Chrome. Instalá uno o definí EDGE_PATH.');
  process.exit(1);
}

const profileDir = join(tmpdir(), 'brasa-pdf-profile');
mkdirSync(profileDir, { recursive: true });

const args = [
  '--headless=new',
  '--disable-gpu',
  '--no-first-run',
  '--no-default-browser-check',
  '--no-pdf-header-footer',
  '--disable-extensions',
  `--user-data-dir=${profileDir}`,
  `--print-to-pdf=${pdfPath}`,
  pathToFileURL(htmlPath).href
];

try {
  const { stderr } = await execFileAsync(browser, args, { timeout: 90_000, windowsHide: true });
  if (stderr && !/DevTools listening/i.test(stderr)) {
    console.log(stderr.trim());
  }
} catch (error) {
  console.error('Falló la impresión a PDF:', error.message);
  process.exit(1);
}

if (!existsSync(pdfPath) || statSync(pdfPath).size < 1000) {
  console.error('El PDF no se generó correctamente.');
  process.exit(1);
}

const kb = (statSync(pdfPath).size / 1024).toFixed(1);
console.log(`PDF generado: ${pdfPath} (${kb} KB)`);
