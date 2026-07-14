import { ReadmeProject } from '../types';

export const initialProject: ReadmeProject = {
  id: 'space-impacta-initial',
  name: 'Space Impacta',
  description: 'Jogo de ação espacial em pixel art desenvolvido com React, TypeScript e HTML5 Canvas.',
  technologies: ['React', 'TypeScript', 'Vite', 'HTML5 Canvas', 'CSS3'],
  features: [
    'Várias naves jogáveis',
    'Inimigos desafiadores',
    'Power-ups e habilidades',
    'Sistema de pontuação'
  ],
  installation: 'git clone https://github.com/thiago-pereira79/space-impacta.git\ncd space-impacta\nnpm install',
  usage: 'npm run dev',
  license: 'MIT',
  repositoryUrl: 'https://github.com/thiago-pereira79/space-impacta',
  deployUrl: 'https://space-impacta-demo.vercel.app',
  websiteUrl: 'https://space-impacta.com',
  authorName: 'Thiago Pereira',
  authorEmail: 'contato@thiagopereira.dev',
  authorUrl: 'https://github.com/thiago-pereira79',
  linkedinUrl: 'https://linkedin.com/in/thiago-pereira',
  screenshots: [
    {
      id: 'sc-1',
      source: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&w=600&q=80',
      alt: 'Space Impacta Gameplay 1',
      caption: 'Fase inicial do jogo com ondas de inimigos'
    },
    {
      id: 'sc-2',
      source: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
      alt: 'Space Impacta Gameplay 2',
      caption: 'Combate contra o chefe da segunda fase'
    },
    {
      id: 'sc-3',
      source: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?auto=format&fit=crop&w=600&q=80',
      alt: 'Space Impacta Settings',
      caption: 'Tela de seleção de naves e customização'
    }
  ],
  optionalSections: {
    prerequisites: true,
    scripts: true,
    folderStructure: false,
    roadmap: true,
    contributing: true,
    authors: true,
    acknowledgements: true,
    contact: true,
    tests: false
  },
  prerequisitesContent: '- Node.js v18.0.0 ou superior\n- Gerenciador de pacotes npm ou yarn\n- Navegador moderno compatível com HTML5 Canvas',
  scriptsContent: '- `npm run dev`: Inicia o servidor de desenvolvimento local\n- `npm run build`: Compila o projeto para produção\n- `npm run lint`: Executa a verificação estática do código',
  roadmapContent: '- [x] Criar motor de física e colisão básico\n- [x] Implementar 3 tipos de inimigos\n- [ ] Adicionar suporte a controles físicos (Gamepad)\n- [ ] Criar ranking global online',
  contributingContent: 'Contribuições são muito bem-vindas! Sinta-se à vontade para abrir uma Issue ou criar um Pull Request.\n\n1. Faça um Fork do projeto\n2. Crie uma branch para sua feature (`git checkout -b feature/NovaFeature`)\n3. Faça o commit de suas alterações (`git commit -m \'Add NovaFeature\'`)\n4. Envie a branch (`git push origin feature/NovaFeature`)\n5. Abra um Pull Request',
  acknowledgementsContent: '- Comunidade de desenvolvedores de jogos indie no Brasil\n- Kenney.nl pelos excelentes assets visuais gratuitos em pixel art\n- Criadores do Vite pela velocidade impressionante do bundler',
  contactContent: 'Caso queira conversar sobre o projeto, entre em contato através do e-mail contato@seuemail.com.',
  createdAt: new Date('2026-07-10T12:00:00Z').toISOString(),
  updatedAt: new Date('2026-07-11T07:00:00Z').toISOString()
};

export const emptyInitialProject: ReadmeProject = {
  id: 'clean-initial-draft',
  name: '',
  description: '',
  technologies: [],
  features: [],
  installation: '',
  usage: '',
  license: '', // Empty means "Selecionar licença"
  repositoryUrl: '',
  deployUrl: '',
  websiteUrl: '',
  authorName: '',
  authorEmail: '',
  authorUrl: '',
  linkedinUrl: '',
  screenshots: [],
  optionalSections: {
    prerequisites: false,
    scripts: false,
    folderStructure: false,
    roadmap: false,
    contributing: false,
    authors: false,
    acknowledgements: false,
    contact: false,
    tests: false
  },
  prerequisitesContent: '',
  scriptsContent: '',
  folderStructureContent: '',
  roadmapContent: '',
  contributingContent: '',
  authorsContent: '',
  acknowledgementsContent: '',
  contactContent: '',
  testsContent: '',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

export interface ReadmeTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  project: Partial<ReadmeProject>;
}

