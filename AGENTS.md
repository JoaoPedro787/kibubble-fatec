# Diretrizes do Projeto — Ki Bubble

## Skills Obrigatórias (Desenvolvimento Web)

Antes de implementar qualquer código web (telas, componentes, layouts ou estilização), **sempre** leia e aplique as seguintes skills:

- `/frontend-design`
- `/ui-ux-pro-max`
- `/vercel-react-best-practices`

---

## Arquitetura (`feature-based` + `shared`)

O código-fonte deve seguir uma arquitetura **feature-based** dentro de `src/`:

- **`src/<feature>/`**: cada domínio/funcionalidade possui sua própria pasta (ex.: `auth`, `vendas`, `pedidos`, `estoque`, `relatorios`).
  - Dentro de cada feature, organize conforme a necessidade em subpastas como: `components/`, `layouts/`, `types/`, `utils/`, `services/`, `hooks/`, `tests/`, etc. (não restrito apenas a essas).
- **`src/shared/`**: tudo o que for global ou compartilhado entre múltiplas features deve ficar aqui, também separado por subpastas (`components/`, `components/ui/`, `layouts/`, `types/`, `utils/`, `helpers/`, `libs/`, etc.).
- **`src/app/`**: rotas finas do Next.js App Router, apenas compondo páginas a partir das features e layouts em `shared`.

---

## Regras Técnicas e de Interface

- **Framework:** Next.js (App Router) com TypeScript, estruturado com camada de serviços desacoplada para futura integração com banco de dados.
- **Componentes:** Utilizar **shadcn/ui** (`src/shared/components/ui/`) para compartilhar os mesmos componentes em toda a aplicação.
- **Tema Monocromático:** Interface estritamente monocromática (preto, branco e escala de cinzas) adaptada para os temas **Light** e **Dark**.
