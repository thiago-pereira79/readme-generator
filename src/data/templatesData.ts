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
  deployUrl: 'https://thiago-pereira79.github.io/space-impacta/',
  websiteUrl: '',
  authorName: 'Thiago Pereira',
  authorEmail: 't.firmiano.79@gmail.com',
  authorUrl: 'https://github.com/thiago-pereira79',
  linkedinUrl: 'https://www.linkedin.com/in/thiago-pereira79/',
  screenshots: [],
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
  contactContent: '',
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

function cloneTemplateData<T>(value: T): T {
  if (typeof structuredClone === 'function') {
    return structuredClone(value);
  }

  return JSON.parse(JSON.stringify(value)) as T;
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
      name: 'FlowDesk Dashboard',
      description: 'Dashboard SaaS para organizar projetos, tarefas, metas e indicadores de produtividade de pequenas equipes em uma interface centralizada, responsiva e intuitiva.',
      technologies: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Recharts', 'Zustand'],
      features: [
        'Dashboard com indicadores de produtividade e desempenho',
        'Quadro Kanban para organização de tarefas',
        'CRUD completo de projetos, tarefas e responsáveis',
        'Filtros por status, prioridade, prazo e responsável',
        'Gráficos interativos para acompanhamento de metas',
        'Modo claro e escuro',
        'Layout responsivo para desktop, tablet e celular',
        'Persistência local dos dados do usuário'
      ],
      installation: 'git clone https://github.com/seu-usuario/flowdesk-dashboard.git\ncd flowdesk-dashboard\nnpm install',
      usage: 'npm run dev',
      license: 'MIT',
      repositoryUrl: '',
      deployUrl: '',
      websiteUrl: '',
      authorName: '',
      authorEmail: '',
      authorUrl: '',
      linkedinUrl: '',
      screenshots: [],
      optionalSections: {
        prerequisites: true,
        scripts: true,
        folderStructure: true,
        roadmap: true,
        contributing: true,
        authors: false,
        acknowledgements: false,
        contact: false,
        tests: true
      },
      prerequisitesContent: '- Node.js 20 ou superior\n- npm 10 ou superior\n- Navegador moderno com suporte a JavaScript',
      scriptsContent: '- `npm run dev`: inicia o servidor de desenvolvimento\n- `npm run build`: gera a versão otimizada para produção\n- `npm run preview`: executa localmente o build de produção\n- `npm run lint`: verifica a qualidade do código\n- `npm run test`: executa os testes automatizados',
      folderStructureContent: '```text\nsrc/\n├── components/     # Componentes reutilizáveis\n├── pages/          # Telas principais da aplicação\n├── store/          # Gerenciamento de estado\n├── services/       # Serviços e persistência de dados\n├── hooks/          # Hooks personalizados\n├── utils/          # Funções auxiliares\n└── types/          # Tipagens TypeScript\n```',
      roadmapContent: '- [x] Dashboard com indicadores\n- [x] CRUD de projetos e tarefas\n- [x] Quadro Kanban\n- [x] Modo escuro\n- [ ] Autenticação de usuários\n- [ ] Colaboração em tempo real\n- [ ] Exportação de relatórios em PDF',
      contributingContent: 'Contribuições são bem-vindas. Crie uma branch para sua alteração, realize os testes necessários e envie um Pull Request com uma descrição clara da melhoria.',
      testsContent: 'Execute os testes com:\n```bash\nnpm run test\n```'
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
      description: 'Jogo de aventura e ação em pixel art no qual o jogador explora ruínas antigas, enfrenta criaturas, coleta habilidades e desbloqueia novas regiões do mapa.',
      technologies: ['TypeScript', 'Phaser 3', 'Vite', 'HTML5 Canvas', 'Web Audio API', 'Vitest'],
      features: [
        'Movimentação fluida com corrida, salto e esquiva',
        'Sistema de combate corpo a corpo',
        'Inimigos com diferentes padrões de comportamento',
        'Sistema de vida, dano e invencibilidade temporária',
        'Checkpoints e progressão entre áreas',
        'Itens colecionáveis e melhorias de habilidades',
        'Suporte a teclado e gamepad',
        'Trilha sonora e efeitos sonoros dinâmicos'
      ],
      installation: 'git clone https://github.com/seu-usuario/pixel-knight.git\ncd pixel-knight\nnpm install',
      usage: 'npm run dev',
      license: 'MIT',
      repositoryUrl: '',
      deployUrl: '',
      websiteUrl: '',
      authorName: '',
      authorEmail: '',
      authorUrl: '',
      linkedinUrl: '',
      screenshots: [],
      optionalSections: {
        prerequisites: true,
        scripts: true,
        folderStructure: true,
        roadmap: true,
        contributing: true,
        authors: false,
        acknowledgements: true,
        contact: false,
        tests: true
      },
      prerequisitesContent: '- Node.js 20 ou superior\n- Navegador com suporte a HTML5 Canvas\n- Teclado ou controle compatível',
      scriptsContent: '- `npm run dev`: inicia o jogo em modo de desenvolvimento\n- `npm run build`: gera os arquivos de produção\n- `npm run preview`: executa o build localmente\n- `npm run test`: executa os testes automatizados',
      folderStructureContent: '```text\nsrc/\n├── scenes/         # Cenas e fases do jogo\n├── entities/       # Jogador, inimigos e objetos\n├── systems/        # Combate, colisão e progressão\n├── assets/         # Imagens, sons e fontes\n├── config/         # Configurações gerais\n└── utils/          # Funções auxiliares\n```',
      roadmapContent: '- [x] Movimentação principal\n- [x] Sistema básico de combate\n- [x] Primeira região jogável\n- [ ] Sistema completo de chefes\n- [ ] Novas habilidades desbloqueáveis\n- [ ] Suporte a salvamento em nuvem',
      contributingContent: 'Abra uma Issue antes de implementar alterações maiores. Para correções e melhorias menores, crie uma branch e envie um Pull Request com os testes realizados.',
      acknowledgementsContent: '- Comunidade Phaser\n- Projetos open source de jogos em HTML5\n- Artistas independentes de pixel art',
      testsContent: '```bash\nnpm run test\n```'
    }
  },
  {
    id: 'tpl-api',
    name: 'API REST / GraphQL',
    category: 'Backend',
    description: 'Focado em APIs backend, microsserviços e documentações de endpoints.',
    icon: 'Server',
    project: {
      name: 'CommerceCore API',
      description: 'API para gerenciamento de produtos, clientes, pedidos e estoque, desenvolvida com arquitetura modular, autenticação segura e documentação interativa.',
      technologies: ['Node.js', 'Express', 'TypeScript', 'Prisma ORM', 'PostgreSQL', 'Swagger', 'Vitest'],
      features: [
        'Cadastro e autenticação de usuários',
        'Controle de permissões por perfil',
        'CRUD de produtos, clientes e pedidos',
        'Controle de estoque',
        'Paginação, filtros e ordenação',
        'Validação de dados de entrada',
        'Tratamento centralizado de erros',
        'Documentação interativa com Swagger',
        'Testes unitários e de integração'
      ],
      installation: 'git clone https://github.com/seu-usuario/commercecore-api.git\ncd commercecore-api\nnpm install\ncp .env.example .env\nnpx prisma migrate dev',
      usage: 'npm run dev',
      license: 'MIT',
      repositoryUrl: '',
      deployUrl: '',
      websiteUrl: '',
      authorName: '',
      authorEmail: '',
      authorUrl: '',
      linkedinUrl: '',
      screenshots: [],
      optionalSections: {
        prerequisites: true,
        scripts: true,
        folderStructure: true,
        roadmap: true,
        contributing: true,
        authors: false,
        acknowledgements: false,
        contact: false,
        tests: true
      },
      prerequisitesContent: '- Node.js 20 ou superior\n- PostgreSQL instalado ou disponível em container\n- Arquivo `.env` configurado',
      scriptsContent: '- `npm run dev`: inicia a API em desenvolvimento\n- `npm run build`: compila o projeto\n- `npm run start`: executa a versão de produção\n- `npm run test`: executa os testes\n- `npm run prisma:migrate`: executa as migrações\n- `npm run prisma:studio`: abre o painel do Prisma',
      folderStructureContent: '```text\nsrc/\n├── controllers/    # Controladores das rotas\n├── services/       # Regras de negócio\n├── repositories/   # Acesso aos dados\n├── routes/         # Definição dos endpoints\n├── middlewares/    # Autenticação e validações\n├── schemas/        # Esquemas de validação\n├── config/         # Configurações da aplicação\n└── tests/          # Testes automatizados\n```',
      roadmapContent: '- [x] CRUD de produtos\n- [x] CRUD de clientes\n- [x] Controle de pedidos\n- [x] Documentação Swagger\n- [ ] Integração com gateway de pagamento\n- [ ] Sistema de filas\n- [ ] Cache com Redis\n- [ ] Monitoramento e métricas',
      contributingContent: 'Crie uma branch a partir da `main`, siga os padrões do projeto e envie um Pull Request acompanhado dos testes correspondentes.',
      testsContent: '```bash\nnpm run test\nnpm run test:coverage\n```'
    }
  },
  {
    id: 'tpl-mobile',
    name: 'Aplicativo Mobile',
    category: 'Mobile',
    description: 'Perfeito para apps Android, iOS ou multi-plataforma (React Native, Flutter).',
    icon: 'Smartphone',
    project: {
      name: 'FitPulse',
      description: 'Aplicativo mobile para acompanhamento de hábitos saudáveis, hidratação, exercícios, metas pessoais e evolução física, com funcionamento offline.',
      technologies: ['Flutter', 'Dart', 'Hive', 'fl_chart', 'flutter_local_notifications'],
      features: [
        'Registro diário de hidratação',
        'Criação de hábitos e metas pessoais',
        'Acompanhamento de exercícios',
        'Histórico de atividades',
        'Gráficos de evolução',
        'Notificações locais personalizadas',
        'Funcionamento offline',
        'Interface adaptada para Android e iOS',
        'Modo claro e escuro'
      ],
      installation: 'git clone https://github.com/seu-usuario/fitpulse.git\ncd fitpulse\nflutter pub get',
      usage: 'flutter run',
      license: 'MIT',
      repositoryUrl: '',
      deployUrl: '',
      websiteUrl: '',
      authorName: '',
      authorEmail: '',
      authorUrl: '',
      linkedinUrl: '',
      screenshots: [],
      optionalSections: {
        prerequisites: true,
        scripts: true,
        folderStructure: true,
        roadmap: true,
        contributing: true,
        authors: false,
        acknowledgements: false,
        contact: false,
        tests: true
      },
      prerequisitesContent: '- Flutter SDK instalado\n- Dart SDK compatível\n- Android Studio, Xcode ou dispositivo físico\n- Emulador Android ou simulador iOS configurado',
      scriptsContent: '- `flutter run`: executa o aplicativo\n- `flutter test`: executa os testes\n- `flutter analyze`: verifica problemas no código\n- `flutter build apk`: gera o aplicativo Android\n- `flutter build ios`: gera a versão para iOS',
      folderStructureContent: '```text\nlib/\n├── screens/        # Telas do aplicativo\n├── widgets/        # Componentes reutilizáveis\n├── models/         # Modelos de dados\n├── services/       # Persistência e notificações\n├── providers/      # Gerenciamento de estado\n├── theme/          # Tema e identidade visual\n└── utils/          # Funções auxiliares\n```',
      roadmapContent: '- [x] Controle de hidratação\n- [x] Cadastro de hábitos\n- [x] Notificações locais\n- [x] Gráficos de evolução\n- [ ] Sincronização entre dispositivos\n- [ ] Integração com Google Fit\n- [ ] Integração com Apple Health',
      contributingContent: 'Antes de enviar alterações, execute `flutter analyze` e `flutter test`. Explique claramente a melhoria realizada no Pull Request.',
      testsContent: '```bash\nflutter test\n```'
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
      description: 'Biblioteca leve em TypeScript para formatação, validação e manipulação de datas no padrão brasileiro.',
      technologies: ['TypeScript', 'tsup', 'Vitest', 'npm', 'ESLint'],
      features: [
        'Formatação de datas no padrão brasileiro',
        'Conversão entre texto e objetos Date',
        'Validação de datas',
        'Cálculo de intervalos entre datas',
        'Identificação de anos bissextos',
        'Suporte a feriados nacionais',
        'Compatibilidade com ESM e CommonJS',
        'Tipagens TypeScript incluídas',
        'Suporte a tree shaking'
      ],
      installation: 'npm install date-utils-ptbr',
      usage: '```typescript\nimport { formatarData, diferencaEmDias } from \'date-utils-ptbr\';\n\nconst data = new Date(2026, 6, 14);\n\nconsole.log(formatarData(data));\n// 14/07/2026\n\nconsole.log(diferencaEmDias(\n  new Date(2026, 6, 14),\n  new Date(2026, 6, 20)\n));\n// 6\n```',
      license: 'MIT',
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
        scripts: true,
        folderStructure: true,
        roadmap: true,
        contributing: true,
        authors: false,
        acknowledgements: false,
        contact: false,
        tests: true
      },
      scriptsContent: '- `npm run build`: gera as versões ESM e CommonJS\n- `npm run test`: executa os testes\n- `npm run lint`: verifica a qualidade do código\n- `npm run typecheck`: executa a verificação do TypeScript',
      folderStructureContent: '```text\nsrc/\n├── formatters/     # Funções de formatação\n├── validators/     # Validações de datas\n├── calculators/    # Cálculos e intervalos\n├── holidays/       # Regras de feriados\n├── types/          # Tipagens públicas\n└── index.ts        # Exportações da biblioteca\n```',
      roadmapContent: '- [x] Formatação de datas\n- [x] Validação de datas\n- [x] Cálculo de intervalos\n- [ ] Feriados estaduais\n- [ ] Localização para outros países\n- [ ] Plugin para frameworks front-end',
      contributingContent: 'Novas funções devem incluir documentação, tipagem completa e testes automatizados.',
      testsContent: '```bash\nnpm run test\nnpm run typecheck\n```'
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
      description: 'Portfólio pessoal minimalista e responsivo para apresentar projetos, experiências, habilidades e formas de contato.',
      technologies: ['React', 'TypeScript', 'Vite', 'Motion', 'CSS Modules', 'EmailJS'],
      features: [
        'Página inicial com apresentação profissional',
        'Projetos exibidos em formato de estudos de caso',
        'Seção de habilidades e tecnologias',
        'Linha do tempo de experiências',
        'Formulário de contato',
        'Modo claro e escuro',
        'Animações suaves e acessíveis',
        'SEO básico e metadados sociais',
        'Layout responsivo',
        'Navegação por teclado e suporte a leitores de tela'
      ],
      installation: 'git clone https://github.com/seu-usuario/devportfolio.git\ncd devportfolio\nnpm install',
      usage: 'npm run dev',
      license: 'MIT',
      repositoryUrl: '',
      deployUrl: '',
      websiteUrl: '',
      authorName: '',
      authorEmail: '',
      authorUrl: '',
      linkedinUrl: '',
      screenshots: [],
      optionalSections: {
        prerequisites: true,
        scripts: true,
        folderStructure: true,
        roadmap: true,
        contributing: false,
        authors: false,
        acknowledgements: true,
        contact: false,
        tests: true
      },
      prerequisitesContent: '- Node.js 20 ou superior\n- npm 10 ou superior',
      scriptsContent: '- `npm run dev`: inicia o ambiente de desenvolvimento\n- `npm run build`: gera o portfólio para produção\n- `npm run preview`: visualiza o build localmente\n- `npm run lint`: verifica o código\n- `npm run test`: executa os testes',
      folderStructureContent: '```text\nsrc/\n├── components/     # Componentes reutilizáveis\n├── sections/       # Seções da página\n├── pages/          # Páginas e estudos de caso\n├── data/           # Dados dos projetos\n├── assets/         # Imagens e arquivos visuais\n├── styles/         # Estilos globais\n└── utils/          # Funções auxiliares\n```',
      roadmapContent: '- [x] Página inicial\n- [x] Seção de projetos\n- [x] Formulário de contato\n- [x] Responsividade\n- [ ] Painel para editar projetos\n- [ ] Blog integrado\n- [ ] Internacionalização',
      acknowledgementsContent: '- Comunidade React\n- Projetos open source de acessibilidade\n- Referências de design e desenvolvimento disponíveis na comunidade',
      testsContent: '```bash\nnpm run test\n```'
    }
  },
  {
    id: 'tpl-academic',
    name: 'Projeto Acadêmico',
    category: 'Acadêmico / Científico',
    description: 'Estrutura completa para teses, artigos científicos, pesquisas ou Trabalhos de Conclusão de Curso (TCC).',
    icon: 'GraduationCap',
    project: {
      name: 'BioData — Análise de Biodiversidade Urbana',
      description: 'Projeto acadêmico para organização, tratamento e visualização de dados sobre biodiversidade em áreas urbanas.',
      technologies: ['Python', 'Jupyter Notebook', 'Pandas', 'Matplotlib', 'GeoPandas', 'Pytest'],
      features: [
        'Importação de dados em CSV',
        'Limpeza e padronização dos registros',
        'Identificação de espécies observadas',
        'Cálculo de indicadores de diversidade',
        'Comparação entre diferentes regiões',
        'Visualização de dados em gráficos',
        'Geração de mapas de distribuição',
        'Notebooks reproduzíveis',
        'Exportação de resultados para relatórios'
      ],
      installation: 'git clone https://github.com/seu-usuario/biodata.git\ncd biodata\npython -m venv .venv\npip install -r requirements.txt',
      usage: 'jupyter notebook notebooks/analise_biodiversidade.ipynb',
      license: 'MIT',
      repositoryUrl: '',
      deployUrl: '',
      websiteUrl: '',
      authorName: '',
      authorEmail: '',
      authorUrl: '',
      linkedinUrl: '',
      screenshots: [],
      optionalSections: {
        prerequisites: true,
        scripts: false,
        folderStructure: true,
        roadmap: true,
        contributing: true,
        authors: false,
        acknowledgements: true,
        contact: false,
        tests: true
      },
      prerequisitesContent: '- Python 3.11 ou superior\n- Ambiente virtual Python\n- Jupyter Notebook ou JupyterLab\n- Arquivos de dados em formato CSV',
      folderStructureContent: '```text\ndata/\n├── raw/             # Dados originais\n└── processed/       # Dados tratados\n\nnotebooks/\n├── exploracao.ipynb\n└── analise_biodiversidade.ipynb\n\nsrc/\n├── cleaning/        # Limpeza dos dados\n├── analysis/        # Funções de análise\n├── visualization/   # Gráficos e mapas\n└── utils/           # Funções auxiliares\n\ntests/               # Testes automatizados\nreports/             # Relatórios exportados\n```',
      roadmapContent: '- [x] Importação dos dados\n- [x] Limpeza e padronização\n- [x] Gráficos exploratórios\n- [ ] Mapas interativos\n- [ ] Comparação entre períodos\n- [ ] Painel web para consulta pública',
      contributingContent: 'Contribuições devem preservar a rastreabilidade dos dados e explicar qualquer alteração realizada nos métodos de análise.',
      acknowledgementsContent: '- Comunidades científicas de dados abertos\n- Pesquisadores e observadores responsáveis pelos registros\n- Desenvolvedores das bibliotecas científicas utilizadas',
      testsContent: '```bash\npytest\n```'
    }
  }
];

