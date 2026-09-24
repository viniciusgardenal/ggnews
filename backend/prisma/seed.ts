import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding pure Games/Videogames NEXUS database...');

  // 1. Create Admin user
  const hashedPassword = await bcrypt.hash('password123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@nexuswire.gg' },
    update: {
      name: 'Redação NEXUS',
      password: hashedPassword,
      role: 'ADMIN',
    },
    create: {
      email: 'admin@nexuswire.gg',
      name: 'Redação NEXUS',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  await prisma.user.upsert({
    where: { email: 'admin@coreloopnews.com' },
    update: {
      password: hashedPassword,
      name: 'Redação NEXUS',
      role: 'ADMIN',
    },
    create: {
      email: 'admin@coreloopnews.com',
      name: 'Redação NEXUS',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  // 2. Remove any legacy hardware / esports / tech articles
  try {
    await prisma.article.deleteMany({
      where: {
        slug: {
          in: [
            'rtx-5090-especificacoes-vazamento',
            'mundial-league-of-legends-2026-resultados',
          ],
        },
      },
    });
  } catch (e) {}

  // 3. Define 100% Games categories
  const categoriesToCreate = [
    { name: 'Games', slug: 'games' },
    { name: 'PlayStation', slug: 'playstation' },
    { name: 'Xbox', slug: 'xbox' },
    { name: 'Nintendo', slug: 'nintendo' },
    { name: 'PC Gaming', slug: 'pc-gaming' },
    { name: 'Reviews', slug: 'reviews' },
    { name: 'Lançamentos', slug: 'lancamentos' },
  ];

  const categoryMap: { [key: string]: any } = {};

  for (const cat of categoriesToCreate) {
    const createdCat = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name },
      create: cat,
    });
    categoryMap[cat.slug] = createdCat;
  }

  // Delete legacy categories no longer in use
  try {
    await prisma.category.deleteMany({
      where: {
        slug: { in: ['hardware', 'tecnologia', 'esports', 'cyberspace'] },
      },
    });
  } catch (e) {}

  // 4. Clean Pure Games Settings
  const settings = [
    { key: 'site_name', value: 'NEXUS' },
    {
      key: 'site_description',
      value: 'O seu portal definitivo sobre games, consoles, análises e lançamentos do universo dos videogames.',
    },
    { key: 'contact_email', value: 'contato@nexus.gg' },
    {
      key: 'social_links',
      value: JSON.stringify([
        { platform: 'twitter', url: 'https://x.com/nexus' },
        { platform: 'youtube', url: 'https://youtube.com/nexus' },
        { platform: 'instagram', url: 'https://instagram.com/nexus' },
        { platform: 'discord', url: 'https://discord.gg/nexus' },
      ]),
    },
    {
      key: 'footer_links',
      value: JSON.stringify([
        { title: 'Sobre Nós', url: '/sobre' },
        { title: 'Contato', url: '/contato' },
        { title: 'Anuncie Conosco', url: '/anuncie' },
        { title: 'Política de Privacidade', url: '/politica-de-privacidade' },
        { title: 'Termos de Uso', url: '/termos' },
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

  // 5. 100% Games & Videogames Articles

  // Article 1: Featured - GTA VI (Games)
  await prisma.article.upsert({
    where: { slug: 'gta-6-gameplay-trailer-analise' },
    update: {
      title: 'GTA VI: Tudo o que Sabemos Sobre o Novo Jogo da Rockstar Games',
      excerpt: 'Confira os detalhes sobre o mapa de Vice City, os protagonistas Lucia e Jason, melhorias gráficas e o que esperar do lançamento mais aguardado da década.',
      categoryId: categoryMap['games'].id,
      coverImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1600&auto=format&fit=crop',
      viewsCount: 15420,
    },
    create: {
      title: 'GTA VI: Tudo o que Sabemos Sobre o Novo Jogo da Rockstar Games',
      slug: 'gta-6-gameplay-trailer-analise',
      excerpt: 'Confira os detalhes sobre o mapa de Vice City, os protagonistas Lucia e Jason, melhorias gráficas e o que esperar do lançamento mais aguardado da década.',
      categoryId: categoryMap['games'].id,
      authorId: admin.id,
      status: 'PUBLISHED',
      publishedAt: new Date(),
      coverImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1600&auto=format&fit=crop',
      viewsCount: 15420,
      content: `
        <p class="lead-text">O próximo capítulo da franquia Grand Theft Auto promete elevar os padrões da indústria de videogames, trazendo um mundo aberto mais vivo, dinâmico e interativo do que nunca.</p>

        <h2>O Retorno a Vice City</h2>
        <p>A Rockstar Games preparou um salto técnico significativo para GTA VI. Ambientado no estado fictício de Leonida, o mapa inclui a icônica Vice City e diversas regiões vizinhas, com praias movimentadas, pântanos e centros urbanos com densidade de pedestres e veículos sem precedentes.</p>
        
        <blockquote>"GTA VI busca redefinir o gênero de mundo aberto, combinando narrativa cinematográfica e liberdade total de exploração."</blockquote>

        <h2>Trailer Oficial</h2>
        <div class="video-container my-6 rounded-xl overflow-hidden border border-slate-300 dark:border-slate-800 shadow-md">
          <iframe src="https://www.youtube.com/embed/QdBZY2fkU-0" title="GTA VI Trailer 1" class="w-full aspect-video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>

        <h2>Dois Protagonistas: Lucia e Jason</h2>
        <p>Inspirados na clássica dinâmica de Bonnie e Clyde, Lucia e Jason formam a dupla central da história. Os jogadores poderão alternar entre eles e planejar ações em conjunto pelas ruas da cidade.</p>

        <h2>Data de Lançamento</h2>
        <p>O jogo está confirmado inicialmente para PlayStation 5 e Xbox Series X/S, com lançamento previsto pela Take-Two Interactive.</p>
      `,
    },
  });

  // Article 2: PlayStation 5 Pro (PlayStation)
  await prisma.article.upsert({
    where: { slug: 'ps5-pro-analise-desempenho-jogos' },
    update: {
      title: 'PlayStation 5 Pro: Testamos as Melhorias de Desempenho e Ray Tracing nos Jogos',
      excerpt: 'Analisamos como os principais games rodam no novo console da Sony: estabilidade a 60 FPS, tecnologia PSSR e gráficos no máximo sem compromisso.',
      categoryId: categoryMap['playstation'].id,
      coverImage: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=1600&auto=format&fit=crop',
      viewsCount: 19800,
    },
    create: {
      title: 'PlayStation 5 Pro: Testamos as Melhorias de Desempenho e Ray Tracing nos Jogos',
      slug: 'ps5-pro-analise-desempenho-jogos',
      excerpt: 'Analisamos como os principais games rodam no novo console da Sony: estabilidade a 60 FPS, tecnologia PSSR e gráficos no máximo sem compromisso.',
      categoryId: categoryMap['playstation'].id,
      authorId: admin.id,
      status: 'PUBLISHED',
      publishedAt: new Date(Date.now() - 6 * 3600 * 1000),
      coverImage: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=1600&auto=format&fit=crop',
      viewsCount: 19800,
      content: `
        <h2>O Desempenho dos Grandes Títulos no PS5 Pro</h2>
        <p>O PlayStation 5 Pro foi projetado para acabar com o dilema entre escolher qualidade gráfica a 30 FPS ou fluidez a 60 FPS nos videogames modernos.</p>

        <blockquote>"Com o novo recurso PlayStation Spectral Super Resolution (PSSR), jogos como Spider-Man 2 e Final Fantasy VII Rebirth atingem resolução aparente 4K com taxas de quadros estáveis a 60 FPS."</blockquote>

        <h2>Experiência de Jogo Aprimorada</h2>
        <p>O console oferece tempos de carregamento instantâneos e suporte a Ray Tracing dinâmico nos principais lançamentos da PlayStation Studios.</p>
      `,
    },
  });

  // Article 3: Nintendo Switch 2 (Nintendo)
  await prisma.article.upsert({
    where: { slug: 'nintendo-switch-2-jogos-e-detalhes' },
    update: {
      title: 'Nintendo Switch 2: Previsão de Lançamento e os Primeiros Jogos Esperados',
      excerpt: 'Rumores da indústria e informações oficiais da Nintendo indicam retrocompatibilidade total com o Switch atual e uma nova aventura de Mario em 3D.',
      categoryId: categoryMap['nintendo'].id,
      coverImage: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?q=80&w=1600&auto=format&fit=crop',
      viewsCount: 12450,
    },
    create: {
      title: 'Nintendo Switch 2: Previsão de Lançamento e os Primeiros Jogos Esperados',
      slug: 'nintendo-switch-2-jogos-e-detalhes',
      excerpt: 'Rumores da indústria e informações oficiais da Nintendo indicam retrocompatibilidade total com o Switch atual e uma nova aventura de Mario em 3D.',
      categoryId: categoryMap['nintendo'].id,
      authorId: admin.id,
      status: 'PUBLISHED',
      publishedAt: new Date(Date.now() - 10 * 3600 * 1000),
      coverImage: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?q=80&w=1600&auto=format&fit=crop',
      viewsCount: 12450,
      content: `
        <h2>O Futuro dos Jogos Nintendo</h2>
        <p>A Nintendo confirmou que seu próximo videogame manterá a filosofia de console híbrido que consagrou o Switch como um dos maiores sucessos da história dos videogames.</p>

        <blockquote>"A retrocompatibilidade com a biblioteca de jogos físicos e digitais do Nintendo Switch original é uma das prioridades declaradas da empresa."</blockquote>

        <h2>Line-up de Lançamento</h2>
        <p>Entre os jogos mais aguardados para a estreia estão o novo título 3D do Super Mario, Metroid Prime 4: Beyond e aprimoramentos para The Legend of Zelda: Tears of the Kingdom.</p>
      `,
    },
  });

  // Article 4: Review Black Myth Wukong (Reviews)
  await prisma.article.upsert({
    where: { slug: 'black-myth-wukong-review-tecnica' },
    update: {
      title: 'Review: Black Myth Wukong Impressiona com Gráficos Incríveis e Combate Desafiador',
      excerpt: 'Testamos a jornada do Rei Macaco no PC e consoles: direção de arte deslumbrante, chefes memoráveis e ótima ambientação da mitologia chinesa.',
      categoryId: categoryMap['reviews'].id,
      coverImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1600&auto=format&fit=crop',
      viewsCount: 11200,
    },
    create: {
      title: 'Review: Black Myth Wukong Impressiona com Gráficos Incríveis e Combate Desafiador',
      slug: 'black-myth-wukong-review-tecnica',
      excerpt: 'Testamos a jornada do Rei Macaco no PC e consoles: direção de arte deslumbrante, chefes memoráveis e ótima ambientação da mitologia chinesa.',
      categoryId: categoryMap['reviews'].id,
      authorId: admin.id,
      status: 'PUBLISHED',
      publishedAt: new Date(Date.now() - 16 * 3600 * 1000),
      coverImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1600&auto=format&fit=crop',
      viewsCount: 11200,
      content: `
        <h2>Uma Jornada Visual Deslumbrante</h2>
        <p>Desenvolvido pelo estúdio Game Science na Unreal Engine 5, Black Myth: Wukong é um dos jogos de ação mais marcantes dos últimos tempos. Cada templo, floresta e montanha nevada foi construído com riqueza ímpar de detalhes.</p>

        <blockquote>"O combate ágil com bastão e transformações míticas oferece um ritmo recompensador para quem aprecia desafios no estilo dos melhores jogos de ação modernos."</blockquote>

        <h2>Combate e Mecânicas</h2>
        <p>O protagonista conta com três posturas de combate, magias de imobilização e invocações que tornam os combates contra dezenas de chefes únicos e variados.</p>

        <h2>Veredito: 9.5 / 10</h2>
        <p>Black Myth: Wukong entrega ação de alta qualidade, respeito às suas raízes culturais e uma jogabilidade imperdível para os fãs de videogames desafiadores.</p>
      `,
    },
  });

  // Article 5: Xbox Game Pass (Xbox)
  await prisma.article.upsert({
    where: { slug: 'xbox-game-pass-novidades-jogos' },
    update: {
      title: 'Xbox Game Pass: Confira os Grandes Lançamentos Chegando ao Catálogo',
      excerpt: 'Grandes RPGs, produções de peso da Xbox Game Studios e novidades imperdíveis no serviço de assinatura da Microsoft para console e nuvem.',
      categoryId: categoryMap['xbox'].id,
      coverImage: 'https://images.unsplash.com/photo-1605901309584-818e25960a8f?q=80&w=1600&auto=format&fit=crop',
      viewsCount: 8930,
    },
    create: {
      title: 'Xbox Game Pass: Confira os Grandes Lançamentos Chegando ao Catálogo',
      slug: 'xbox-game-pass-novidades-jogos',
      excerpt: 'Grandes RPGs, produções de peso da Xbox Game Studios e novidades imperdíveis no serviço de assinatura da Microsoft para console e nuvem.',
      categoryId: categoryMap['xbox'].id,
      authorId: admin.id,
      status: 'PUBLISHED',
      publishedAt: new Date(Date.now() - 20 * 3600 * 1000),
      coverImage: 'https://images.unsplash.com/photo-1605901309584-818e25960a8f?q=80&w=1600&auto=format&fit=crop',
      viewsCount: 8930,
      content: `
        <h2>O Calendário de Jogos no Xbox</h2>
        <p>A Microsoft anunciou uma série de novidades para os assinantes do Xbox Game Pass no Xbox Series X/S e PC, com jogos disponíveis no primeiro dia de lançamento (Day One).</p>

        <blockquote>"Com adições como Avowed, Fable e novos títulos de estúdios renomados, o serviço consolida seu catálogo como o mais variado da geração."</blockquote>

        <h2>Destaques do Mês</h2>
        <ul>
          <li><strong>Avowed:</strong> O novo RPG de fantasia da Obsidian Entertainment</li>
          <li><strong>Indiana Jones e o Grande Círculo:</strong> Aventura cinematográfica da MachineGames</li>
          <li><strong>Novidades Indie:</strong> Games inovadores com foco em narrativa e quebra-cabeças</li>
        </ul>
      `,
    },
  });

  // Article 6: Cyberpunk Orion (PC Gaming)
  await prisma.article.upsert({
    where: { slug: 'cyberpunk-orion-unreal-engine-detalhes' },
    update: {
      title: 'Projeto Orion: Sequência de Cyberpunk 2077 Entra em Produção na Unreal Engine 5',
      excerpt: 'A CD Projekt Red confirmou o início do desenvolvimento da continuação de Cyberpunk 2077 com nova equipe e tecnologia gráfica de última geração.',
      categoryId: categoryMap['pc-gaming'].id,
      coverImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1600&auto=format&fit=crop',
      viewsCount: 7820,
    },
    create: {
      title: 'Projeto Orion: Sequência de Cyberpunk 2077 Entra em Produção na Unreal Engine 5',
      slug: 'cyberpunk-orion-unreal-engine-detalhes',
      excerpt: 'A CD Projekt Red confirmou o início do desenvolvimento da continuação de Cyberpunk 2077 com nova equipe e tecnologia gráfica de última geração.',
      categoryId: categoryMap['pc-gaming'].id,
      authorId: admin.id,
      status: 'PUBLISHED',
      publishedAt: new Date(Date.now() - 24 * 3600 * 1000),
      coverImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1600&auto=format&fit=crop',
      viewsCount: 7820,
      content: `
        <h2>Nova Equipe e Novo Motor Gráfico</h2>
        <p>Após o sucesso da expansão Phantom Liberty, a CD Projekt Red começou oficialmente a pré-produção do Projeto Orion, sequência direta de Cyberpunk 2077. O projeto está sendo liderado pelo novo estúdio da empresa em Boston.</p>
        
        <blockquote>"A migração para a Unreal Engine 5 permitirá à equipe criar uma Night City ainda mais imersiva, com transições sem telas de carregamento e melhorias significativas de jogabilidade."</blockquote>

        <h2>O Que Esperar da Sequência</h2>
        <p>O estúdio prometeu manter o foco na narrativa madura e em escolhas morais com consequências duradouras, expandindo a exploração dos distritos da cidade.</p>
      `,
    },
  });

  // Article 7: Elden Ring Shadow of the Erdtree (Lançamentos)
  await prisma.article.upsert({
    where: { slug: 'elden-ring-shadow-of-the-erdtree-analise' },
    update: {
      title: 'Elden Ring: Shadow of the Erdtree Expande o Universo com Chefes Desafiadores',
      excerpt: 'A grande expansão da FromSoftware leva os jogadores ao Reino das Sombras com novos tipos de armas, magias e combates épicos.',
      categoryId: categoryMap['lancamentos'].id,
      coverImage: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=1600&auto=format&fit=crop',
      viewsCount: 16400,
    },
    create: {
      title: 'Elden Ring: Shadow of the Erdtree Expande o Universo com Chefes Desafiadores',
      slug: 'elden-ring-shadow-of-the-erdtree-analise',
      excerpt: 'A grande expansão da FromSoftware leva os jogadores ao Reino das Sombras com novos tipos de armas, magias e combates épicos.',
      categoryId: categoryMap['lancamentos'].id,
      authorId: admin.id,
      status: 'PUBLISHED',
      publishedAt: new Date(Date.now() - 32 * 3600 * 1000),
      coverImage: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=1600&auto=format&fit=crop',
      viewsCount: 16400,
      content: `
        <h2>O Retorno ao Mundo de Hidetaka Miyazaki</h2>
        <p>Shadow of the Erdtree representa a maior e mais ambiciosa expansão já produzida pela FromSoftware, oferecendo um mapa do tamanho de jogos completos do gênero soulslike.</p>

        <blockquote>"O Reino das Sombras é repleto de castelos labirínticos, catacumbas secretas e chefes que testarão a habilidade de até os jogadores mais experientes."</blockquote>

        <h2>Novas Armas e Estilos de Combate</h2>
        <p>Com oito novas categorias de armas, incluindo artes marciais com mãos desarmadas e espadas leves, os jogadores têm ampla liberdade para criar novas builds e estratégias.</p>
      `,
    },
  });

  console.log('Pure Games/Videogames seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
