// Manifesto que deixa instalar o site como app ("Adicionar à tela inicial").
// Os caminhos respeitam a base, para funcionar também nas cópias dos amigos.
import { CONFIG } from '../config';
import { link } from '../lib/link';

export function GET() {
  const manifesto = {
    id: link(''),
    name: CONFIG.titulo,
    short_name: 'Armário',
    description: 'Coleção pessoal de camisas de futebol.',
    lang: 'pt-BR',
    start_url: link(''),
    scope: link(''),
    display: 'standalone',
    background_color: '#EDEBE6',
    theme_color: '#EDEBE6',
    icons: [
      { src: link('icone-192.png'), sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: link('icone-512.png'), sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: link('icone-512.png'), sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    // Atalhos que aparecem ao segurar o ícone do app
    shortcuts: [
      { name: 'Grade', url: link('grade/') },
      { name: 'Mapa', url: link('mapa/') },
      { name: 'Desejos', url: link('desejos/') },
      { name: 'Cadastrar camisa', short_name: 'Cadastrar', url: link('admin/') },
    ],
  };
  return new Response(JSON.stringify(manifesto, null, 2), {
    headers: { 'Content-Type': 'application/manifest+json' },
  });
}
