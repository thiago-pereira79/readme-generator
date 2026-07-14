# 📄 README - Gerador profissional de documentação

![License](https://img.shields.io/badge/License-MIT-green.svg)
![Status](https://img.shields.io/badge/Status-Concluído-brightgreen)
![Stack](https://img.shields.io/badge/Feito%20com-React%20%2B%20TypeScript%20%2B%20Vite-blue)
![Idiomas](https://img.shields.io/badge/Idiomas-PT--BR%20%7C%20EN%20%7C%20ES-8C5CE6)
![Armazenamento](https://img.shields.io/badge/Armazenamento-IndexedDB-D1795C)
![Privacidade](https://img.shields.io/badge/Dados-Local--first-00A86B)
![Layout](https://img.shields.io/badge/Layout-Responsivo-00B8D9)
[![Acessar aplicação](https://img.shields.io/badge/Acessar-Aplicação-6D35F5)](https://SEU-DOMINIO.vercel.app/)

---

## 🧠 Sobre o projeto

**README** é um gerador profissional de documentação desenvolvido com **React, TypeScript e Vite**.

A aplicação permite organizar as informações de um projeto e gerar um arquivo `README.md` completo, estruturado e pronto para publicação no GitHub.

O usuário pode preencher apenas as seções necessárias, acompanhar o progresso de cada bloco, utilizar templates, salvar rascunhos, visualizar o resultado antes da exportação e manter seus projetos armazenados localmente no navegador.

🔗 **Acesse a aplicação:**  
https://SEU-DOMINIO.vercel.app/

📂 **Repositório:**  
https://github.com/thiago-pereira79/readme

A ferramenta funciona sem:

- criação de conta;
- autenticação;
- banco de dados remoto;
- servidor próprio;
- assinatura;
- plano pago;
- envio dos projetos para a nuvem.

Os projetos, rascunhos, configurações e registros de atividade são armazenados no próprio navegador utilizado.

O projeto foi desenvolvido com foco em:

- documentação técnica;
- experiência do usuário;
- organização de conteúdo;
- privacidade;
- persistência local;
- internacionalização;
- acessibilidade digital;
- responsividade;
- clareza visual;
- exportação de arquivos;
- redução de carga cognitiva;
- prevenção de perda de dados;
- adaptação entre diferentes tamanhos de tela.

---

## 🧰 Principais recursos

| Recurso | Descrição |
|---------|-----------|
| 📝 Gerador estruturado | Organiza o preenchimento do README em seções independentes |
| 📂 Projetos salvos | Permite armazenar, abrir, editar, duplicar e excluir projetos |
| 💾 Persistência local | Mantém projetos, rascunhos e preferências no navegador |
| ✍️ Salvamento automático | Atualiza o rascunho durante o preenchimento quando ativado |
| 🧩 Templates | Oferece estruturas preparadas para diferentes tipos de projeto |
| 📘 Projeto demonstrativo | Disponibiliza o Space Impacta como exemplo completo de preenchimento |
| 👁️ Preview visual | Exibe o README formatado antes da exportação |
| 🧾 Preview Markdown | Permite conferir o código Markdown bruto |
| 📋 Copiar Markdown | Copia o conteúdo completo para a área de transferência |
| 📥 Download `.md` | Exporta o documento como arquivo Markdown |
| 📄 Exportação em PDF | Permite gerar uma versão visual da documentação |
| 🗃️ Histórico | Registra as ações realizadas nos projetos |
| 🌐 Três idiomas | Interface e estrutura gerada em português, inglês e espanhol |
| 🛡️ Backup local | Exporta e restaura os dados da aplicação em JSON |
| 🎨 Temas | Possui modos claro, escuro e baseado no sistema |
| 🏷️ Badges | Gera badges para tecnologias, licença e informações do projeto |
| 🖼️ Imagens do projeto | Aceita screenshots por URL ou upload local |
| 👤 Assinatura opcional | Adiciona o nome e o link do autor ao final do README |
| 📱 Layout responsivo | Adapta a interface para desktop, tablet e celular |
| ⌨️ Navegação acessível | Inclui foco visível, suporte ao teclado, estrutura semântica e atributos ARIA |
| 🔒 Processamento local | Não exige backend para armazenar os projetos |

---

## 🧭 Estrutura da aplicação

A navegação principal é composta por:

| Página | Finalidade |
|--------|------------|
| **Gerador** | Preenchimento e geração do README |
| **Templates** | Seleção de estruturas prontas |
| **Meus projetos** | Gerenciamento dos projetos salvos |
| **Histórico** | Registro das atividades realizadas |
| **Configurações** | Tema, idioma, licença padrão, salvamento automático e backup |
| **Preview** | Visualização e exportação do documento gerado |

A página de Preview é aberta em uma nova guia para que o editor permaneça disponível durante a revisão do documento.

Ao trocar de página dentro da aplicação, o novo conteúdo começa no topo, evitando que a posição de rolagem da tela anterior seja reaproveitada.

---

## 📝 Seções disponíveis no gerador

### Informações básicas

Permite cadastrar:

- nome do projeto;
- descrição;
- tecnologias;
- badges;
- informações principais da documentação.

As tecnologias podem ser adicionadas individualmente, removidas e utilizadas para a geração automática dos badges.

### Funcionalidades

Permite:

- adicionar recursos;
- remover itens;
- reorganizar a ordem;
- acompanhar a quantidade cadastrada.

### Instalação

Área destinada aos comandos necessários para instalar o projeto.

Exemplo:

```bash
git clone https://github.com/usuario/projeto.git
cd projeto
npm install
```

### Como executar

Permite informar os comandos utilizados para iniciar o ambiente.

Exemplo:

```bash
npm run dev
```

### Licença

Oferece suporte para licenças conhecidas e conteúdo personalizado.

### Links e redes

Permite adicionar:

- repositório;
- deploy;
- website;
- documentação;
- GitHub;
- LinkedIn;
- portfólio;
- outros links relacionados.

Por segurança, os campos comuns de links aceitam apenas endereços iniciados com:

```text
http://
https://
```

Protocolos inseguros ou inadequados, como `javascript:`, `data:`, `file:` e `vbscript:`, são rejeitados.

### Screenshots

Aceita:

- URL de imagem;
- upload de arquivo local;
- título;
- legenda;
- texto alternativo;
- reordenação;
- remoção.

### Campos opcionais adicionais

O usuário pode ativar apenas as seções necessárias para cada projeto, como:

- pré-requisitos;
- scripts disponíveis;
- estrutura de pastas;
- roadmap;
- contribuição;
- agradecimentos;
- contato;
- desenvolvido por;
- outras informações complementares.

---

## 🧩 Templates disponíveis

A aplicação possui templates voltados para diferentes categorias de projeto.

| Template | Finalidade |
|----------|------------|
| **Começar do zero** | Cria um projeto totalmente vazio |
| **Space Impacta** | Carrega um exemplo completo e preenchido |
| **Aplicação Web** | Estrutura para sistemas, dashboards e produtos SaaS |
| **Jogo 2D/3D** | Estrutura para jogos web, mobile ou desktop |
| **API REST/GraphQL** | Documentação de APIs e serviços de backend |
| **Aplicativo Mobile** | Projetos React Native, Expo, Flutter ou semelhantes |
| **Biblioteca/NPM Package** | Pacotes, utilitários, plugins e bibliotecas |
| **Website Portfólio** | Sites pessoais e portfólios profissionais |
| **Projeto Acadêmico** | Artigos, pesquisas, trabalhos acadêmicos e TCCs |

Os templates funcionam como pontos de partida e podem ser completamente editados depois do carregamento.

A seleção de um template não altera os dados originais armazenados na aplicação.

---

## 👁️ Preview do README

Ao clicar em **Gerar README**, a aplicação abre uma nova guia contendo o documento gerado.

O editor principal permanece aberto para que o usuário possa continuar realizando alterações.

O Preview possui dois modos.

### Visual

Apresenta o conteúdo formatado de forma semelhante à exibição do GitHub.

Suporta:

- títulos;
- parágrafos;
- badges;
- listas;
- tabelas;
- links;
- imagens;
- blocos de código;
- separadores;
- assinatura do autor.

### Markdown

Exibe o conteúdo bruto que será inserido no arquivo `README.md`.

A partir do Preview, o usuário pode:

- atualizar os dados;
- alternar entre Visual e Markdown;
- copiar o Markdown;
- baixar o arquivo `.md`;
- gerar um PDF;
- retornar ao editor.

---

## 🔄 Comunicação entre editor e Preview

O editor e a página de Preview utilizam uma estratégia de comunicação entre guias.

Entre os recursos utilizados estão:

- `window.postMessage`;
- `BroadcastChannel`;
- eventos de armazenamento;
- snapshot temporário do projeto;
- validação da origem das mensagens;
- validação da janela remetente;
- limpeza dos listeners ao desmontar os componentes.

Essa abordagem também permite o funcionamento em ambientes com restrições de iframe e particionamento de armazenamento.

Caso o navegador bloqueie a abertura da nova guia, a aplicação apresenta uma mensagem de erro real, sem informar falsamente que o Preview foi aberto.

---

## 💾 Armazenamento local

A aplicação utiliza o armazenamento do navegador para manter:

- projetos;
- rascunho ativo;
- histórico;
- idioma;
- tema;
- licença padrão;
- preferência de badges;
- configuração de salvamento automático.

O armazenamento principal é realizado com **IndexedDB**.

Chaves pequenas e auxiliares podem utilizar `localStorage`, como preferências imediatas de tema, idioma ou comunicação entre guias.

### Comportamento esperado

No mesmo navegador, perfil e domínio:

- atualizar a página não apaga os dados;
- fechar a aba não apaga os dados;
- fechar e abrir novamente o navegador normalmente não apaga os dados;
- navegar entre as páginas da aplicação não apaga os dados;
- os projetos permanecem disponíveis até que sejam excluídos;
- o histórico permanece disponível até que seja apagado;
- as configurações salvas continuam aplicadas.

Os dados podem desaparecer caso a pessoa:

- limpe os dados do site;
- remova o armazenamento nas configurações do navegador;
- utilize navegação anônima e encerre a sessão;
- desinstale o navegador;
- redefina o dispositivo;
- acesse a aplicação por outro domínio;
- utilize outro navegador;
- utilize outro perfil do navegador;
- enfrente uma limpeza de armazenamento realizada pelo sistema operacional.

Pessoas que utilizem o mesmo dispositivo, navegador, perfil e domínio também utilizarão o mesmo armazenamento local da aplicação.

---

## 🔐 Privacidade

A aplicação não exige:

- nome de usuário;
- senha;
- e-mail;
- conta externa;
- banco de dados remoto;
- sincronização obrigatória;
- envio dos projetos para um servidor próprio.

Os projetos e históricos não precisam ser enviados a servidores para serem armazenados.

Imagens adicionadas por links externos são carregadas diretamente a partir do endereço informado pelo usuário e, portanto, podem realizar requisições ao domínio de origem da imagem.

---

## 🛡️ Backup e restauração

A tela de configurações permite exportar os dados locais para um arquivo JSON.

O backup pode conter:

- projetos;
- rascunho ativo;
- histórico;
- preferências;
- configurações.

Também é possível importar um backup anteriormente exportado.

Antes da restauração, a aplicação valida:

- formato do arquivo;
- estrutura dos dados;
- versão;
- tamanho;
- conteúdo esperado;
- disponibilidade de armazenamento;
- links presentes no conteúdo importado.

URLs inseguras presentes em backups são removidas ou rejeitadas antes que os dados sejam inseridos no estado da aplicação.

O backup é recomendado para quem deseja:

- trocar de navegador;
- trocar de dispositivo;
- manter uma cópia de segurança;
- restaurar os projetos depois de limpar o navegador.

---

## 🌐 Idiomas

A aplicação oferece suporte para:

- Português — Brasil (`pt-BR`);
- English — United States (`en-US`);
- Español — Latinoamérica (`es-419`).

O idioma selecionado é aplicado:

- à interface;
- aos botões;
- aos menus;
- às mensagens;
- às validações;
- aos modais;
- aos textos estruturais do README gerado.

Os textos digitados pelo usuário não são traduzidos automaticamente.

A alteração de idioma é aplicada depois que o usuário salva as configurações.

---

## 👤 Assinatura do autor

A seção opcional **Desenvolvido por** permite adicionar uma assinatura ao final do documento.

Sem link:

```markdown
---

💻 Desenvolvido por **Nome do Autor**
```

Com link:

```markdown
---

💻 Desenvolvido por **[Nome do Autor](https://exemplo.com)**
```

A estrutura é traduzida conforme o idioma selecionado:

```text
Desenvolvido por
Developed by
Desarrollado por
```

Projetos novos não recebem automaticamente o nome de um autor.

O nome **Thiago Pereira** aparece somente no template demonstrativo quando incluído nos dados do exemplo.

---

## 🎨 Identidade visual

A interface utiliza uma identidade clara, contemporânea e minimalista.

Os principais elementos visuais incluem:

- branco;
- cinza muito claro;
- roxo como cor principal;
- cards com bordas discretas;
- sombras suaves;
- cantos arredondados;
- hierarquia tipográfica;
- ícones da biblioteca Lucide;
- estados ativos em lilás;
- indicadores de conclusão;
- badges de status;
- modo escuro.

A estrutura principal possui:

- cabeçalho fixo;
- menu lateral;
- separadores visuais;
- conteúdo central;
- rodapé;
- navegação responsiva.

---

## 🧠 Decisões de UX/UI

A aplicação foi organizada para reduzir a carga cognitiva durante a criação do documento.

### Preenchimento progressivo

Os accordions permitem que o usuário se concentre em uma seção por vez.

Cada bloco apresenta indicadores como:

- Pendente;
- Concluído;
- Vazio;
- quantidade de itens;
- tecnologias cadastradas;
- seção opcional.

Os accordions iniciam fechados e preservam os dados quando são recolhidos.

### Hierarquia de ações

As ações são organizadas por importância:

1. **Gerar README** — ação principal;
2. **Salvar rascunho** — preservação do trabalho;
3. **Limpar campos** — ação protegida por confirmação;
4. **Ver templates** — apoio ao preenchimento.

### Prevenção de perdas

A aplicação utiliza:

- confirmação antes de limpar;
- confirmação antes de excluir;
- confirmação antes de iniciar um projeto novo;
- salvamento automático opcional;
- persistência local;
- exportação de backup.

### Navegação previsível

Ao trocar de página, a nova área inicia no topo.

A posição de rolagem não é redefinida durante:

- digitação;
- abertura de accordions;
- alteração de campos;
- atualização de status;
- ações dentro da mesma página.

### Card de ajuda

O card **Dica rápida** oferece acesso aos templates sem competir com a ação principal da ferramenta.

Ele utiliza:

- fundo lilás suave;
- borda discreta;
- título roxo;
- descrição curta;
- botão de acesso aos templates.

---

## 🧭 Acessibilidade

O projeto considera:

- foco visível;
- navegação completa por teclado;
- elementos HTML semânticos;
- labels associados aos campos;
- botões com nomes acessíveis;
- estados de expansão informados por atributos ARIA;
- associação entre os controles e os painéis dos accordions;
- mensagens de validação compreensíveis;
- modais com gerenciamento de foco;
- fechamento de modais pela tecla `Escape`;
- contraste entre textos e fundos;
- áreas de interação adequadas;
- suporte à redução de movimento;
- textos alternativos para imagens;
- comportamento responsivo em diferentes tamanhos de tela.

Esses recursos melhoram a experiência para diferentes formas de navegação e interação, mas não representam uma certificação formal de conformidade.

---

## 🔒 Segurança

Entre os cuidados de segurança estão:

- validação de URLs inseridas pelo usuário;
- aceitação apenas dos protocolos HTTP e HTTPS nos campos comuns;
- bloqueio de protocolos como `javascript:`, `data:`, `file:` e `vbscript:`;
- sanitização dos dados importados por backup;
- validação de origem nas mensagens entre janelas;
- proteção em links abertos em novas guias;
- ausência de chaves privadas ou segredos no front-end;
- processamento local dos projetos;
- validação dos arquivos de backup antes da substituição dos dados atuais.

---

## ⚡ Performance

Entre os cuidados de implementação estão:

- carregamento com Vite;
- componentes React;
- TypeScript;
- atualização controlada dos estados;
- debounce no salvamento automático;
- limpeza de listeners;
- reaproveitamento de componentes;
- renderização condicional;
- carregamento local dos projetos;
- validação de limites antes de armazenar imagens;
- geração sob demanda do Preview;
- carregamento dinâmico de recursos pesados;
- separação das bibliotecas de PDF do bundle inicial;
- build otimizado para produção.

---

## 🛠️ Conceitos explorados

- React;
- TypeScript;
- Vite;
- componentização;
- React Hooks;
- gerenciamento de estado;
- formulários controlados;
- accordions;
- modais;
- toasts;
- IndexedDB;
- localStorage;
- persistência local;
- hidratação de estado;
- salvamento automático;
- importação e exportação de JSON;
- internacionalização;
- i18next;
- Markdown;
- GitHub Flavored Markdown;
- renderização de Markdown;
- badges do Shields.io;
- geração de arquivos com Blob;
- download no navegador;
- área de transferência;
- geração de PDF;
- impressão;
- upload de imagens;
- conversão para Base64;
- comunicação entre janelas;
- `postMessage`;
- `BroadcastChannel`;
- eventos de storage;
- validação de URLs;
- sanitização de dados;
- responsividade;
- acessibilidade digital;
- modo escuro;
- tratamento de erros;
- segurança de links externos;
- carregamento dinâmico;
- build de produção;
- deploy estático.

---

## 🧰 Ferramentas e tecnologias utilizadas

| Etapa | Tecnologia | Finalidade |
|-------|------------|------------|
| Interface | React | Construção dos componentes e telas |
| Tipagem | TypeScript | Tipos, interfaces e segurança do código |
| Ambiente | Vite | Desenvolvimento, build e preview |
| Estilização | CSS | Layout, identidade visual, temas e responsividade |
| Ícones | Lucide React | Ícones auxiliares da interface |
| Internacionalização | i18next e react-i18next | Traduções e seleção de idioma |
| Markdown | React Markdown | Visualização do documento gerado |
| Extensões Markdown | remark-gfm | Suporte a tabelas e recursos do GitHub |
| Persistência | IndexedDB | Projetos, rascunhos, histórico e preferências |
| Armazenamento auxiliar | localStorage | Preferências e comunicação entre guias |
| PDF | html2canvas e jsPDF | Captura visual e geração de documentos |
| Execução | Node.js e npm | Dependências e scripts |
| Edição | Visual Studio Code | Desenvolvimento e organização |
| Versionamento | Git e GitHub | Controle de versão e publicação |
| Deploy | Vercel | Hospedagem da aplicação |

---

## 📁 Estrutura principal do projeto

```text
readme/
├── assets/
├── public/
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
├── .env.example
├── .gitignore
├── index.html
├── LICENSE
├── metadata.json
├── package-lock.json
├── package.json
├── README.md
├── tsconfig.json
└── vite.config.ts
```

> As pastas `node_modules` e `dist` são geradas automaticamente e não precisam ser versionadas no GitHub.

### Responsabilidade dos principais diretórios e arquivos

| Diretório ou arquivo | Responsabilidade |
|----------------------|------------------|
| `assets/` | Recursos visuais e arquivos utilizados pelo projeto |
| `public/` | Arquivos públicos servidos diretamente pelo Vite |
| `src/components/` | Componentes visuais e telas da aplicação |
| `src/data/` | Dados estáticos, templates e conteúdos demonstrativos |
| `src/hooks/` | Hooks responsáveis por estados e comportamentos reutilizáveis |
| `src/i18n/` | Configurações e arquivos de tradução |
| `src/services/` | Serviços de armazenamento, comunicação ou exportação |
| `src/types/` | Tipos organizados por domínio ou funcionalidade |
| `src/utils/` | Funções auxiliares e utilitários |
| `src/App.tsx` | Estrutura principal e organização das telas |
| `src/index.css` | Estilos globais, temas e responsividade |
| `src/main.tsx` | Inicialização da aplicação React |
| `src/types.ts` | Tipos e interfaces compartilhados |
| `index.html` | Estrutura HTML base, título, idioma e metadados |
| `LICENSE` | Termos da licença MIT |
| `metadata.json` | Metadados auxiliares do projeto |
| `package.json` | Scripts, dependências e configurações do projeto |
| `tsconfig.json` | Configuração do TypeScript |
| `vite.config.ts` | Configuração do ambiente Vite |

---

## 💻 Como executar localmente

### 1. Clone o repositório

```bash
git clone https://github.com/thiago-pereira79/readme.git
```

### 2. Entre na pasta

```bash
cd readme
```

### 3. Instale as dependências

```bash
npm install
```

### 4. Inicie o ambiente de desenvolvimento

```bash
npm run dev
```

### 5. Abra no navegador

```text
http://localhost:3000
```

A porta pode mudar caso esteja ocupada ou configurada de outra forma no projeto.

---

## 🔍 Comandos disponíveis

### Desenvolvimento

```bash
npm run dev
```

Inicia o servidor de desenvolvimento do Vite.

### Verificação TypeScript

```bash
npm run lint
```

Executa a verificação estática configurada no projeto.

O script utiliza:

```bash
tsc --noEmit
```

O TypeScript analisa os arquivos sem gerar conteúdo de saída.

### Build

```bash
npm run build
```

Gera a versão de produção na pasta:

```text
dist/
```

### Preview local

```bash
npm run preview
```

Executa localmente a versão gerada pelo build.

> O arquivo `package.json` é a fonte principal para a lista atualizada de scripts disponíveis.

---

## 🌐 Publicação

A aplicação pode ser publicada como um projeto front-end estático.

### Vercel

Depois de conectar o repositório à Vercel:

```text
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
```

Variáveis de ambiente não são necessárias para o funcionamento principal da aplicação, pois os dados são armazenados localmente.

Caso a aplicação utilize rotas acessadas diretamente pela URL, o deploy deve possuir configuração de fallback para o arquivo `index.html`.

Depois da publicação, substitua no início deste documento:

```text
https://SEU-DOMINIO.vercel.app/
```

pela URL real da aplicação.

---

## 🖥️ Metadados da aplicação

O arquivo `index.html` utiliza:

- idioma inicial `pt-BR`;
- codificação UTF-8;
- viewport responsiva;
- descrição da aplicação;
- cor de tema;
- título personalizado;
- favicon.

Título utilizado na aba do navegador:

```text
README | Gerador profissional de documentação
```

---

## 📐 Resoluções de referência

### Celulares

- 320 × 568;
- 360 × 640;
- 375 × 667;
- 390 × 844;
- 412 × 915;
- 430 × 932.

### Tablets e iPads

- 600 × 960;
- 768 × 1024;
- 810 × 1080;
- 820 × 1180;
- 834 × 1194;
- 1024 × 1366.

### Notebooks e desktops

- 1280 × 720;
- 1366 × 768;
- 1440 × 900;
- 1536 × 864;
- 1600 × 900;
- 1920 × 1080.

### Monitores grandes

- 2560 × 1440;
- 3440 × 1440;
- 3840 × 2160.

---

## ✅ Verificações do projeto

Entre os principais fluxos validados estão:

- inicialização sem dados demonstrativos automáticos;
- criação de projeto;
- preenchimento dos campos;
- abertura e fechamento dos accordions;
- salvamento de rascunho;
- atualização de projeto;
- duplicação;
- exclusão;
- histórico;
- templates;
- busca e filtros;
- troca de idioma;
- troca de tema;
- licença padrão;
- salvamento automático;
- upload de screenshots;
- validação de URLs;
- bloqueio de protocolos inseguros;
- geração do Markdown;
- Preview em nova guia;
- download `.md`;
- geração de PDF;
- exportação de backup;
- persistência após atualização da página;
- navegação iniciando no topo;
- responsividade;
- navegação por teclado;
- modo claro;
- modo escuro;
- build de produção;
- verificação TypeScript.

O projeto não possui atualmente uma suíte dedicada de testes automatizados declarada no `package.json`.

---

## ⚠️ Limitações conhecidas

### Armazenamento local

Os dados não são sincronizados automaticamente entre navegadores ou dispositivos.

Para transferi-los, é necessário utilizar a exportação e a importação de backup.

### Imagens externas no PDF

Imagens hospedadas em serviços sem permissão CORS podem não ser capturadas durante a geração automática do PDF.

Nesses casos, o usuário pode:

- utilizar uma imagem local;
- hospedar a imagem em um serviço compatível;
- utilizar a opção de impressão do navegador;
- salvar o documento como PDF pelo diálogo nativo.

### Permissão da área de transferência

Alguns navegadores ou ambientes incorporados podem bloquear o acesso automático à área de transferência.

Quando isso acontece, a aplicação apresenta uma mensagem informando que a cópia não pôde ser concluída.

### Limites do navegador

A capacidade do IndexedDB depende:

- do navegador;
- do dispositivo;
- do espaço disponível;
- das políticas de armazenamento do sistema.

Uploads de imagens muito grandes podem consumir rapidamente a cota disponível.

### Compartilhamento entre dispositivos

Como não existe conta de usuário ou sincronização remota, um projeto salvo em um dispositivo não aparece automaticamente em outro.

O backup em JSON pode ser utilizado para transferir os dados.

---

## 🧩 Possíveis evoluções futuras

- criação de seções totalmente personalizadas;
- reordenação das seções do README;
- editor de tabelas;
- editor visual de badges;
- novos templates;
- importação de README existente;
- comparação entre versões;
- compactação automática de imagens;
- indicador de uso do armazenamento;
- exportação em outros formatos;
- Progressive Web App;
- funcionamento offline;
- testes automatizados;
- integração opcional com GitHub;
- publicação direta em repositórios;
- personalização visual do Preview;
- novos idiomas.

---

## ⚖️ Observação sobre o projeto

README é uma ferramenta autoral desenvolvida para estudo, portfólio e demonstração de habilidades em:

- desenvolvimento front-end;
- React;
- TypeScript;
- UX Engineering;
- UI Design;
- persistência local;
- internacionalização;
- acessibilidade digital;
- responsividade;
- geração de documentos;
- organização de aplicações;
- segurança de dados;
- experiência do usuário;
- integração com APIs nativas do navegador.

O projeto não depende de uma plataforma externa para armazenar os documentos criados.

---

## 📄 Licença

Este projeto está sob a licença **MIT**.

Sinta-se livre para estudar, adaptar e evoluir o código de acordo com os termos da licença.

Consulte o arquivo `LICENSE` para mais informações.

---

💻 Desenvolvido por **Thiago Pereira**