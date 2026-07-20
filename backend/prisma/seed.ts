import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Create Admin user
  const hashedPassword = await bcrypt.hash('password123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@coreloopnews.com' },
    update: {},
    create: {
      email: 'admin@coreloopnews.com',
      name: 'Alex Mercer',
      password: hashedPassword,
      role: 'ADMIN', // Handled as string for SQLite compatibility
    },
  });

  // 2. Create Categories
  const categories = [
    { name: 'Reviews', slug: 'reviews' },
    { name: 'eSports', slug: 'esports' },
    { name: 'Lançamentos', slug: 'lancamentos' },
    { name: 'Hardware', slug: 'hardware' },
  ];

  const categoryMap: { [key: string]: any } = {};

  for (const cat of categories) {
    const createdCat = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    categoryMap[cat.slug] = createdCat;
  }

  // 3. Create Settings
  const settings = [
    { key: 'site_name', value: 'Core Loop News' },
    {
      key: 'site_description',
      value: 'O seu portal definitivo de notícias, análises e coberturas de eSports do mundo dos games.',
    },
    { key: 'contact_email', value: 'contato@coreloopnews.com' },
    {
      key: 'social_links',
      value: JSON.stringify([
        { platform: 'twitter', url: 'https://x.com/coreloopnews' },
        { platform: 'youtube', url: 'https://youtube.com/coreloopnews' },
        { platform: 'instagram', url: 'https://instagram.com/coreloopnews' },
      ]),
    },
    {
      key: 'footer_links',
      value: JSON.stringify([
        { title: 'Quem Somos', url: '/sobre' },
        { title: 'Anuncie Conosco', url: '/anuncie' },
        { title: 'Fale Conosco', url: '/contato' },
      ]),
    },
  ];

  for (const set of settings) {
    await prisma.setting.upsert({
      where: { key: set.key },
      update: { value: set.value },
      create: set,
    });
  }

  // 4. Create Articles
  
  // GTA 6 (Lançamentos - Featured)
  await prisma.article.upsert({
    where: { slug: 'gta-6-gameplay-trailer-analise' },
    update: {},
    create: {
      title: 'GTA 6: Análise Completa de Detalhes do Novo Trailer e Data de Lançamento',
      slug: 'gta-6-gameplay-trailer-analise',
      excerpt: 'Analisamos quadro a quadro o novo trailer explosivo de GTA 6. Descubra segredos de Vice City, novas mecânicas de gameplay e vazamentos confirmados.',
      content: `
        <h2>O Retorno Triunfal a Vice City</h2>
        <p>Após anos de expectativa, a Rockstar Games finalmente revelou novas imagens do aguardado Grand Theft Auto VI. O trailer nos transporta de volta a uma Vice City moderna e vibrante, repleta de sátira social e detalhes gráficos impressionantes.</p>
        
        <blockquote>"GTA 6 representa o maior salto geracional já tentado pela Rockstar Games, ultrapassando os limites do fotorrealismo e inteligência artificial de NPCs."</blockquote>
        
        <h2>Assista ao Trailer Oficial</h2>
        <div class="video-container">
            <iframe src="https://www.youtube.com/embed/QdBZY2fkU-0" title="GTA VI Trailer 1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>

        <h2>Mecânicas de Dupla Protagonista</h2>
        <p>O foco narrativo está na dinâmica de Lucia e Jason, um casal no estilo Bonnie e Clyde. Jogadores poderão alternar entre eles dinamicamente para planejar roubos e explorar o vasto estado de Leonida.</p>
      `,
      coverImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop',
      status: 'PUBLISHED', // SQLite string enum emulation
      publishedAt: new Date(),
      categoryId: categoryMap['lancamentos'].id,
      authorId: admin.id,
    },
  });

  // Elden Ring (Reviews)
  await prisma.article.upsert({
    where: { slug: 'elden-ring-shadow-erdtree-review' },
    update: {
      coverImage: 'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?q=80&w=1200&auto=format&fit=crop'
    },
    create: {
      title: 'Elden Ring: Shadow of the Erdtree - Vale a pena jogar a nova DLC?',
      slug: 'elden-ring-shadow-erdtree-review',
      excerpt: 'Uma jornada impiedosa pela Terra das Sombras. Confira nossa análise detalhada da expansão de Elden Ring.',
      content: `
        <h2>A Dificuldade Redefinida</h2>
        <p>Shadow of the Erdtree não é apenas um add-on. É uma expansão colossal que rivaliza com o tamanho de muitos jogos completos. A FromSoftware entrega um level design espetacular e lutas de chefes que testarão a sanidade até dos jogadores mais veteranos.</p>
        
        <blockquote>"Uma obra-prima de design de níveis verticais and ambientação sombria."</blockquote>

        <h2>Novas Armas e Estilos de Luta</h2>
        <p>Com mais de 8 novas categorias de armas, incluindo garras de artes marciais e frascos de perfume explosivos, o combate ganhou uma variedade nunca antes vista no game original.</p>
      `,
      coverImage: 'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?q=80&w=1200&auto=format&fit=crop',
      status: 'PUBLISHED',
      publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      categoryId: categoryMap['reviews'].id,
      authorId: admin.id,
    },
  });

  // Worlds (eSports)
  await prisma.article.upsert({
    where: { slug: 'mundial-league-of-legends-2026-resultados' },
    update: {},
    create: {
      title: 'Mundial de League of Legends: Grande Final Quebra Recordes de Audiência',
      slug: 'mundial-league-of-legends-2026-resultados',
      excerpt: 'Faker e a T1 consagram-se campeões mundiais mais uma vez em uma série eletrizante contra as equipes chinesas da LPL.',
      content: `
        <h2>Uma Final Para a História</h2>
        <p>O confronto decisivo do Worlds reuniu mais de 6 milhões de espectadores simultâneos nas plataformas de streaming. A série de cinco jogos eletrizantes provou por que o League of Legends continua sendo o maior eSport do planeta.</p>
        
        <blockquote>"A resiliência da T1 em momentos de extrema pressão consolida Faker como o maior jogador de todos os tempos indiscutivelmente."</blockquote>

        <h2>O Draft Decisivo</h2>
        <p>No quinto jogo, escolhas arrojadas na rota inferior garantiram a vantagem tática necessária para a T1 vencer as lutas na selva e garantir o barão decisivo.</p>
      `,
      coverImage: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=1200&auto=format&fit=crop',
      status: 'PUBLISHED',
      publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      categoryId: categoryMap['esports'].id,
      authorId: admin.id,
    },
  });

  // Hardware RTX 5090
  await prisma.article.upsert({
    where: { slug: 'rtx-5090-especificacoes-vazamento' },
    update: {},
    create: {
      title: 'RTX 5090: Especificações Vazadas Apontam Monstro de Desempenho para 4K',
      slug: 'rtx-5090-especificacoes-vazamento',
      excerpt: 'Novos vazamentos da arquitetura de próxima geração da Nvidia revelam consumo energético e quantidade massiva de VRAM.',
      content: `
        <h2>Arquitetura Blackwell em Ação</h2>
        <p>Fontes confiáveis da indústria de semicondutores revelaram as possíveis especificações da futura RTX 5090. A GPU promete ser o maior salto geracional em traçado de raio (Ray Tracing) já registrado.</p>
        
        <blockquote>"Desempenho projetado pode ser até 50% superior ao da RTX 4090 em renderização híbrida."</blockquote>

        <h2>Especificações Esperadas</h2>
        <ul>
            <li>VRAM: 32GB GDDR7</li>
            <li>Interface de Memória: 512-bit</li>
            <li>Consumo Estimado: 600W</li>
        </ul>
      `,
      coverImage: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=1200&auto=format&fit=crop',
      status: 'PUBLISHED',
      publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      categoryId: categoryMap['hardware'].id,
      authorId: admin.id,
    },
  });

  console.log('Seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
