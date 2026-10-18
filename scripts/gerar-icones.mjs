// Gera os ícones do app (tela inicial do celular e computador) a partir do favicon.
// Rodar de novo só se o favicon mudar: node scripts/gerar-icones.mjs
import sharp from 'sharp';
import { readFile } from 'node:fs/promises';

const FUNDO = '#EDEBE6';
const camisa = await readFile('public/favicon.svg');

// A camisa ocupa 62% do quadrado: cabe na área segura dos ícones "maskable",
// que o Android corta em círculo ou gota
async function icone(lado, arquivo) {
  const miolo = Math.round(lado * 0.62);
  const desenho = await sharp(camisa, { density: 600 }).resize(miolo, miolo, { fit: 'contain', background: '#0000' }).png().toBuffer();
  await sharp({ create: { width: lado, height: lado, channels: 4, background: FUNDO } })
    .composite([{ input: desenho, gravity: 'center' }])
    .png()
    .toFile(arquivo);
  console.log(arquivo);
}

await icone(192, 'public/icone-192.png');
await icone(512, 'public/icone-512.png');
// Para iPhone e iPad (o iOS arredonda os cantos sozinho)
await icone(180, 'public/apple-touch-icon.png');
