# Proposal

## Why

A rota raiz (`/`) da aplicação Ki Bubble atualmente atua apenas como um redirecionador técnico para a tela de login operacional (`/login`), sem oferecer uma vitrine pública para os clientes finais da marca. Criar uma landing page imersiva, cinematográfica e estritamente monocromática na rota `/` permite encantar o consumidor final com a experiência artesanal do Bubble Tea — combinando parallax multicamadas, montagem de copo em vista explodida estilo Apple no scroll, palco interativo de sabores e um alquimista de combinações — sem misturar elementos internos de funcionários ou gestão.

## What Changes

- **BREAKING**: A rota raiz `/` deixa de redirecionar automaticamente para `/login` ou para as rotas operacionais e passa a exibir a nova Landing Page pública voltada exclusivamente ao cliente final da Ki Bubble (sem botões ou menções a login de funcionários/sistema administrativo).
- **Header Público com Controle de Tema e Barra de Progresso**: Cabeçalho fixo com efeito *glass*, navegação por âncoras da experiência (`#anatomia`, `#catalogo`, `#alquimia`), alternância entre Tema Claro e Tema Escuro persistida no `AppStoreProvider` e barra de progresso de leitura no scroll.
- **Hero Parallax Multicamadas**: Seção de abertura com tipografia monumental vazada (*outline*), pérolas de tapioca com iluminação especular e profundidade de campo (*bokeh*) em múltiplos planos que reagem simultaneamente ao scroll e ao movimento do cursor, acompanhadas do copo central ilustrado.
- **Marquee Cinético Reativo à Velocidade**: Faixas horizontais tipográficas de ingredientes e conceitos sensoriais que aceleram e invertem o deslocamento conforme a velocidade do scroll vertical.
- **Scrollytelling Estilo Apple (Vista Explodida no Ar)**: Seção *sticky* (`scroll-pinned`) onde as partes visuais da bebida (canudo diagonal, tampa dome, camada de *Cheese Foam*, chá Assam com cubos de gelo, redemoinho de açúcar mascavo, pérolas de tapioca preta e copo) começam flutuando separadas no espaço e viajam verticalmente conforme o progresso do scroll até se encaixarem formando o copo completo.
- **Catálogo em Palco Interativo (Interactive Spotlight — Formato B)**: Apresentação autoral dos sabores da marca com lista tipográfica editorial à esquerda (com filtro de categorias) e um palco visual à direita que troca dinamicamente a ilustração da bebida, os ingredientes flutuantes ao redor e as notas sensoriais (*Cremosidade*, *Doçura*, *Intensidade*) ao passar o mouse ou selecionar cada item.
- **Laboratório "Monte sua Combinação" (Alquimia Interativa em 3 Cliques — Opção 1)**: Experiência interativa onde o cliente escolhe **1. A Base** (Chá Preto Assam, Matcha Japonês, Taro Cremoso ou Frutado), **2. A Textura** (Pérolas de Tapioca Preta ou Popping Boba de Morango) e **3. O Topo** (Cheese Foam Salgado ou Calda de Mascavo), atualizando as camadas visuais do copo ao vivo e revelando a bebida ideal do cardápio correspondente ao seu gosto.

## Capabilities

### New Capabilities
- `customer-landing`: Experiência pública de landing page para o consumidor final na rota `/` com animações de parallax multicamadas, marquee cinético, scrollytelling de vista explodida estilo Apple, catálogo em palco interativo (Interactive Spotlight) e recomendador interativo "Monte sua Combinação".

### Modified Capabilities
- `auth`: Atualização da regra de redirecionamento na rota raiz (`/`) para permitir acesso público direto à landing page sem redirecionar automaticamente para `/login`, mantendo a proteção integral das rotas operacionais (`/vendas`, `/pedidos`, `/estoque`, `/relatorios`).

## Impact

- **Rotas (`src/app/`)**: Substituição do redirecionamento em `src/app/page.tsx` pela composição da feature `src/landing/`.
- **Arquitetura (`src/landing/`)**: Criação da nova feature `src/landing/` com componentes modulares (`components/`), dados sensoriais e regras de recomendação (`services/` ou `utils/`), tipos (`types/`) e testes automatizados (`tests/`).
- **Serviço de Autenticação (`src/auth/services/auth-service.ts`)**: Ajuste em `getRedirectRoute` (e respectivos testes em `src/auth/tests/auth-service.test.ts`) para que `/` seja pública e não force redirecionamento para `/login`.
- **Acessibilidade e Performance**: Animações baseadas em `requestAnimationFrame` e propriedades aceleradas por GPU (`transform`, `opacity`), respeitando integralmente `prefers-reduced-motion: reduce`.