export const readmeTemplates: ReadmeTemplate[] = [
  {
    id: 'tpl-space-impacta',
    name: 'Jogo Space Impacta',
    category: 'Games',
    description: 'Jogo de ação espacial em pixel art desenvolvido com React, TypeScript e HTML5 Canvas.',
    icon: 'Gamepad2',
    project: initialProject
  },
  {
    id: 'tpl-web-app',
    name: 'Aplicação Web (SaaS)',
    category: 'SaaS / Web',
    description: 'Ideal para sistemas web modernos, dashboards e plataformas SaaS integradas.',
    icon: 'Layout',
    project: {
      name: 'TaskFlow Dashboard',
      description: 'Plataforma web de gerenciamento ágil de tarefas e projetos com suporte a Kanban, gráficos de produtividade e colaboração em tempo real.',
      technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Recharts', 'lucide-react', 'motion'],
      features: [
        'Painel Kanban arrastar e soltar',
        'Gráficos de produtividade interativos',
        'Notificações em tempo real',
        'Controle de prazos e metas'
      ],
      installation: 'git clone https://github.com/usuario/taskflow.git\ncd taskflow\nnpm install\ncp .env.example .env',
      usage: 'npm run dev',
      license: 'MIT',
      optionalSections: {
        prerequisites: true,
        scripts: true,
        folderStructure: true,
        roadmap: true,
        contributing: true,
        authors: true,
        acknowledgements: false,
        contact: true,
        tests: true
      },
      prerequisitesContent: '- Node.js 18.x\n- Conta ativa no Firebase (opcional, para real-time)\n- Banco de dados local PostgreSQL ou Firebase Auth',
      scriptsContent: '- `npm run dev`: Executa a aplicação em modo de desenvolvimento\n- `npm run build`: Compila o app otimizado para produção\n- `npm run lint`: Analisa o código em busca de erros de formatação',
      folderStructureContent: '```text\nsrc/\n  ├── components/     # Componentes compartilhados\n  ├── context/        # Estados globais (Auth, Theme)\n  ├── hooks/          # Hooks customizados\n  ├── services/       # Integração com APIs externas\n  └── types/          # Arquivos de definição de tipos TS\n```',
      roadmapContent: '- [x] Estrutura Kanban funcional\n- [x] Integração com banco de dados local\n- [ ] Integração com Google Agenda para prazos\n- [ ] Relatórios PDF automáticos semanais',
      contributingContent: 'Abra um Pull Request descrevendo suas melhorias ou relate problemas abrindo uma Issue.',
      authorsContent: '- **João Silva** - *Desenvolvedor Principal* - [@joaosilva](https://github.com/joaosilva)',
      contactContent: 'Desenvolvido por João Silva - joao.silva@email.com',
      testsContent: 'Execute a suíte de testes com:\n```bash\nnpm run test\n```'
    }
  },
  {
    id: 'tpl-game',
    name: 'Jogo (2D/3D)',
    category: 'Games',
    description: 'Layout para jogos indie, web, mobile ou desktop.',
    icon: 'Gamepad2',
    project: {
      name: 'Pixel Knight',
      description: 'Jogo estilo metroidvania 2D pixel-art de aventura e combate hack-and-slash desenvolvido em motor HTML5.',
      technologies: ['HTML5 Canvas', 'TypeScript', 'Phaser3', 'Web Audio API'],
      features: [
        'Movimentação fluida baseada em frames',
        'Áudio posicional de efeitos e trilhas',
        'Inteligência artificial básica para inimigos',
        'Sistema de inventário e upgrades de armas'
      ],
      installation: 'git clone https://github.com/seu-github/pixel-knight.git\ncd pixel-knight\nnpm install',
      usage: 'npm start',
      license: 'GPL 3.0',
      optionalSections: {
        prerequisites: true,
        scripts: true,
        folderStructure: false,
        roadmap: true,
        contributing: true,
        authors: false,
        acknowledgements: true,
        contact: true,
        tests: false
      },
      prerequisitesContent: '- Qualquer navegador moderno com suporte a WebGL\n- Node.js instalado para o servidor local de testes',
      scriptsContent: '- `npm start`: Inicia o servidor Webpack Dev e abre no navegador\n- `npm run build`: Gera o bundle final de produção em `/dist`',
      roadmapContent: '- [x] Implementação física de pulo duplo e esquiva\n- [ ] Criação do mapa da Floresta Sombria\n- [ ] Lançamento oficial na plataforma itch.io',
      contributingContent: 'Se deseja colaborar com arte, áudio ou código, veja nosso guia de contribuição.',
      acknowledgementsContent: '- Comunidade Phaser pelos excelentes plugins open source\n- Artista do OpenGameArt que desenhou os tilesets medievais',
      contactContent: 'Para parcerias e contato: dev@pixelknightgame.com'
    }
  },
  {
    id: 'tpl-api',
    name: 'API REST / GraphQL',
    category: 'Backend',
    description: 'Focado em APIs backend, microsserviços e documentações de endpoints.',
    icon: 'Server',
    project: {
      name: 'E-Commerce Core API',
      description: 'API de alta performance para controle de carrinhos, estoque, cálculo de frete e checkout seguro.',
      technologies: ['Node.js', 'Express', 'TypeScript', 'Prisma ORM', 'Docker', 'Redis'],
      features: [
        'Autenticação JWT com Refresh Tokens',
        'Cálculo de rotas e entrega integrado aos Correios',
        'Garantia de concorrência de estoque com filas Redis',
        'Documentação OpenAPI/Swagger interativa completa'
      ],
      installation: 'git clone https://github.com/backend-dev/ecommerce-api.git\ncd ecommerce-api\nnpm install\ndocker-compose up -d',
      usage: 'npm run migrate && npm run dev',
      license: 'MIT',
      optionalSections: {
        prerequisites: true,
        scripts: true,
        folderStructure: true,
        roadmap: false,
        contributing: true,
        authors: true,
        acknowledgements: false,
        contact: true,
        tests: true
      },
      prerequisitesContent: '- Docker instalado na máquina\n- Node.js v18.x\n- Chaves de sandbox para gateway de pagamento',
      scriptsContent: '- `npm run dev`: Executa a API com ts-node-dev e monitoramento de mudanças\n- `npm run migrate`: Roda as migrações do banco Prisma\n- `npm test`: Executa testes unitários e de integração com Jest',
      folderStructureContent: '```text\nsrc/\n  ├── controllers/    # Controladores de rotas HTTP\n  ├── middlewares/    # Validações, tratamento de erro e Auth\n  ├── prisma/         # Esquema de dados e migrations\n  ├── services/       # Regras de negócios isoladas\n  └── config/         # Configurações de serviços e conexões\n```',
      contributingContent: 'Abra issues detalhando bugs ou envie PRs de melhoria. Siga as convenções de commits descritas em Conventional Commits.',
      authorsContent: '- **Ana Clara** - *Tech Lead Backend* - [@anaclara](https://github.com/anaclara)',
      contactContent: 'E-mail para suporte: api-support@ecommercecore.com',
      testsContent: 'Suíte completa de testes via:\n```bash\nnpm run test\nnpm run test:coverage\n```'
    }
  },
  {
    id: 'tpl-mobile',
    name: 'Aplicativo Mobile',
    category: 'Mobile',
    description: 'Perfeito para apps Android, iOS ou multi-plataforma (React Native, Flutter).',
    icon: 'Smartphone',
    project: {
      name: 'FitPulse App',
      description: 'Aplicativo mobile para monitoramento físico, agendamento de treinos, cálculo de IMC e rastreamento de hidratação diária com lembretes.',
      technologies: ['React Native', 'Expo', 'TypeScript', 'AsyncStorage', 'NativeWind'],
      features: [
        'Lembretes diários por notificações locais push',
        'Rastreador de consumo de água interativo',
        'Gráficos de evolução de peso e exercícios',
        'Funcionamento 100% offline'
      ],
      installation: 'git clone https://github.com/appdev/fitpulse.git\ncd fitpulse\nnpm install',
      usage: 'npx expo start',
      license: 'Apache 2.0',
      optionalSections: {
        prerequisites: true,
        scripts: true,
        folderStructure: false,
        roadmap: true,
        contributing: true,
        authors: false,
        acknowledgements: false,
        contact: true,
        tests: false
      },
      prerequisitesContent: '- Aplicativo Expo Go instalado no smartphone Android/iOS\n- Ou emulador Android Studio / simulador Xcode configurado',
      scriptsContent: '- `npx expo start`: Abre o painel Metro Bundler\n- `npm run android`: Roda o app direto no emulador Android conectado\n- `npm run ios`: Roda o app direto no emulador iOS local',
      roadmapContent: '- [x] Login e perfil de usuário\n- [x] Cronômetro e lembretes de hidratação\n- [ ] Sincronização automática com Apple Health e Google Fit\n- [ ] Compartilhamento de conquistas nas redes sociais',
      contributingContent: 'Forks são bem-vindos. Garanta que o código passe no ESLint do Expo antes de submeter.',
      contactContent: 'Dúvidas ou feedbacks no e-mail: mobile-support@fitpulse.app'
    }
  },
  {
    id: 'tpl-library',
    name: 'Biblioteca / NPM Package',
    category: 'Utilities / Packages',
    description: 'Focado em pacotes reutilizáveis, utilitários, hooks, libs ou plugins.',
    icon: 'Code2',
    project: {
      name: 'date-utils-ptbr',
      description: 'Biblioteca ultra leve em TypeScript para formatação, validação e manipulação de datas no padrão brasileiro, incluindo suporte a feriados nacionais e anos bissextos.',
      technologies: ['TypeScript', 'esbuild', 'Vitest', 'NPM'],
      features: [
        'Tamanho extremamente reduzido (< 2KB gzip)',
        'Suporte a todos os feriados móveis brasileiros (Páscoa, Carnaval, etc.)',
        'Formatação intuitiva em português brasileiro',
        'Compatível com ESModules e CommonJS'
      ],
      installation: 'npm install date-utils-ptbr',
      usage: '```typescript\nimport { formatarDataExtenso, ehFeriado } from \'date-utils-ptbr\';\n\nconst hoje = new Date();\nconsole.log(formatarDataExtenso(hoje));\n// Ex: "Sábado, 11 de Julho de 2026"\n\nconsole.log(ehFeriado(hoje)); // false ou true\n```',
      license: 'MIT',
      optionalSections: {
        prerequisites: false,
        scripts: true,
        folderStructure: false,
        roadmap: false,
        contributing: true,
        authors: true,
        acknowledgements: false,
        contact: true,
        tests: true
      },
      scriptsContent: '- `npm run build`: Compila a biblioteca para ESM e CJS utilizando esbuild\n- `npm run test`: Executa os testes de formatação com Vitest\n- `npm run benchmark`: Compara a performance com outras bibliotecas populares',
      contributingContent: 'Reporte bugs abrindo Issues ou crie um PR com novos métodos e utilitários úteis.',
      authorsContent: '- **Carla Mendes** - *Criadora da lib* - [@carlamendes](https://github.com/carlamendes)',
      contactContent: 'Mande sugestões em carla.mendes@email.com',
      testsContent: 'A biblioteca conta com 100% de cobertura de código. Teste localmente executando:\n```bash\nnpm run test\n```'
    }
  },
  {
    id: 'tpl-portfolio',
    name: 'Website Portfólio',
    category: 'Personal',
    description: 'Perfeito para desenvolvedores divulgarem seus trabalhos, contatos e projetos.',
    icon: 'User',
    project: {
      name: 'DevPortfolio',
      description: 'Portfólio elegante, minimalista e de alta velocidade para exibir projetos de desenvolvimento, experiência profissional e links de contato.',
      technologies: ['Vite', 'React', 'motion', 'Tailwind CSS', 'EmailJS'],
      features: [
        'Formulário de contato direto e validado funcional via EmailJS',
        'Animações de rolagem suaves e fluidas',
        'Bento Grid de projetos em destaque',
        'Suporte completo a acessibilidade (leitores de tela)'
      ],
      installation: 'git clone https://github.com/seu-portfolio.git\ncd seu-portfolio\nnpm install',
      usage: 'npm run dev',
      license: 'MIT',
      optionalSections: {
        prerequisites: false,
        scripts: true,
        folderStructure: false,
        roadmap: false,
        contributing: false,
        authors: false,
        acknowledgements: true,
        contact: true,
        tests: false
      },
      scriptsContent: '- `npm run dev`: Executa em desenvolvimento local rápido\n- `npm run build`: Gera os arquivos estáticos otimizados para hospedagem (Vercel, Netlify, Github Pages)',
      acknowledgementsContent: '- Inspirações de design retiradas do Dribbble e Behance\n- Fontes providas pelo Google Fonts',
      contactContent: 'Disponível para freelance e novas oportunidades! Conecte-se comigo no LinkedIn ou mande mensagem pelo formulário.'
    }
  },
  {
    id: 'tpl-academic',
    name: 'Projeto Acadêmico',
    category: 'Acadêmico / Científico',
    description: 'Estrutura completa para teses, artigos científicos, pesquisas ou Trabalhos de Conclusão de Curso (TCC).',
    icon: 'GraduationCap',
    project: {
      name: 'Análise Epidemiológica SmartData',
      description: 'Projeto de pesquisa e desenvolvimento focado na modelagem computacional da propagação de patógenos em ambientes urbanos densos.',
      technologies: ['Python', 'Jupyter Notebook', 'Pandas', 'Matplotlib', 'LaTeX'],
      features: [
        'Modelos de simulação computacional SEIR',
        'Processamento estatístico de dados demográficos reais',
        'Visualização gráfica interativa das curvas de contágio',
        'Exportação automática de relatórios acadêmicos formatados'
      ],
      installation: 'git clone https://github.com/usuario/pesquisa-epidemiologica.git\ncd pesquisa-epidemiologica\npip install -r requirements.txt',
      usage: 'jupyter notebook simulacao.ipynb',
      license: 'MIT',
      authorName: 'Dra. Helena Souza',
      optionalSections: {
        prerequisites: true,
        scripts: false,
        folderStructure: true,
        roadmap: false,
        contributing: false,
        authors: true,
        acknowledgements: true,
        contact: true,
        tests: false
      },
      prerequisitesContent: '- Python 3.10 ou superior\n- Ambiente virtual (venv) configurado\n- Instalação local do compilador LaTeX (para geração de relatórios)',
      folderStructureContent: '```text\ndata/\n  ├── raw/            # Dados brutos anonimizados\n  └── processed/      # Dados limpos para modelagem\nnotebooks/            # Experimentos e rascunhos de análises\nsrc/\n  ├── model/          # Implementação das equações diferenciais\n  └── visualization/  # Scripts de plotagem e mapas\n```',
      authorsContent: '- **Dra. Helena Souza** - *Pesquisadora Principal* - [Lattes](http://lattes.cnpq.br/0000)\n- **Dr. Arthur Lima** - *Co-orientador* - [Lattes](http://lattes.cnpq.br/1111)',
      acknowledgementsContent: '- Ao CNPq pelo apoio financeiro e bolsas de pesquisa concedidas\n- Ao Departamento de Computação Científica da Universidade Federal',
      contactContent: 'Contato para dúvidas acadêmicas: helena.souza@universidade.edu'
    }
  }
];

