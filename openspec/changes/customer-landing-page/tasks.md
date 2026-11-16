# Tasks

## 1. Diretrizes do Projeto e Alinhamento de Skills

- [ ] 1.1 Ler e revisar atentamente `AGENTS.md` e aplicar as skills obrigatórias de desenvolvimento web (`/frontend-design`, `/ui-ux-pro-max` e `/vercel-react-best-practices`), garantindo arquitetura `feature-based` em `src/landing/`, uso de shadcn/ui em `src/shared/components/ui/` e tema estritamente monocromático (preto, branco e escala de cinzas) adaptado para Light e Dark.

## 2. Rota Pública `/` e Ajuste de Autenticação

- [ ] 2.1 Atualizar `getRedirectRoute` em `src/auth/services/auth-service.ts` para permitir acesso público à rota `/` (retornando `null` em `/`) enquanto mantém o redirecionamento de rotas protegidas (`/vendas`, `/pedidos`, `/estoque`, `/relatorios`) para `/login`, verificando com `npx vitest run src/auth/tests/auth-service.test.ts`.
- [ ] 2.2 Atualizar os testes unitários em `src/auth/tests/auth-service.test.ts` para validar que `/` não redireciona usuários autenticados ou não autenticados e que `/login` e rotas protegidas preservam seus comportamentos, verificando que todos os testes da suíte passam.

## 3. Domínio, Catálogo Sensorial e Motor "Monte sua Combinação" (`src/landing/`)

- [ ] 3.1 Criar os tipos da feature em `src/landing/types/landing.ts` cobrindo itens do catálogo em destaque (notas sensoriais de *Cremosidade*, *Doçura* e *Intensidade*, ingredientes flutuantes e camadas visuais), estágios da vista explodida do copo e opções das 3 etapas da alquimia (`Base`, `Textura`, `Finalização`), verificando a checagem de tipos com `npx tsc --noEmit`.
- [ ] 3.2 Implementar `src/landing/services/landing-catalog-service.ts` com os dados curatoriais das 6 criações da Ki Bubble, os estágios da montagem explodida estilo Apple e a função determinística `matchDrinkCombination(base, texture, topping)`, validando todas as combinações e filtros por categoria em `src/landing/tests/landing-catalog-service.test.ts` via `npx vitest run src/landing/tests/landing-catalog-service.test.ts`.

## 4. Hook de Scroll/Parallax, Hero Multicamadas e Marquee Cinético

- [ ] 4.1 Implementar o hook `src/landing/hooks/use-scroll-progress.ts` com suporte a progresso global de scroll, progresso normalizado por seção (`[0, 1]`), coordenadas suavizadas de ponteiro e detecção de `prefers-reduced-motion: reduce`, verificando a estabilidade em `jsdom` com `npx tsc --noEmit`.
- [ ] 4.2 Criar os componentes `src/landing/components/hero-parallax-section.tsx` (tipografia monumental vazada, pérolas especulares em múltiplas camadas de profundidade e copo central ilustrado) e `src/landing/components/kinetic-marquee.tsx` (faixas horizontais reativas à velocidade), verificando a renderização e o respeito a `prefers-reduced-motion` em `src/landing/tests/landing-page-view.test.tsx`.

## 5. Scrollytelling Estilo Apple (Vista Explodida do Copo)

- [ ] 5.1 Implementar `src/landing/components/exploded-cup-section.tsx` (`#anatomia`) com palco `sticky` onde as 6 partes visuais da bebida (canudo diagonal, tampa dome, nuvem de *Cheese Foam*, chá Assam com cubos de gelo, redemoinho de mascavo, pérolas de tapioca preta e copo) flutuam separadas no espaço e convergem até o encaixe completo em `100%` do scroll, incluindo seletores de estágio acessíveis, verificando a interpolação de camadas e troca de estágios em `src/landing/tests/landing-page-view.test.tsx`.

## 6. Catálogo em Palco Interativo (Formato B) e Alquimia em 3 Cliques (Opção 1)

- [ ] 6.1 Implementar `src/landing/components/spotlight-catalog-section.tsx` (`#catalogo`) no formato *Interactive Spotlight* com filtro de categorias (`Todos`, `Clássicos`, `Especiais`, `Frutados`, `Snacks`), lista tipográfica editorial à esquerda e palco dinâmico à direita com ilustração monocromática exclusiva, ingredientes flutuantes e barras sensoriais (*Cremosidade*, *Doçura*, *Intensidade*), verificando a seleção de itens e filtragem em `src/landing/tests/landing-page-view.test.tsx`.
- [ ] 6.2 Implementar `src/landing/components/drink-alchemy-section.tsx` (`#alquimia` — "Monte sua Combinação") permitindo escolher **1. Base**, **2. Textura** e **3. Finalização** com atualização ao vivo das camadas do copo ilustrado e recomendação imediata da bebida ideal do cardápio, verificando a interatividade dos 3 passos nos testes de componente em `src/landing/tests/landing-page-view.test.tsx`.

## 7. Composição da Landing Page em `/` e Verificação Integrada

- [ ] 7.1 Criar `src/landing/components/landing-page-view.tsx` (com header fixo *glass*, barra de progresso de scroll, navegação por âncoras, alternância de tema Claro/Escuro integrada ao `AppStoreProvider` e ausência total de links/controles de funcionários) e conectar `src/app/page.tsx` para renderizá-lo, verificando com `npx vitest run` e `npm run build`.
