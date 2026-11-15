# O que é a Ki Bubble?

O projeto consiste no desenvolvimento de uma plataforma web integrada e sob medida para a microempresa **Ki Bubble**, com o objetivo de centralizar e automatizar toda a operação do negócio em um único ecossistema digital, cobrindo desde o catálogo digital e o controle em tempo real de estoque até o processamento de pagamentos seguros diretamente pelo aplicativo e a geração de dashboards gerenciais analíticos para a tomada de decisões estratégicas, transformando a gestão de ponta a ponta e elevando a eficiência da loja.

---

# Funcionalidades

## UC01 – Registrar Venda

- **Objetivo:** Permitir que o funcionário registre uma venda realizada no restaurante.
- **Atores:** Funcionário.
- **Pré-condições:**
  - O funcionário deve estar autenticado no sistema.
  - Os produtos devem estar cadastrados no cardápio.
  - Deve haver estoque disponível para os itens vendidos.

### Fluxo Principal

1. O funcionário acessa a tela de vendas.
2. O sistema exibe os produtos disponíveis no cardápio.
3. O funcionário seleciona os produtos solicitados pelo cliente.
4. O sistema calcula automaticamente o valor total da compra.
5. O funcionário seleciona a forma de pagamento.
6. O sistema processa o pagamento.
7. O sistema registra a venda.
8. O sistema atualiza o estoque dos ingredientes utilizados.
9. O sistema armazena a venda no histórico.
10. O sistema confirma a conclusão da venda.

### Fluxos Alternativos

- **5A – Pagamento não autorizado**
  1. O sistema informa falha no pagamento.
  2. O funcionário solicita outra forma de pagamento.
  3. O fluxo retorna ao passo 5.
- **8A – Produto indisponível**
  1. O sistema identifica falta de ingredientes.
  2. O funcionário remove ou substitui o item.
  3. O fluxo retorna ao passo 3.

- **Pós-condições:**
  - Venda registrada com sucesso.
  - Estoque atualizado.
  - Histórico de vendas atualizado.

---

## UC02 – Acompanhar Pedidos

- **Objetivo:** Permitir o acompanhamento do status dos pedidos realizados.
- **Atores:** Funcionário.
- **Pré-condições:**
  - Deve existir ao menos um pedido registrado.

### Fluxo Principal

1. O funcionário acessa a área de pedidos.
2. O sistema exibe os pedidos em andamento.
3. O funcionário seleciona um pedido.
4. O sistema exibe o status atual do pedido.
5. O funcionário atualiza o status conforme o andamento da produção.
6. O sistema registra a alteração.

### Fluxos Alternativos

- **5A – Status inválido**
  1. O sistema informa erro na atualização.
  2. O funcionário seleciona um status válido.

- **Pós-condições:**
  - O status do pedido é atualizado.
- **Regras de Negócio:**
  - Os pedidos podem assumir os seguintes estados:
    - `Em preparo`
    - `Pronto`
    - `Entregue`

---

## UC03 – Gerenciar Estoque de Ingredientes

- **Objetivo:** Permitir ao gestor controlar os ingredientes utilizados na produção dos produtos.
- **Atores:** Gestor.
- **Pré-condições:**
  - O gestor deve estar autenticado.
  - Os ingredientes devem estar cadastrados.

### Fluxo Principal

1. O gestor acessa o módulo de estoque.
2. O sistema exibe os ingredientes cadastrados.
3. O gestor consulta as quantidades disponíveis.
4. O gestor atualiza as quantidades quando necessário.
5. O sistema registra as alterações.
6. O sistema verifica os níveis mínimos de estoque.
7. O sistema gera alertas para ingredientes com estoque baixo.

### Fluxos Alternativos

- **4A – Quantidade inválida**
  1. O sistema informa erro de validação.
  2. O gestor corrige o valor informado.

- **Pós-condições:**
  - Estoque atualizado.
  - Alertas gerados quando necessário.
- **Regras de Negócio:**
  - O sistema deve emitir alerta ao atingir o limite mínimo configurado.

---

## UC04 – Visualizar Relatórios

- **Objetivo:** Permitir ao gestor acompanhar indicadores de desempenho do restaurante.
- **Atores:** Gestor.
- **Pré-condições:**
  - O gestor deve estar autenticado.
  - O sistema deve possuir registros de vendas.

### Fluxo Principal

1. O gestor acessa o módulo de relatórios.
2. O sistema exibe as opções disponíveis.
3. O gestor seleciona um relatório.
4. O sistema processa os dados.
5. O sistema apresenta as informações solicitadas.

### Fluxos Alternativos

- **3A – Relatório de faturamento**
  1. O sistema exibe faturamento diário, semanal e mensal.
- **3B – Ticket médio**
  1. O sistema calcula automaticamente o ticket médio.
  2. O sistema apresenta o resultado.
- **3C – Produtos mais vendidos**
  1. O sistema gera um ranking dos produtos.
  2. O sistema apresenta os resultados.
- **3D – Histórico de vendas**
  1. O sistema exibe o histórico completo das vendas registradas.

- **Pós-condições:**
  - O relatório selecionado é exibido ao gestor.
- **Regras de Negócio:**
  - Apenas gestores podem acessar relatórios.
  - Os dados devem refletir as informações armazenadas no sistema.
  - O ticket médio deve ser calculado automaticamente.