export function getLocalizedTemplates(locale: string): ReadmeTemplate[] {
  const isEn = locale.startsWith('en');
  const isEs = locale.startsWith('es');

  if (!isEn && !isEs) {
    return readmeTemplates;
  }

  // Clone templates to avoid modifying the original read-only arrays
  return readmeTemplates.map(tpl => {
    const clone = { ...tpl, project: { ...tpl.project } };

    if (isEn) {
      if (clone.id === 'tpl-space-impacta') {
        clone.name = 'Space Impacta Game';
        clone.category = 'Games';
        clone.description = 'Space action pixel art game developed with React, TypeScript, and HTML5 Canvas.';
        clone.project.name = 'Space Impacta';
        clone.project.description = 'Space action pixel art game developed with React, TypeScript, and HTML5 Canvas.';
        clone.project.features = [
          'Multiple playable ships',
          'Challenging enemies',
          'Power-ups and abilities',
          'Score system'
        ];
        clone.project.prerequisitesContent = '- Node.js v18.0.0 or higher\n- Package manager npm or yarn\n- Modern browser compatible with HTML5 Canvas';
        clone.project.scriptsContent = '- `npm run dev`: Starts the local development server\n- `npm run build`: Compiles the project for production\n- `npm run lint`: Runs static code analysis';
        clone.project.roadmapContent = '- [x] Create basic physics and collision engine\n- [x] Implement 3 enemy types\n- [ ] Add gamepad support\n- [ ] Create global online leaderboard';
        clone.project.contributingContent = 'Contributions are highly welcome! Feel free to open an Issue or create a Pull Request.\n\n1. Fork the project\n2. Create a branch for your feature (`git checkout -b feature/NewFeature`)\n3. Commit your changes (`git commit -m \'Add NewFeature\'`)\n4. Push the branch (`git push origin feature/NewFeature`)\n5. Open a Pull Request';
        clone.project.acknowledgementsContent = '- Indie game developer community\n- Kenney.nl for the excellent free pixel art visual assets\n- Vite creators for the impressive bundler speed';
        clone.project.contactContent = 'If you want to talk about the project, contact me via email at contact@youremail.com.';
      } else if (clone.id === 'tpl-web-app') {
        clone.name = 'Web Application (SaaS)';
        clone.category = 'SaaS / Web';
        clone.description = 'Ideal for modern web systems, dashboards, and integrated SaaS platforms.';
        clone.project.name = 'TaskFlow Dashboard';
        clone.project.description = 'Agile task and project management web platform supporting Kanban, productivity charts, and real-time collaboration.';
        clone.project.features = [
          'Drag-and-drop Kanban board',
          'Dynamic productivity charts',
          'Real-time notifications',
          'Deadline and goal tracking'
        ];
        clone.project.prerequisitesContent = '- Node.js 18.x\n- Active Firebase account (optional, for real-time)\n- Local PostgreSQL database or Firebase Auth';
        clone.project.scriptsContent = '- `npm run dev`: Runs the application in development mode\n- `npm run build`: Compiles the optimized production app\n- `npm run lint`: Analyzes code for formatting errors';
        clone.project.roadmapContent = '- [x] Functional Kanban structure\n- [x] Local database integration\n- [ ] Google Calendar integration for deadlines\n- [ ] Automatic weekly PDF reports';
        clone.project.contributingContent = 'Open a Pull Request describing your improvements or report issues by opening an Issue.';
        clone.project.authorsContent = '- **John Smith** - *Lead Developer* - [@johnsmith](https://github.com/johnsmith)';
        clone.project.contactContent = 'Developed by John Smith - john.smith@email.com';
        clone.project.testsContent = 'Run the test suite with:\n```bash\nnpm run test\n```';
      } else if (clone.id === 'tpl-game') {
        clone.name = 'Game (2D/3D)';
        clone.category = 'Games';
        clone.description = 'Layout for indie, web, mobile, or desktop games.';
        clone.project.name = 'Pixel Knight';
        clone.project.description = '2D style metroidvania adventure and hack-and-slash pixel-art game developed with an HTML5 engine.';
        clone.project.features = [
          'Fluid frame-based movement',
          'Positional audio for effects and music',
          'Basic enemy artificial intelligence',
          'Inventory system and weapon upgrades'
        ];
        clone.project.prerequisitesContent = '- Any modern browser with WebGL support\n- Node.js installed for local testing server';
        clone.project.scriptsContent = '- `npm start`: Starts the Webpack Dev server and opens in the browser\n- `npm run build`: Generates the final production bundle in `/dist`';
        clone.project.roadmapContent = '- [x] Physical implementation of double jump and dash\n- [ ] Creation of the Dark Forest map\n- [ ] Official launch on itch.io platform';
        clone.project.contributingContent = 'If you wish to collaborate with art, audio, or code, please see our contribution guide.';
        clone.project.acknowledgementsContent = '- Phaser community for excellent open source plugins\n- OpenGameArt artist who designed the medieval tilesets';
        clone.project.contactContent = 'For partnerships and contact: dev@pixelknightgame.com';
      } else if (clone.id === 'tpl-api') {
        clone.name = 'REST / GraphQL API';
        clone.category = 'Backend';
        clone.description = 'Focused on backend APIs, microservices, and endpoint documentation.';
        clone.project.name = 'E-Commerce Core API';
        clone.project.description = 'High-performance API for shopping cart, inventory control, shipping calculation, and secure checkout.';
        clone.project.features = [
          'JWT Authentication with Refresh Tokens',
          'Route and delivery calculation integrated with post systems',
          'Stock concurrency guarantee using Redis queues',
          'Complete interactive OpenAPI/Swagger documentation'
        ];
        clone.project.prerequisitesContent = '- Docker installed on the machine\n- Node.js v18.x\n- Sandbox keys for payment gateway';
        clone.project.scriptsContent = '- `npm run dev`: Runs the API with ts-node-dev and change monitoring\n- `npm run migrate`: Runs Prisma database migrations\n- `npm test`: Runs unit and integration tests with Jest';
        clone.project.contributingContent = 'Open issues detailing bugs or submit improvement PRs. Follow commit conventions described in Conventional Commits.';
        clone.project.authorsContent = '- **Jane Doe** - *Tech Lead Backend* - [@janedoe](https://github.com/janedoe)';
        clone.project.contactContent = 'Support email: api-support@ecommercecore.com';
        clone.project.testsContent = 'Full test suite via:\n```bash\nnpm run test\nnpm run test:coverage\n```';
      } else if (clone.id === 'tpl-mobile') {
        clone.name = 'Mobile App';
        clone.category = 'Mobile';
        clone.description = 'Perfect for Android, iOS, or cross-platform apps (React Native, Flutter).';
        clone.project.name = 'FitPulse App';
        clone.project.description = 'Mobile application for physical monitoring, workout scheduling, BMI calculation, and daily hydration tracking with reminders.';
        clone.project.features = [
          'Daily reminders via local push notifications',
          'Interactive water consumption tracker',
          'Weight and exercise progress charts',
          '100% offline operation'
        ];
        clone.project.prerequisitesContent = '- Expo Go app installed on Android/iOS smartphone\n- Or configured Android Studio emulator / Xcode simulator';
        clone.project.scriptsContent = '- `npx expo start`: Opens the Metro Bundler panel\n- `npm run android`: Runs the app directly on the connected Android emulator\n- `npm run ios`: Runs the app directly on the local iOS emulator';
        clone.project.roadmapContent = '- [x] User login and profile\n- [x] Stopwatch and hydration reminders\n- [ ] Automatic sync with Apple Health and Google Fit\n- [ ] Achievement sharing on social media';
        clone.project.contributingContent = 'Forks are welcome. Ensure the code passes Expo ESLint before submitting.';
        clone.project.contactContent = 'Questions or feedback: mobile-support@fitpulse.app';
      } else if (clone.id === 'tpl-library') {
        clone.name = 'Library / NPM Package';
        clone.category = 'Utilities / Packages';
        clone.description = 'Focused on reusable packages, utilities, hooks, libraries, or plugins.';
        clone.project.name = 'date-utils-ptbr';
        clone.project.description = 'Ultra lightweight TypeScript library for formatting, validating, and manipulating dates in Brazilian format, including support for national holidays and leap years.';
        clone.project.features = [
          'Extremely small size (< 2KB gzip)',
          'Support for all Brazilian moving holidays (Easter, Carnival, etc.)',
          'Intuitive formatting in Brazilian Portuguese',
          'Compatible with ESModules and CommonJS'
        ];
        clone.project.scriptsContent = '- `npm run build`: Compiles the library for ESM and CJS using esbuild\n- `npm run test`: Runs formatting tests with Vitest\n- `npm run benchmark`: Compares performance with other popular libraries';
        clone.project.contributingContent = 'Report bugs by opening Issues or create a PR with new useful methods and utilities.';
        clone.project.authorsContent = '- **Carla Mendes** - *Library Creator* - [@carlamendes](https://github.com/carlamendes)';
        clone.project.contactContent = 'Send suggestions to carla.mendes@email.com';
        clone.project.testsContent = 'The library features 100% code coverage. Test locally by running:\n```bash\nnpm run test\n```';
      } else if (clone.id === 'tpl-portfolio') {
        clone.name = 'Portfolio Website';
        clone.category = 'Personal';
        clone.description = 'Perfect for developers to display their work, contact info, and projects.';
        clone.project.name = 'DevPortfolio';
        clone.project.description = 'Elegant, minimalist, and high-speed portfolio to display development projects, professional experience, and contact links.';
        clone.project.features = [
          'Direct and validated contact form via EmailJS',
          'Smooth and fluid scroll animations',
          'Bento Grid of highlighted projects',
          'Full accessibility support (screen readers)'
        ];
        clone.project.scriptsContent = '- `npm run dev`: Runs in fast local development\n- `npm run build`: Generates optimized static files for hosting (Vercel, Netlify, Github Pages)';
        clone.project.acknowledgementsContent = '- Design inspiration taken from Dribbble and Behance\n- Fonts provided by Google Fonts';
        clone.project.contactContent = 'Available for freelance and new opportunities! Connect with me on LinkedIn or send a message through the form.';
      } else if (clone.id === 'tpl-academic') {
        clone.name = 'Academic Project';
        clone.category = 'Academic';
        clone.description = 'Complete structure for theses, scientific articles, research, or Capstone projects.';
        clone.project.name = 'SmartData Epidemiological Analysis';
        clone.project.description = 'Research and development project focused on computational modeling of pathogen spread in dense urban environments.';
        clone.project.features = [
          'SEIR computational simulation models',
          'Statistical processing of real demographic data',
          'Interactive graphical visualization of contagion curves',
          'Automatic export of formatted academic reports'
        ];
        clone.project.prerequisitesContent = '- Python 3.10 or higher\n- Configured virtual environment (venv)\n- Local LaTeX compiler installation (for report generation)';
        clone.project.folderStructureContent = '```text\ndata/\n  ├── raw/            # Anonymized raw data\n  └── processed/      # Cleaned data for modeling\nnotebooks/            # Experiments and analysis drafts\nsrc/\n  ├── model/          # Implementation of differential equations\n  └── visualization/  # Plotting and mapping scripts\n```';
        clone.project.authorsContent = '- **Dr. Helena Souza** - *Lead Researcher* - [Lattes](http://lattes.cnpq.br/0000)\n- **Dr. Arthur Lima** - *Co-advisor* - [Lattes](http://lattes.cnpq.br/1111)';
        clone.project.acknowledgementsContent = '- To CNPq for financial support and research fellowships granted\n- To the Department of Scientific Computing of the Federal University';
        clone.project.contactContent = 'Contact for academic questions: helena.souza@universidade.edu';
      }
    } else if (isEs) {
      if (clone.id === 'tpl-space-impacta') {
        clone.name = 'Juego Space Impacta';
        clone.category = 'Juegos';
        clone.description = 'Juego de acción espacial en pixel art desarrollado con React, TypeScript y HTML5 Canvas.';
        clone.project.name = 'Space Impacta';
        clone.project.description = 'Juego de acción espacial en pixel art desarrollado con React, TypeScript y HTML5 Canvas.';
        clone.project.features = [
          'Múltiples naves jugables',
          'Enemigos desafiantes',
          'Power-ups y habilidades',
          'Sistema de puntuación'
        ];
        clone.project.prerequisitesContent = '- Node.js v18.0.0 o superior\n- Gestor de paquetes npm o yarn\n- Navegador moderno compatible con HTML5 Canvas';
        clone.project.scriptsContent = '- `npm run dev`: Inicia el servidor de desarrollo local\n- `npm run build`: Compila el proyecto para producción\n- `npm run lint`: Ejecuta el análisis estático del código';
        clone.project.roadmapContent = '- [x] Crear motor de física y colisiones básico\n- [x] Implementar 3 tipos de enemigos\n- [ ] Añadir soporte para mandos (Gamepad)\n- [ ] Crear tabla de clasificación global online';
        clone.project.contributingContent = '¡Las contribuciones son muy bienvenidas! Siéntete libre de abrir un problema (Issue) o crear una solicitud de extracción (Pull Request).\n\n1. Haz un Fork del proyecto\n2. Crea una rama para tu característica (`git checkout -b feature/NuevaCaracteristica`)\n3. Confirma tus cambios (`git commit -m \'Add NuevaCaracteristica\'`)\n4. Envía la rama (`git push origin feature/NuevaCaracteristica`)\n5. Abre un Pull Request';
        clone.project.acknowledgementsContent = '- Comunidad de desarrolladores de videojuegos indie\n- Kenney.nl por los excelentes recursos visuales gratuitos en pixel art\n- Creadores de Vite por la velocidad impresionante del empaquetador';
        clone.project.contactContent = 'Si deseas conversar sobre el proyecto, ponte en contacto a través del correo electrónico contacto@tuemail.com.';
      } else if (clone.id === 'tpl-web-app') {
        clone.name = 'Aplicación Web (SaaS)';
        clone.category = 'SaaS / Web';
        clone.description = 'Ideal para sistemas web modernos, paneles de control y plataformas SaaS integradas.';
        clone.project.name = 'TaskFlow Dashboard';
        clone.project.description = 'Plataforma web de gestión ágil de tareas y proyectos con soporte para Kanban, gráficos de productividad y colaboración en tiempo real.';
        clone.project.features = [
          'Tablero Kanban de arrastrar y soltar',
          'Gráficos de productividad dinámicos',
          'Notificaciones en tiempo real',
          'Seguimiento de plazos y metas'
        ];
        clone.project.prerequisitesContent = '- Node.js 18.x\n- Cuenta activa en Firebase (opcional, para tiempo real)\n- Base de datos local PostgreSQL o Firebase Auth';
        clone.project.scriptsContent = '- `npm run dev`: Ejecuta la aplicación en modo de desarrollo\n- `npm run build`: Compila la aplicación optimizada para producción\n- `npm run lint`: Analiza el código en busca de errores de formato';
        clone.project.folderStructureContent = '```text\nsrc/\n  ├── components/     # Componentes compartidos\n  ├── context/        # Estados globales (Auth, Theme)\n  ├── hooks/          # Ganchos personalizados (Hooks)\n  ├── services/       # Integración con APIs externas\n  └── types/          # Definición de tipos TS\n```';
        clone.project.roadmapContent = '- [x] Estructura Kanban funcional\n- [x] Integración con base de datos local\n- [ ] Integración con Google Calendar para plazos\n- [ ] Informes en PDF semanales automáticos';
        clone.project.contributingContent = 'Abre un Pull Request describiendo tus mejoras o informa de problemas abriendo un problema (Issue).';
        clone.project.authorsContent = '- **Juan Pérez** - *Desarrollador Principal* - [@juanperez](https://github.com/juanperez)';
        clone.project.contactContent = 'Desarrollado por Juan Pérez - juan.perez@email.com';
        clone.project.testsContent = 'Ejecuta las pruebas con:\n```bash\nnpm run test\n```';
      } else if (clone.id === 'tpl-game') {
        clone.name = 'Juego (2D/3D)';
        clone.category = 'Juegos';
        clone.description = 'Diseño para videojuegos indie, web, móviles o de escritorio.';
        clone.project.name = 'Pixel Knight';
        clone.project.description = 'Juego estilo metroidvania 2D de aventura y combate hack-and-slash en pixel-art desarrollado con motor HTML5.';
        clone.project.features = [
          'Movimiento fluido basado en fotogramas',
          'Audio posicional para efectos y música',
          'Inteligencia artificial básica para enemigos',
          'Sistema de inventario y mejoras de armas'
        ];
        clone.project.prerequisitesContent = '- Cualquier navegador moderno con soporte WebGL\n- Node.js instalado para el servidor de pruebas local';
        clone.project.scriptsContent = '- `npm start`: Inicia el servidor de desarrollo y lo abre en el navegador\n- `npm run build`: Genera el paquete de producción final en `/dist`';
        clone.project.roadmapContent = '- [x] Implementación física de doble salto y esquiva\n- [ ] Creación del mapa del Bosque Sombrío\n- [ ] Lanzamiento oficial en la plataforma itch.io';
        clone.project.contributingContent = 'Si deseas colaborar con arte, audio o código, consulta nuestra guía de contribución.';
        clone.project.acknowledgementsContent = '- Comunidad de Phaser por los excelentes complementos de código abierto\n- Artista de OpenGameArt que diseñó los conjuntos de mapas medievales';
        clone.project.contactContent = 'Para asociaciones y contacto: dev@pixelknightgame.com';
      } else if (clone.id === 'tpl-api') {
        clone.name = 'API REST / GraphQL';
        clone.category = 'Backend';
        clone.description = 'Enfocado en APIs de backend, microservicios y documentación de endpoints.';
        clone.project.name = 'E-Commerce Core API';
        clone.project.description = 'API de alto rendimiento para control de carritos, inventario, cálculo de envío y pago seguro.';
        clone.project.features = [
          'Autenticación JWT con Tokens de Refresco',
          'Cálculo de rutas y entrega integrado con el sistema postal',
          'Garantía de concurrencia de stock mediante colas Redis',
          'Documentación OpenAPI/Swagger interactiva completa'
        ];
        clone.project.prerequisitesContent = '- Docker instalado en la máquina\n- Node.js v18.x\n- Claves de sandbox para pasarela de pago';
        clone.project.scriptsContent = '- `npm run dev`: Ejecuta la API con ts-node-dev y monitoreo de cambios\n- `npm run migrate`: Ejecuta las migraciones de la base de datos Prisma\n- `npm test`: Ejecuta pruebas unitarias y de integración con Jest';
        clone.project.contributingContent = 'Abre problemas detallando errores o envía solicitudes de mejora. Sigue las convenciones de commit en Conventional Commits.';
        clone.project.authorsContent = '- **Ana Clara** - *Tech Lead Backend* - [@anaclara](https://github.com/anaclara)';
        clone.project.contactContent = 'Correo de soporte: api-support@ecommercecore.com';
        clone.project.testsContent = 'Suite completa de pruebas mediante:\n```bash\nnpm run test\nnpm run test:coverage\n```';
      } else if (clone.id === 'tpl-mobile') {
        clone.name = 'Aplicación Móvil';
        clone.category = 'Móvil';
        clone.description = 'Perfecto para aplicaciones Android, iOS o multiplataforma (React Native, Flutter).';
        clone.project.name = 'FitPulse App';
        clone.project.description = 'Aplicación móvil para monitoreo físico, programación de entrenamientos, cálculo de IMC y seguimiento de hidratación diaria con recordatorios.';
        clone.project.features = [
          'Recordatorios diarios por notificaciones push locales',
          'Rastreador interactivo de consumo de agua',
          'Gráficos de progreso de peso y ejercicios',
          'Funcionamiento 100% sin conexión (offline)'
        ];
        clone.project.prerequisitesContent = '- Aplicación Expo Go instalada en smartphone Android/iOS\n- O emulador Android Studio / simulador Xcode configurado';
        clone.project.scriptsContent = '- `npx expo start`: Abre el panel de Metro Bundler\n- `npm run android`: Ejecuta la app directamente en el emulador Android conectado\n- `npm run ios`: Ejecuta la app directamente en el emulador iOS local';
        clone.project.roadmapContent = '- [x] Inicio de sesión y perfil de usuario\n- [x] Cronómetro y recordatorios de hidratación\n- [ ] Sincronización automática con Apple Health y Google Fit\n- [ ] Compartir logros en redes sociales';
        clone.project.contributingContent = 'Las solicitudes de extracción son bienvenidas. Asegúrese de que el código pase el ESLint de Expo antes de enviarlo.';
        clone.project.contactContent = 'Preguntas o comentarios: mobile-support@fitpulse.app';
      } else if (clone.id === 'tpl-library') {
        clone.name = 'Biblioteca / Paquete NPM';
        clone.category = 'Utilidades / Paquetes';
        clone.description = 'Enfocado en paquetes reutilizables, utilitários, ganchos (hooks), bibliotecas o complementos.';
        clone.project.name = 'date-utils-ptbr';
        clone.project.description = 'Biblioteca ultra ligera en TypeScript para formatear, validar y manipular fechas en formato brasileño, con soporte para días festivos nacionales y años bisiestos.';
        clone.project.features = [
          'Tamaño extremadamente reducido (< 2KB gzip)',
          'Soporte para todos los días festivos móviles brasileños (Pascua, Carnaval, etc.)',
          'Formateo intuitivo en portugués brasileño',
          'Compatible con ESModules y CommonJS'
        ];
        clone.project.scriptsContent = '- `npm run build`: Compila la biblioteca para ESM y CJS usando esbuild\n- `npm run test`: Ejecuta las pruebas de formateo con Vitest\n- `npm run benchmark`: Compara el rendimiento con otras bibliotecas populares';
        clone.project.contributingContent = 'Informa de errores abriendo problemas o crea un PR con nuevos métodos útiles.';
        clone.project.authorsContent = '- **Carla Mendes** - *Creadora de la biblioteca* - [@carlamendes](https://github.com/carlamendes)';
        clone.project.contactContent = 'Envía sugerencias a carla.mendes@email.com';
        clone.project.testsContent = 'La biblioteca cuenta con 100% de cobertura de código. Prueba localmente ejecutando:\n```bash\nnpm run test\n```';
      } else if (clone.id === 'tpl-portfolio') {
        clone.name = 'Sitio Web de Portafolio';
        clone.category = 'Personal';
        clone.description = 'Perfecto para que los desarrolladores muestren sus trabajos, contactos y proyectos.';
        clone.project.name = 'DevPortfolio';
        clone.project.description = 'Portafolio elegante, minimalista y de alta velocidad para exhibir proyectos de desarrollo, experiencia profesional y enlaces de contacto.';
        clone.project.features = [
          'Formulario de contacto directo y validado mediante EmailJS',
          'Animaciones de desplazamiento suaves y fluidas',
          'Bento Grid de proyectos destacados',
          'Soporte completo de accesibilidad (lectores de pantalla)'
        ];
        clone.project.scriptsContent = '- `npm run dev`: Se ejecuta en desarrollo local rápido\n- `npm run build`: Genera los archivos estáticos optimizados para alojamiento (Vercel, Netlify, Github Pages)';
        clone.project.acknowledgementsContent = '- Inspiraciones de diseño tomadas de Dribbble y Behance\n- Fuentes provistas por Google Fonts';
        clone.project.contactContent = '¡Disponible para freelance y nuevas oportunidades! Conéctate conmigo en LinkedIn o envía un mensaje por el formulario.';
      } else if (clone.id === 'tpl-academic') {
        clone.name = 'Proyecto Académico';
        clone.category = 'Académico';
        clone.description = 'Estructura completa para tesis, artículos científicos, investigaciones o proyectos de fin de carrera.';
        clone.project.name = 'Análisis Epidemiológico SmartData';
        clone.project.description = 'Proyecto de investigación y desarrollo centrado en el modelado computacional de la propagación de patógenos en entornos urbanos densos.';
        clone.project.features = [
          'Modelos de simulación computacional SEIR',
          'Procesamiento estadístico de datos demográficos reales',
          'Visualización gráfica interactiva de curvas de contagio',
          'Exportación automática de informes académicos formateados'
        ];
        clone.project.prerequisitesContent = '- Python 3.10 o superior\n- Entorno virtual (venv) configurado\n- Instalación local de compilador LaTeX (para generación de informes)';
        clone.project.folderStructureContent = '```text\ndata/\n  ├── raw/            # Datos brutos anonimizados\n  └── processed/      # Datos limpios para modelado\nnotebooks/            # Experimentos y borradores de análisis\nsrc/\n  ├── model/          # Implementación de ecuaciones diferenciales\n  └── visualization/  # Scripts de trazado y mapas\n```';
        clone.project.authorsContent = '- **Dra. Helena Souza** - *Investigadora Principal* - [Lattes](http://lattes.cnpq.br/0000)\n- **Dr. Arthur Lima** - *Co-asesor* - [Lattes](http://lattes.cnpq.br/1111)';
        clone.project.acknowledgementsContent = '- Al CNPq por el apoyo financiero y las becas de investigación concedidas\n- Al Departamento de Computación Científica de la Universidad Federal';
        clone.project.contactContent = 'Contacto para dudas académicas: helena.souza@universidade.edu';
      }
    }

    return clone;
  });
}