type TemplateLocale = 'en-US' | 'es-419';

type TemplateLocalization = Partial<Omit<ReadmeTemplate, 'id' | 'project'>> & {
  project: Partial<ReadmeProject>;
};

const fictionalTemplateLocalizations: Record<TemplateLocale, Record<string, TemplateLocalization>> = {
  'en-US': {
    'tpl-web-app': {
      name: 'Web Application (SaaS)',
      category: 'SaaS / Web',
      description: 'Ideal for modern web systems, dashboards, and integrated SaaS platforms.',
      project: {
        name: 'FlowDesk Dashboard',
        description: 'SaaS dashboard for organizing projects, tasks, goals, and productivity indicators for small teams in a centralized, responsive, and intuitive interface.',
        features: [
          'Dashboard with productivity and performance indicators',
          'Kanban board for task organization',
          'Complete CRUD for projects, tasks, and assignees',
          'Filters by status, priority, due date, and assignee',
          'Interactive charts for goal tracking',
          'Light and dark mode',
          'Responsive layout for desktop, tablet, and mobile',
          'Local persistence of user data'
        ],
        prerequisitesContent: '- Node.js 20 or higher\n- npm 10 or higher\n- Modern browser with JavaScript support',
        scriptsContent: '- `npm run dev`: starts the development server\n- `npm run build`: generates the optimized production version\n- `npm run preview`: runs the production build locally\n- `npm run lint`: checks code quality\n- `npm run test`: runs automated tests',
        folderStructureContent: '```text\nsrc/\n├── components/     # Reusable components\n├── pages/          # Main application screens\n├── store/          # State management\n├── services/       # Services and data persistence\n├── hooks/          # Custom hooks\n├── utils/          # Helper functions\n└── types/          # TypeScript typings\n```',
        roadmapContent: '- [x] Dashboard with indicators\n- [x] Project and task CRUD\n- [x] Kanban board\n- [x] Dark mode\n- [ ] User authentication\n- [ ] Real-time collaboration\n- [ ] PDF report export',
        contributingContent: 'Contributions are welcome. Create a branch for your change, run the necessary tests, and submit a Pull Request with a clear description of the improvement.',
        authorsContent: '',
        contactContent: '',
        testsContent: 'Run the tests with:\n```bash\nnpm run test\n```'
      }
    },
    'tpl-game': {
      name: 'Game (2D/3D)',
      category: 'Games',
      description: 'Layout for indie, web, mobile, or desktop games.',
      project: {
        name: 'Pixel Knight',
        description: 'Pixel art action-adventure game where the player explores ancient ruins, fights creatures, collects abilities, and unlocks new map regions.',
        features: [
          'Fluid movement with running, jumping, and dodging',
          'Melee combat system',
          'Enemies with different behavior patterns',
          'Health, damage, and temporary invincibility system',
          'Checkpoints and progression between areas',
          'Collectible items and ability upgrades',
          'Keyboard and gamepad support',
          'Dynamic soundtrack and sound effects'
        ],
        prerequisitesContent: '- Node.js 20 or higher\n- Browser with HTML5 Canvas support\n- Compatible keyboard or controller',
        scriptsContent: '- `npm run dev`: starts the game in development mode\n- `npm run build`: generates production files\n- `npm run preview`: runs the build locally\n- `npm run test`: runs automated tests',
        folderStructureContent: '```text\nsrc/\n├── scenes/         # Game scenes and levels\n├── entities/       # Player, enemies, and objects\n├── systems/        # Combat, collision, and progression\n├── assets/         # Images, sounds, and fonts\n├── config/         # General settings\n└── utils/          # Helper functions\n```',
        roadmapContent: '- [x] Core movement\n- [x] Basic combat system\n- [x] First playable region\n- [ ] Complete boss system\n- [ ] New unlockable abilities\n- [ ] Cloud save support',
        contributingContent: 'Open an Issue before implementing larger changes. For smaller fixes and improvements, create a branch and submit a Pull Request with the tests performed.',
        acknowledgementsContent: '- Phaser community\n- Open source HTML5 game projects\n- Independent pixel art artists',
        contactContent: '',
        testsContent: '```bash\nnpm run test\n```'
      }
    },
    'tpl-api': {
      name: 'REST / GraphQL API',
      category: 'Backend',
      description: 'Focused on backend APIs, microservices, and endpoint documentation.',
      project: {
        name: 'CommerceCore API',
        description: 'API for managing products, customers, orders, and inventory, built with modular architecture, secure authentication, and interactive documentation.',
        features: [
          'User registration and authentication',
          'Role-based permission control',
          'CRUD for products, customers, and orders',
          'Inventory control',
          'Pagination, filters, and sorting',
          'Input data validation',
          'Centralized error handling',
          'Interactive Swagger documentation',
          'Unit and integration tests'
        ],
        prerequisitesContent: '- Node.js 20 or higher\n- PostgreSQL installed or available in a container\n- Configured `.env` file',
        scriptsContent: '- `npm run dev`: starts the API in development\n- `npm run build`: compiles the project\n- `npm run start`: runs the production version\n- `npm run test`: runs the tests\n- `npm run prisma:migrate`: runs migrations\n- `npm run prisma:studio`: opens the Prisma panel',
        folderStructureContent: '```text\nsrc/\n├── controllers/    # Route controllers\n├── services/       # Business rules\n├── repositories/   # Data access\n├── routes/         # Endpoint definitions\n├── middlewares/    # Authentication and validations\n├── schemas/        # Validation schemas\n├── config/         # Application settings\n└── tests/          # Automated tests\n```',
        roadmapContent: '- [x] Product CRUD\n- [x] Customer CRUD\n- [x] Order control\n- [x] Swagger documentation\n- [ ] Payment gateway integration\n- [ ] Queue system\n- [ ] Redis cache\n- [ ] Monitoring and metrics',
        contributingContent: 'Create a branch from `main`, follow the project standards, and submit a Pull Request with the corresponding tests.',
        authorsContent: '',
        contactContent: '',
        testsContent: '```bash\nnpm run test\nnpm run test:coverage\n```'
      }
    },
    'tpl-mobile': {
      name: 'Mobile App',
      category: 'Mobile',
      description: 'Perfect for Android, iOS, or cross-platform apps.',
      project: {
        name: 'FitPulse',
        description: 'Mobile app for tracking healthy habits, hydration, exercises, personal goals, and physical progress with offline support.',
        features: [
          'Daily hydration tracking',
          'Creation of habits and personal goals',
          'Exercise tracking',
          'Activity history',
          'Progress charts',
          'Custom local notifications',
          'Offline operation',
          'Interface adapted for Android and iOS',
          'Light and dark mode'
        ],
        prerequisitesContent: '- Flutter SDK installed\n- Compatible Dart SDK\n- Android Studio, Xcode, or physical device\n- Configured Android emulator or iOS simulator',
        scriptsContent: '- `flutter run`: runs the app\n- `flutter test`: runs the tests\n- `flutter analyze`: checks code issues\n- `flutter build apk`: generates the Android app\n- `flutter build ios`: generates the iOS version',
        folderStructureContent: '```text\nlib/\n├── screens/        # App screens\n├── widgets/        # Reusable components\n├── models/         # Data models\n├── services/       # Persistence and notifications\n├── providers/      # State management\n├── theme/          # Theme and visual identity\n└── utils/          # Helper functions\n```',
        roadmapContent: '- [x] Hydration tracking\n- [x] Habit registration\n- [x] Local notifications\n- [x] Progress charts\n- [ ] Device synchronization\n- [ ] Google Fit integration\n- [ ] Apple Health integration',
        contributingContent: 'Before submitting changes, run `flutter analyze` and `flutter test`. Clearly explain the improvement in the Pull Request.',
        contactContent: '',
        testsContent: '```bash\nflutter test\n```'
      }
    },
    'tpl-library': {
      name: 'Library / NPM Package',
      category: 'Utilities / Packages',
      description: 'Focused on reusable packages, utilities, hooks, libraries, or plugins.',
      project: {
        name: 'date-utils-ptbr',
        description: 'Lightweight TypeScript library for formatting, validating, and manipulating dates in the Brazilian standard.',
        features: [
          'Date formatting in the Brazilian standard',
          'Conversion between text and Date objects',
          'Date validation',
          'Interval calculation between dates',
          'Leap year identification',
          'Support for Brazilian national holidays',
          'ESM and CommonJS compatibility',
          'Included TypeScript typings',
          'Tree shaking support'
        ],
        scriptsContent: '- `npm run build`: generates ESM and CommonJS versions\n- `npm run test`: runs tests\n- `npm run lint`: checks code quality\n- `npm run typecheck`: runs TypeScript verification',
        folderStructureContent: '```text\nsrc/\n├── formatters/     # Formatting functions\n├── validators/     # Date validations\n├── calculators/    # Calculations and intervals\n├── holidays/       # Holiday rules\n├── types/          # Public typings\n└── index.ts        # Library exports\n```',
        roadmapContent: '- [x] Date formatting\n- [x] Date validation\n- [x] Interval calculation\n- [ ] State holidays\n- [ ] Localization for other countries\n- [ ] Plugin for front-end frameworks',
        contributingContent: 'New functions must include documentation, complete typing, and automated tests.',
        authorsContent: '',
        contactContent: '',
        testsContent: '```bash\nnpm run test\nnpm run typecheck\n```'
      }
    },
    'tpl-portfolio': {
      name: 'Portfolio Website',
      category: 'Personal',
      description: 'Perfect for developers to display their work, contact information, and projects.',
      project: {
        name: 'DevPortfolio',
        description: 'Minimalist and responsive personal portfolio for presenting projects, experience, skills, and contact options.',
        features: [
          'Home page with professional introduction',
          'Projects displayed as case studies',
          'Skills and technologies section',
          'Experience timeline',
          'Contact form',
          'Light and dark mode',
          'Smooth and accessible animations',
          'Basic SEO and social metadata',
          'Responsive layout',
          'Keyboard navigation and screen reader support'
        ],
        prerequisitesContent: '- Node.js 20 or higher\n- npm 10 or higher',
        scriptsContent: '- `npm run dev`: starts the development environment\n- `npm run build`: generates the portfolio for production\n- `npm run preview`: previews the build locally\n- `npm run lint`: checks the code\n- `npm run test`: runs the tests',
        folderStructureContent: '```text\nsrc/\n├── components/     # Reusable components\n├── sections/       # Page sections\n├── pages/          # Pages and case studies\n├── data/           # Project data\n├── assets/         # Images and visual files\n├── styles/         # Global styles\n└── utils/          # Helper functions\n```',
        roadmapContent: '- [x] Home page\n- [x] Projects section\n- [x] Contact form\n- [x] Responsiveness\n- [ ] Panel for editing projects\n- [ ] Integrated blog\n- [ ] Internationalization',
        acknowledgementsContent: '- React community\n- Open source accessibility projects\n- Design and development references available in the community',
        contactContent: '',
        testsContent: '```bash\nnpm run test\n```'
      }
    },
    'tpl-academic': {
      name: 'Academic Project',
      category: 'Academic',
      description: 'Complete structure for theses, scientific articles, research, or academic projects.',
      project: {
        name: 'BioData — Urban Biodiversity Analysis',
        description: 'Academic project for organizing, processing, and visualizing biodiversity data in urban areas.',
        features: [
          'CSV data import',
          'Record cleaning and standardization',
          'Identification of observed species',
          'Diversity indicator calculation',
          'Comparison between different regions',
          'Data visualization in charts',
          'Distribution map generation',
          'Reproducible notebooks',
          'Export of results to reports'
        ],
        prerequisitesContent: '- Python 3.11 or higher\n- Python virtual environment\n- Jupyter Notebook or JupyterLab\n- Data files in CSV format',
        folderStructureContent: '```text\ndata/\n├── raw/             # Original data\n└── processed/       # Processed data\n\nnotebooks/\n├── exploration.ipynb\n└── biodiversity_analysis.ipynb\n\nsrc/\n├── cleaning/        # Data cleaning\n├── analysis/        # Analysis functions\n├── visualization/   # Charts and maps\n└── utils/           # Helper functions\n\ntests/               # Automated tests\nreports/             # Exported reports\n```',
        roadmapContent: '- [x] Data import\n- [x] Cleaning and standardization\n- [x] Exploratory charts\n- [ ] Interactive maps\n- [ ] Comparison between periods\n- [ ] Public query web panel',
        contributingContent: 'Contributions must preserve data traceability and explain any changes made to the analysis methods.',
        authorsContent: '',
        acknowledgementsContent: '- Open data scientific communities\n- Researchers and observers responsible for the records\n- Developers of the scientific libraries used',
        contactContent: '',
        testsContent: '```bash\npytest\n```'
      }
    }
  },
  'es-419': {
    'tpl-web-app': {
      name: 'Aplicación Web (SaaS)',
      category: 'SaaS / Web',
      description: 'Ideal para sistemas web modernos, paneles de control y plataformas SaaS integradas.',
      project: {
        name: 'FlowDesk Dashboard',
        description: 'Dashboard SaaS para organizar proyectos, tareas, metas e indicadores de productividad de equipos pequeños en una interfaz centralizada, responsiva e intuitiva.',
        features: [
          'Dashboard con indicadores de productividad y rendimiento',
          'Tablero Kanban para organización de tareas',
          'CRUD completo de proyectos, tareas y responsables',
          'Filtros por estado, prioridad, plazo y responsable',
          'Gráficos interactivos para seguimiento de metas',
          'Modo claro y oscuro',
          'Layout responsivo para desktop, tablet y celular',
          'Persistencia local de los datos del usuario'
        ],
        prerequisitesContent: '- Node.js 20 o superior\n- npm 10 o superior\n- Navegador moderno con soporte para JavaScript',
        scriptsContent: '- `npm run dev`: inicia el servidor de desarrollo\n- `npm run build`: genera la versión optimizada para producción\n- `npm run preview`: ejecuta localmente el build de producción\n- `npm run lint`: verifica la calidad del código\n- `npm run test`: ejecuta las pruebas automatizadas',
        folderStructureContent: '```text\nsrc/\n├── components/     # Componentes reutilizables\n├── pages/          # Pantallas principales de la aplicación\n├── store/          # Gestión de estado\n├── services/       # Servicios y persistencia de datos\n├── hooks/          # Hooks personalizados\n├── utils/          # Funciones auxiliares\n└── types/          # Tipados TypeScript\n```',
        roadmapContent: '- [x] Dashboard con indicadores\n- [x] CRUD de proyectos y tareas\n- [x] Tablero Kanban\n- [x] Modo oscuro\n- [ ] Autenticación de usuarios\n- [ ] Colaboración en tiempo real\n- [ ] Exportación de informes en PDF',
        contributingContent: 'Las contribuciones son bienvenidas. Crea una rama para tu cambio, realiza las pruebas necesarias y envía un Pull Request con una descripción clara de la mejora.',
        authorsContent: '',
        contactContent: '',
        testsContent: 'Ejecuta las pruebas con:\n```bash\nnpm run test\n```'
      }
    },
    'tpl-game': {
      name: 'Juego (2D/3D)',
      category: 'Juegos',
      description: 'Diseño para juegos indie, web, móviles o de escritorio.',
      project: {
        name: 'Pixel Knight',
        description: 'Juego de aventura y acción en pixel art donde el jugador explora ruinas antiguas, enfrenta criaturas, recolecta habilidades y desbloquea nuevas regiones del mapa.',
        features: [
          'Movimiento fluido con carrera, salto y esquiva',
          'Sistema de combate cuerpo a cuerpo',
          'Enemigos con diferentes patrones de comportamiento',
          'Sistema de vida, daño e invencibilidad temporal',
          'Checkpoints y progresión entre áreas',
          'Objetos coleccionables y mejoras de habilidades',
          'Soporte para teclado y gamepad',
          'Banda sonora y efectos dinámicos'
        ],
        prerequisitesContent: '- Node.js 20 o superior\n- Navegador con soporte para HTML5 Canvas\n- Teclado o control compatible',
        scriptsContent: '- `npm run dev`: inicia el juego en modo de desarrollo\n- `npm run build`: genera los archivos de producción\n- `npm run preview`: ejecuta el build localmente\n- `npm run test`: ejecuta las pruebas automatizadas',
        folderStructureContent: '```text\nsrc/\n├── scenes/         # Escenas y fases del juego\n├── entities/       # Jugador, enemigos y objetos\n├── systems/        # Combate, colisión y progresión\n├── assets/         # Imágenes, sonidos y fuentes\n├── config/         # Configuraciones generales\n└── utils/          # Funciones auxiliares\n```',
        roadmapContent: '- [x] Movimiento principal\n- [x] Sistema básico de combate\n- [x] Primera región jugable\n- [ ] Sistema completo de jefes\n- [ ] Nuevas habilidades desbloqueables\n- [ ] Soporte para guardado en la nube',
        contributingContent: 'Abre una Issue antes de implementar cambios mayores. Para correcciones y mejoras menores, crea una rama y envía un Pull Request con las pruebas realizadas.',
        acknowledgementsContent: '- Comunidad Phaser\n- Proyectos open source de juegos en HTML5\n- Artistas independientes de pixel art',
        contactContent: '',
        testsContent: '```bash\nnpm run test\n```'
      }
    },
    'tpl-api': {
      name: 'API REST / GraphQL',
      category: 'Backend',
      description: 'Enfocado en APIs backend, microservicios y documentación de endpoints.',
      project: {
        name: 'CommerceCore API',
        description: 'API para gestionar productos, clientes, pedidos e inventario, desarrollada con arquitectura modular, autenticación segura y documentación interactiva.',
        features: [
          'Registro y autenticación de usuarios',
          'Control de permisos por perfil',
          'CRUD de productos, clientes y pedidos',
          'Control de inventario',
          'Paginación, filtros y ordenación',
          'Validación de datos de entrada',
          'Tratamiento centralizado de errores',
          'Documentación interactiva con Swagger',
          'Pruebas unitarias y de integración'
        ],
        prerequisitesContent: '- Node.js 20 o superior\n- PostgreSQL instalado o disponible en contenedor\n- Archivo `.env` configurado',
        scriptsContent: '- `npm run dev`: inicia la API en desarrollo\n- `npm run build`: compila el proyecto\n- `npm run start`: ejecuta la versión de producción\n- `npm run test`: ejecuta las pruebas\n- `npm run prisma:migrate`: ejecuta las migraciones\n- `npm run prisma:studio`: abre el panel de Prisma',
        folderStructureContent: '```text\nsrc/\n├── controllers/    # Controladores de rutas\n├── services/       # Reglas de negocio\n├── repositories/   # Acceso a datos\n├── routes/         # Definición de endpoints\n├── middlewares/    # Autenticación y validaciones\n├── schemas/        # Esquemas de validación\n├── config/         # Configuraciones de la aplicación\n└── tests/          # Pruebas automatizadas\n```',
        roadmapContent: '- [x] CRUD de productos\n- [x] CRUD de clientes\n- [x] Control de pedidos\n- [x] Documentación Swagger\n- [ ] Integración con gateway de pago\n- [ ] Sistema de colas\n- [ ] Caché con Redis\n- [ ] Monitoreo y métricas',
        contributingContent: 'Crea una rama a partir de `main`, sigue los patrones del proyecto y envía un Pull Request acompañado de las pruebas correspondientes.',
        authorsContent: '',
        contactContent: '',
        testsContent: '```bash\nnpm run test\nnpm run test:coverage\n```'
      }
    },
    'tpl-mobile': {
      name: 'Aplicación Móvil',
      category: 'Móvil',
      description: 'Perfecto para aplicaciones Android, iOS o multiplataforma.',
      project: {
        name: 'FitPulse',
        description: 'Aplicación móvil para seguimiento de hábitos saludables, hidratación, ejercicios, metas personales y evolución física, con funcionamiento offline.',
        features: [
          'Registro diario de hidratación',
          'Creación de hábitos y metas personales',
          'Seguimiento de ejercicios',
          'Historial de actividades',
          'Gráficos de evolución',
          'Notificaciones locales personalizadas',
          'Funcionamiento offline',
          'Interfaz adaptada para Android e iOS',
          'Modo claro y oscuro'
        ],
        prerequisitesContent: '- Flutter SDK instalado\n- Dart SDK compatible\n- Android Studio, Xcode o dispositivo físico\n- Emulador Android o simulador iOS configurado',
        scriptsContent: '- `flutter run`: ejecuta la aplicación\n- `flutter test`: ejecuta las pruebas\n- `flutter analyze`: verifica problemas en el código\n- `flutter build apk`: genera la aplicación Android\n- `flutter build ios`: genera la versión para iOS',
        folderStructureContent: '```text\nlib/\n├── screens/        # Pantallas de la aplicación\n├── widgets/        # Componentes reutilizables\n├── models/         # Modelos de datos\n├── services/       # Persistencia y notificaciones\n├── providers/      # Gestión de estado\n├── theme/          # Tema e identidad visual\n└── utils/          # Funciones auxiliares\n```',
        roadmapContent: '- [x] Control de hidratación\n- [x] Registro de hábitos\n- [x] Notificaciones locales\n- [x] Gráficos de evolución\n- [ ] Sincronización entre dispositivos\n- [ ] Integración con Google Fit\n- [ ] Integración con Apple Health',
        contributingContent: 'Antes de enviar cambios, ejecuta `flutter analyze` y `flutter test`. Explica claramente la mejora realizada en el Pull Request.',
        contactContent: '',
        testsContent: '```bash\nflutter test\n```'
      }
    },
    'tpl-library': {
      name: 'Biblioteca / Paquete NPM',
      category: 'Utilidades / Paquetes',
      description: 'Enfocado en paquetes reutilizables, utilidades, hooks, bibliotecas o plugins.',
      project: {
        name: 'date-utils-ptbr',
        description: 'Biblioteca ligera en TypeScript para formatear, validar y manipular fechas en el estándar brasileño.',
        features: [
          'Formato de fechas en el estándar brasileño',
          'Conversión entre texto y objetos Date',
          'Validación de fechas',
          'Cálculo de intervalos entre fechas',
          'Identificación de años bisiestos',
          'Soporte para feriados nacionales de Brasil',
          'Compatibilidad con ESM y CommonJS',
          'Tipados TypeScript incluidos',
          'Soporte para tree shaking'
        ],
        scriptsContent: '- `npm run build`: genera las versiones ESM y CommonJS\n- `npm run test`: ejecuta las pruebas\n- `npm run lint`: verifica la calidad del código\n- `npm run typecheck`: ejecuta la verificación de TypeScript',
        folderStructureContent: '```text\nsrc/\n├── formatters/     # Funciones de formato\n├── validators/     # Validaciones de fechas\n├── calculators/    # Cálculos e intervalos\n├── holidays/       # Reglas de feriados\n├── types/          # Tipados públicos\n└── index.ts        # Exportaciones de la biblioteca\n```',
        roadmapContent: '- [x] Formato de fechas\n- [x] Validación de fechas\n- [x] Cálculo de intervalos\n- [ ] Feriados estatales\n- [ ] Localización para otros países\n- [ ] Plugin para frameworks front-end',
        contributingContent: 'Las nuevas funciones deben incluir documentación, tipado completo y pruebas automatizadas.',
        authorsContent: '',
        contactContent: '',
        testsContent: '```bash\nnpm run test\nnpm run typecheck\n```'
      }
    },
    'tpl-portfolio': {
      name: 'Sitio Web de Portafolio',
      category: 'Personal',
      description: 'Perfecto para desarrolladores que quieren presentar trabajos, contactos y proyectos.',
      project: {
        name: 'DevPortfolio',
        description: 'Portafolio personal minimalista y responsivo para presentar proyectos, experiencias, habilidades y formas de contacto.',
        features: [
          'Página inicial con presentación profesional',
          'Proyectos exhibidos como estudios de caso',
          'Sección de habilidades y tecnologías',
          'Línea de tiempo de experiencias',
          'Formulario de contacto',
          'Modo claro y oscuro',
          'Animaciones suaves y accesibles',
          'SEO básico y metadatos sociales',
          'Layout responsivo',
          'Navegación por teclado y soporte para lectores de pantalla'
        ],
        prerequisitesContent: '- Node.js 20 o superior\n- npm 10 o superior',
        scriptsContent: '- `npm run dev`: inicia el entorno de desarrollo\n- `npm run build`: genera el portafolio para producción\n- `npm run preview`: visualiza el build localmente\n- `npm run lint`: verifica el código\n- `npm run test`: ejecuta las pruebas',
        folderStructureContent: '```text\nsrc/\n├── components/     # Componentes reutilizables\n├── sections/       # Secciones de la página\n├── pages/          # Páginas y estudios de caso\n├── data/           # Datos de proyectos\n├── assets/         # Imágenes y archivos visuales\n├── styles/         # Estilos globales\n└── utils/          # Funciones auxiliares\n```',
        roadmapContent: '- [x] Página inicial\n- [x] Sección de proyectos\n- [x] Formulario de contacto\n- [x] Responsividad\n- [ ] Panel para editar proyectos\n- [ ] Blog integrado\n- [ ] Internacionalización',
        acknowledgementsContent: '- Comunidad React\n- Proyectos open source de accesibilidad\n- Referencias de diseño y desarrollo disponibles en la comunidad',
        contactContent: '',
        testsContent: '```bash\nnpm run test\n```'
      }
    },
    'tpl-academic': {
      name: 'Proyecto Académico',
      category: 'Académico',
      description: 'Estructura completa para tesis, artículos científicos, investigaciones o proyectos académicos.',
      project: {
        name: 'BioData — Análisis de Biodiversidad Urbana',
        description: 'Proyecto académico para organizar, tratar y visualizar datos sobre biodiversidad en áreas urbanas.',
        features: [
          'Importación de datos en CSV',
          'Limpieza y estandarización de registros',
          'Identificación de especies observadas',
          'Cálculo de indicadores de diversidad',
          'Comparación entre diferentes regiones',
          'Visualización de datos en gráficos',
          'Generación de mapas de distribución',
          'Notebooks reproducibles',
          'Exportación de resultados a informes'
        ],
        prerequisitesContent: '- Python 3.11 o superior\n- Entorno virtual Python\n- Jupyter Notebook o JupyterLab\n- Archivos de datos en formato CSV',
        folderStructureContent: '```text\ndata/\n├── raw/             # Datos originales\n└── processed/       # Datos tratados\n\nnotebooks/\n├── exploracion.ipynb\n└── analisis_biodiversidad.ipynb\n\nsrc/\n├── cleaning/        # Limpieza de datos\n├── analysis/        # Funciones de análisis\n├── visualization/   # Gráficos y mapas\n└── utils/           # Funciones auxiliares\n\ntests/               # Pruebas automatizadas\nreports/             # Informes exportados\n```',
        roadmapContent: '- [x] Importación de datos\n- [x] Limpieza y estandarización\n- [x] Gráficos exploratorios\n- [ ] Mapas interactivos\n- [ ] Comparación entre períodos\n- [ ] Panel web para consulta pública',
        contributingContent: 'Las contribuciones deben preservar la trazabilidad de los datos y explicar cualquier cambio realizado en los métodos de análisis.',
        authorsContent: '',
        acknowledgementsContent: '- Comunidades científicas de datos abiertos\n- Investigadores y observadores responsables de los registros\n- Desarrolladores de las bibliotecas científicas utilizadas',
        contactContent: '',
        testsContent: '```bash\npytest\n```'
      }
    }
  }
};

