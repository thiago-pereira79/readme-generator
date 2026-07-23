# 📄 README - Gerador profissional de documentação

![License](https://img.shields.io/badge/License-MIT-green.svg)
![Status](https://img.shields.io/badge/Status-Online-brightgreen)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=FFD62E)
![Idiomas](https://img.shields.io/badge/Idiomas-PT--BR%20%7C%20EN%20%7C%20ES-8C5CE6)
![Armazenamento](https://img.shields.io/badge/Armazenamento-Local--first-00A86B)
![Layout](https://img.shields.io/badge/Layout-Responsivo-00B8D9)

---

## 🧠 Sobre o projeto

**README** é uma aplicação web para criar arquivos `README.md` completos, organizados e prontos para publicação no GitHub.

O usuário preenche as informações do projeto por etapas, escolhe apenas as seções necessárias e acompanha o resultado antes de exportá-lo. A ferramenta também oferece templates demonstrativos, projetos salvos, histórico, personalização do documento e suporte a diferentes idiomas.

🔗 **Acesse a aplicação:** [readme-generator-phi-five.vercel.app](https://readme-generator-phi-five.vercel.app/)

A aplicação funciona sem cadastro, login ou banco de dados remoto. Projetos, rascunhos, preferências e histórico permanecem armazenados localmente no navegador utilizado.

---

## ✨ Principais recursos

| Recurso | Descrição |
|---|---|
| Gerador estruturado | Organiza o preenchimento do README em seções independentes |
| Projetos salvos | Permite salvar, abrir, editar, duplicar e excluir projetos |
| Salvamento automático | Mantém o rascunho atualizado durante o preenchimento |
| Templates demonstrativos | Oferece exemplos independentes para aplicações web, jogos, APIs, aplicativos mobile, bibliotecas, portfólios e projetos acadêmicos |
| Preview visual | Exibe o documento formatado antes da exportação |
| Previews independentes | Mantém uma guia de visualização específica para cada projeto |
| Preview Markdown | Mostra o conteúdo Markdown bruto |
| Cópia rápida | Copia o Markdown para a área de transferência |
| Download `.md` | Exporta o documento como arquivo Markdown |
| Exportação em PDF | Gera uma versão visual do README |
| Histórico | Registra ações realizadas nos projetos |
| Backup em JSON | Exporta e restaura os dados locais da aplicação |
| Temas | Possui modo claro, escuro e preferência do sistema |
| Badges | Gera badges para tecnologias e informações do projeto |
| Screenshots | Aceita imagens por URL ou upload local |
| Três idiomas | Disponibiliza português, inglês e espanhol |
| Layout responsivo | Adapta a interface para celular, tablet e desktop |
| Armazenamento local | Mantém os dados no navegador sem exigir backend |

---

## 🧭 Áreas da aplicação

| Área | Finalidade |
|---|---|
| **Gerador** | Preencher as informações e criar o README |
| **Templates** | Escolher uma estrutura pronta para começar |
| **Meus projetos** | Abrir e administrar projetos salvos |
| **Histórico** | Consultar as atividades registradas |
| **Configurações** | Alterar idioma, tema, licença padrão, salvamento e backup |
| **Preview** | Revisar, copiar e exportar o documento gerado |

Cada projeto possui sua própria guia de Preview.

Ao gerar novamente o mesmo projeto, a guia correspondente é atualizada e reutilizada. Ao gerar um projeto diferente, uma nova guia independente é aberta, mantendo os demais previews disponíveis para consulta e comparação.

---

## 📝 Conteúdo que pode ser gerado

O gerador permite montar um README com as seguintes informações:

- Nome e descrição do projeto
- Tecnologias utilizadas
- Funcionalidades
- Instruções de instalação
- Instruções de uso
- Licença
- Repositório, deploy, site e outros links
- Screenshots com legenda e texto alternativo
- Pré-requisitos
- Scripts disponíveis
- Estrutura de pastas
- Testes
- Roadmap
- Guia de contribuição
- Autores
- Agradecimentos
- Contato
- Assinatura do responsável pelo projeto

As seções opcionais só aparecem no documento quando são ativadas e preenchidas.

---

## 🧩 Templates

A aplicação possui modelos para diferentes categorias:

| Template | Uso indicado |
|---|---|
| **Começar do zero** | Projeto vazio, sem conteúdo demonstrativo |
| **Space Impacta** | Exemplo completo de um jogo desenvolvido para web |
| **Aplicação Web** | Sistemas, dashboards e produtos SaaS |
| **Jogo 2D/3D** | Jogos para web, mobile ou desktop |
| **API REST/GraphQL** | APIs, microsserviços e documentação de endpoints |
| **Aplicativo Mobile** | Projetos React Native, Expo, Flutter e semelhantes |
| **Biblioteca ou pacote** | Bibliotecas, plugins, utilitários e pacotes NPM |
| **Website ou portfólio** | Sites pessoais e portfólios profissionais |
| **Projeto acadêmico** | Pesquisas, artigos, trabalhos e projetos de estudo |

Cada card carrega um conteúdo específico e independente, adequado à categoria selecionada.

Os templates servem apenas como ponto de partida. Todo o conteúdo pode ser alterado depois do carregamento.

O **Space Impacta** utiliza dados de um projeto real. Os demais templates apresentam projetos fictícios criados exclusivamente para demonstrar diferentes estruturas de README.

Os projetos demonstrativos são carregados sem screenshots. A seção de imagens permanece disponível no Gerador para que cada usuário possa adicionar capturas reais por URL ou upload local.

---

## 👁️ Preview e exportação

Depois de preencher o projeto, o usuário pode abrir um Preview independente em uma nova guia.

Cada projeto mantém sua própria visualização, permitindo trabalhar e comparar diferentes READMEs simultaneamente.

O Preview possui dois modos:

### Visual

Apresenta o conteúdo formatado de maneira semelhante ao GitHub, incluindo:

- Títulos
- Listas
- Tabelas
- Links
- Imagens
- Badges
- Blocos de código

### Markdown

Exibe o código Markdown bruto que será salvo no arquivo `README.md`.

A tela também permite:

- Atualizar somente o Preview correspondente ao projeto editado
- Manter diferentes READMEs abertos simultaneamente
- Reutilizar a guia existente quando o mesmo projeto é gerado novamente
- Copiar o Markdown
- Baixar o arquivo `.md`
- Exportar o conteúdo em PDF
- Retornar ao editor

A comunicação entre editor e Preview utiliza `window.postMessage`, `BroadcastChannel` e snapshots temporários salvos no navegador.

Cada Preview é identificado pelo ID exclusivo do projeto e recebe somente as atualizações correspondentes, evitando que diferentes READMEs substituam o conteúdo uns dos outros.

Se uma guia for fechada, ela poderá ser aberta novamente ao gerar o projeto correspondente.

---

## 💾 Armazenamento local

O armazenamento principal utiliza **IndexedDB** para manter:

- Projetos
- Rascunho ativo
- Histórico
- Configurações

O `localStorage` é utilizado como apoio para:

- Preferências pequenas
- Migração de versões anteriores
- Comunicação entre guias
- Snapshots temporários dos Previews

No mesmo navegador, perfil e domínio, os dados permanecem disponíveis depois de atualizar a página ou fechar e abrir o navegador.

Os dados podem ser perdidos quando a pessoa:

- Limpa o armazenamento do site
- Utiliza uma sessão anônima
- Troca de navegador
- Troca de dispositivo
- Acessa a aplicação por outro domínio

Como não existe sincronização em nuvem, o backup em JSON é a forma recomendada de transferir ou preservar os projetos.

---

## 🔐 Privacidade

A aplicação não exige:

- Cadastro
- Nome de usuário
- Senha
- E-mail
- Conta externa
- Banco de dados remoto
- Sincronização obrigatória

O conteúdo criado fica armazenado localmente no navegador.

Imagens adicionadas por URL continuam sendo carregadas a partir do domínio externo informado pelo usuário.

Imagens enviadas pelo próprio dispositivo são armazenadas localmente junto aos dados do projeto, respeitando os limites definidos pela aplicação.

---

## 🛡️ Backup e restauração

A tela de configurações permite exportar os dados da aplicação para um arquivo JSON.

O backup pode incluir:

- Projetos salvos
- Rascunho ativo
- Histórico
- Preferências

Durante a importação, a estrutura do arquivo é validada antes da restauração.

A ferramenta também verifica e remove links incompatíveis ou inseguros presentes no conteúdo importado.

O usuário pode escolher entre mesclar os dados importados com os projetos existentes ou substituir as informações locais, conforme as opções disponíveis na aplicação.

---

## 🌐 Idiomas

A aplicação oferece suporte a:

- Português - Brasil
- English
- Español

O idioma selecionado altera:

- Interface
- Mensagens
- Navegação
- Títulos estruturais do README
- Textos dos templates demonstrativos

Os textos digitados manualmente pelo usuário não são traduzidos automaticamente.

---

## 🎨 Interface e experiência do usuário

A interface foi organizada para reduzir o esforço durante o preenchimento.

Entre as principais decisões de UX estão:

- Seções recolhíveis para manter o foco em uma etapa por vez
- Indicadores de preenchimento em cada bloco
- Hierarquia clara entre ações principais e secundárias
- Confirmação antes de excluir, substituir ou limpar dados
- Salvamento automático opcional
- Navegação iniciada no topo ao trocar de área
- Feedback por mensagens de sucesso, informação e erro
- Menu adaptado para telas menores
- Modos claro, escuro e preferência do sistema
- Templates separados por categoria
- Projetos demonstrativos coerentes com cada tipo de aplicação
- Previews independentes para evitar a substituição de documentos diferentes
- Ausência de screenshots genéricos nos exemplos

---

## Acessibilidade

O projeto considera:

- Navegação por teclado
- Foco visível
- Elementos HTML semanticamente corretos
- Labels associados aos campos
- Botões com nomes acessíveis
- Estados de expansão com atributos ARIA
- Fechamento de modais pela tecla `Escape`
- Textos alternativos para imagens
- Contraste entre textos e fundos
- Suporte à preferência de redução de movimento
- Layout adaptado a diferentes tamanhos de tela

Esses recursos melhoram a experiência de navegação, mas não representam uma certificação formal de conformidade.

---

## 🔒 Segurança

A aplicação inclui cuidados como:

- Validação de URLs inseridas pelo usuário
- Aceitação de links comuns apenas com `http://` ou `https://`
- Bloqueio de protocolos como `javascript:`, `data:`, `file:` e `vbscript:`
- Sanitização dos dados importados por backup
- Validação da origem das mensagens trocadas entre janelas
- Identificação das mensagens pelo ID do projeto
- Isolamento dos snapshots de cada Preview
- Proteção em links abertos em novas guias
- Ausência de chaves privadas no código do cliente

---

## ⚡ Performance

Entre os cuidados de desempenho estão:

- Build otimizado pelo Vite
- Carregamento sob demanda da página de Preview
- Importação sob demanda das bibliotecas usadas na geração de PDF
- Salvamento automático com atraso controlado
- Limpeza de listeners ao desmontar componentes
- Validação de tamanho antes de armazenar imagens
- Reaproveitamento de componentes e funções utilitárias
- Reutilização da guia de Preview correspondente ao projeto
- Isolamento das atualizações para evitar renderizações em guias não relacionadas

---

## 🛠️ Tecnologias utilizadas

| Tecnologia | Finalidade |
|---|---|
| React | Construção da interface e dos componentes |
| TypeScript | Tipagem e organização do código |
| Vite | Ambiente de desenvolvimento e build |
| Tailwind CSS | Estilização e responsividade |
| CSS | Estilos globais, temas e ajustes visuais |
| Lucide React | Ícones da interface |
| Motion | Animações e transições |
| i18next | Internacionalização |
| React Markdown | Renderização do Preview |
| remark-gfm | Tabelas e recursos do GitHub Flavored Markdown |
| IndexedDB | Armazenamento principal dos dados locais |
| localStorage | Preferências, snapshots e comunicação entre guias |
| BroadcastChannel | Sincronização entre editor e Previews |
| window.postMessage | Comunicação direta entre janelas |
| html2canvas | Captura visual do documento |
| jsPDF | Geração do arquivo PDF |
| Git e GitHub | Versionamento e publicação do código |
| Vercel | Hospedagem da aplicação |

---

## 📁 Estrutura do projeto

```text
readme-generator/
├── public/
│   ├── android-chrome-192x192.png
│   ├── android-chrome-512x512.png
│   ├── apple-touch-icon.png
│   ├── favicon-16x16.png
│   ├── favicon-32x32.png
│   ├── favicon-48x48.png
│   ├── favicon.ico
│   └── site.webmanifest
│
├── src/
│   ├── components/
│   ├── data/
│   ├── hooks/
│   ├── i18n/
│   ├── services/
│   ├── types/
│   ├── utils/
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── types.ts
│
├── .gitignore
├── index.html
├── LICENSE
├── package-lock.json
├── package.json
├── README.md
├── tsconfig.json
└── vite.config.ts
```

As pastas `node_modules/` e `dist/` são geradas localmente e não devem ser enviadas ao repositório.

### Responsabilidade das principais pastas

| Caminho | Responsabilidade |
|---|---|
| `public/` | Favicons, ícones e manifesto do site |
| `src/components/` | Componentes e telas da aplicação |
| `src/data/` | Templates e dados iniciais |
| `src/hooks/` | Estados e comportamentos reutilizáveis |
| `src/i18n/` | Configuração e traduções |
| `src/services/` | Persistência e serviços locais |
| `src/types/` | Tipos organizados por domínio |
| `src/utils/` | Geração de Markdown, validações, backup e funções auxiliares |
| `src/App.tsx` | Estrutura principal e navegação da aplicação |
| `src/index.css` | Estilos globais e temas |
| `src/main.tsx` | Inicialização do React |
| `src/types.ts` | Interfaces compartilhadas |

---

## 💻 Como executar localmente

### 1. Clone o repositório

```bash
git clone https://github.com/thiago-pereira79/readme-generator.git
```

### 2. Acesse a pasta

```bash
cd readme-generator
```

### 3. Instale as dependências

```bash
npm install
```

### 4. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

### 5. Abra no navegador

```text
http://localhost:3000
```

---

## 🔍 Scripts disponíveis

| Comando | Finalidade |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento na porta 3000 |
| `npm run lint` | Executa a verificação do TypeScript sem gerar arquivos |
| `npm run build` | Gera a versão otimizada de produção em `dist/` |
| `npm run preview` | Executa localmente a versão gerada pelo build |

---

## 🌐 Publicação

O projeto está publicado na Vercel.

Configuração utilizada:

```text
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
```

A aplicação principal não exige variáveis de ambiente para salvar projetos, preferências ou histórico.

Atualizações enviadas para a branch de produção do repositório podem iniciar automaticamente uma nova publicação na Vercel, conforme a integração configurada.

---

## ⚠️ Limitações conhecidas

### Dados entre dispositivos

Os projetos não são sincronizados automaticamente entre navegadores ou dispositivos.

Para transferi-los, é necessário exportar e importar um backup em JSON.

### Armazenamento do navegador

A capacidade disponível depende do navegador, do dispositivo e das políticas de armazenamento do sistema.

Imagens locais ocupam parte desse espaço e estão sujeitas aos limites definidos pela aplicação.

### Imagens externas no PDF

Imagens hospedadas em servidores sem permissão CORS podem não aparecer na exportação automática em PDF.

### Permissão da área de transferência

Alguns navegadores podem bloquear a cópia automática do Markdown.

Nesse caso, o usuário poderá precisar conceder permissão ao site ou copiar o conteúdo manualmente.

### Bloqueio de pop-ups

O navegador pode bloquear a abertura das guias de Preview.

Nesse caso, é necessário permitir pop-ups para o domínio da aplicação.

Cada projeto utiliza uma guia independente, reutilizada nas gerações seguintes do mesmo README.

### Sessões privadas

Dados criados em sessões anônimas ou privadas podem ser removidos quando a janela do navegador for fechada.

---

## 📄 Licença

Este projeto está disponível sob a licença **MIT**.

Consulte o arquivo `LICENSE` para conhecer os termos de uso, modificação e distribuição.

---

💻 Desenvolvido por **Thiago Pereira**