function applyFictionalTemplateLocalization(template: ReadmeTemplate, locale: TemplateLocale): void {
  const overrides = fictionalTemplateLocalizations[locale][template.id];
  if (!overrides) {
    return;
  }

  const { project, ...templateFields } = overrides;
  Object.assign(template, templateFields);
  template.project = {
    ...template.project,
    ...cloneTemplateData(project),
  };
}

export function getLocalizedTemplates(locale: string): ReadmeTemplate[] {
  const isEn = locale.startsWith('en');
  const isEs = locale.startsWith('es');
  const localizedTemplates = readmeTemplates.map(tpl => ({
    ...tpl,
    project: cloneTemplateData(tpl.project),
  }));

  if (!isEn && !isEs) {
    return localizedTemplates;
  }

  const localeKey: TemplateLocale = isEn ? 'en-US' : 'es-419';

  return localizedTemplates.map(clone => {
    if (isEn && clone.id === 'tpl-space-impacta') {
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
      clone.project.contactContent = '';
    }

    if (isEs && clone.id === 'tpl-space-impacta') {
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
      clone.project.contributingContent = 'Las contribuciones son muy bienvenidas. Puedes abrir una Issue o crear un Pull Request.\n\n1. Haz un Fork del proyecto\n2. Crea una rama para tu característica (`git checkout -b feature/NuevaCaracteristica`)\n3. Confirma tus cambios (`git commit -m \'Add NuevaCaracteristica\'`)\n4. Envía la rama (`git push origin feature/NuevaCaracteristica`)\n5. Abre un Pull Request';
      clone.project.acknowledgementsContent = '- Comunidad de desarrolladores de videojuegos indie\n- Kenney.nl por los excelentes recursos visuales gratuitos en pixel art\n- Creadores de Vite por la velocidad impresionante del empaquetador';
      clone.project.contactContent = '';
    }

    applyFictionalTemplateLocalization(clone, localeKey);

    return clone;
  });
}
