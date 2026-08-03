# Blueprint do sistema interno de orçamentos

## Como reproduzir a experiência DoSim em uma produtora audiovisual

Documento funcional e técnico • Versão 1.0 • 02 de agosto de 2026

> Objetivo: registrar como o sistema interno atual funciona e transformar cada parte em uma especificação aplicável a um site de produção audiovisual, preservando a mesma simplicidade de uso.

## 1. Resumo executivo

O sistema interno da DoSim é um montador de orçamentos rápido, responsivo e integrado ao WhatsApp. A equipe entra por uma área restrita, preenche os dados do cliente, escolhe uma combinação de produto e modalidade, informa a quantidade e recebe cálculos automáticos. Uma prévia acompanha o preenchimento e, ao final, o sistema cria uma mensagem pronta para copiar ou abrir no WhatsApp.

A mesma estrutura funciona muito bem para uma produtora audiovisual. A troca conceitual principal é:

| Sistema atual | Versão audiovisual |
| --- | --- |
| Tipo de biscoito | Tipo de produção |
| Modalidade | Modelo de contratação |
| Produto ou apresentação | Serviço ou pacote |
| Sabor | Formato ou linguagem |
| Unidades e gramatura | Entregáveis e carga estimada |
| Valor do produto | Valor do serviço |
| Retirada ou entrega | Remoto ou presencial |
| Frete por distância | Deslocamento da equipe |
| Data de entrega | Data da gravação e/ou prazo final |

O resultado recomendado mantém a mesma tela em duas colunas: formulário à esquerda e resumo vivo à direita. No celular, as colunas são empilhadas.

## 2. Jornada completa do usuário

1. A pessoa da equipe abre a Área Interna.
2. Digita a senha e acessa o painel de ferramentas.
3. Seleciona Montar orçamento.
4. Informa cliente e contato.
5. Escolhe tipo de projeto, modelo de contratação, pacote e formato.
6. Informa quantidade, duração, diárias ou outro direcionador de produção.
7. O sistema calcula carga estimada, preço do serviço e total.
8. Se o trabalho for presencial, informa o endereço e calcula o deslocamento.
9. Confere a prévia do orçamento.
10. Copia a mensagem ou abre o WhatsApp da empresa com o texto pronto.
11. Pode limpar a tela e iniciar outro orçamento.

Fluxo resumido:

```text
LOGIN → PAINEL INTERNO → DADOS DO CLIENTE → CONFIGURAÇÃO DO SERVIÇO
      → CÁLCULOS → LOCAL/DESLOCAMENTO → PRÉVIA → WHATSAPP
```

## 3. Estrutura da interface atual

### Área interna

- Tela de login centralizada, com marca, senha, mensagem de erro e botão Entrar.
- Sessão válida somente enquanto a aba/sessão do navegador estiver ativa.
- Painel com atalhos para Controle de pedidos e Montar orçamento.
- Botão Sair disponível no painel e nas ferramentas internas.

### Tela de orçamento

- Cabeçalho com atalhos para Área interna, Pedidos e Sair.
- Painel principal com o formulário completo.
- Painel lateral fixo com a prévia e os totais.
- Botões Enviar para o WhatsApp, Copiar mensagem e Limpar orçamento.
- Layout responsivo: duas colunas no desktop e uma coluna no celular.
- Campos grandes, textos de ajuda, estados desabilitados e mensagens de validação.

## 4. Inventário dos campos e adaptação audiovisual

| Campo atual | Comportamento atual | Campo audiovisual sugerido |
| --- | --- | --- |
| Nome do cliente | Obrigatório, até 80 caracteres | Nome do cliente ou empresa |
| WhatsApp | Opcional | WhatsApp/e-mail do responsável |
| Tipo de biscoito | Define sabores e produtos disponíveis | Tipo de produção |
| Modalidade | Presenteável, gramatura ou personalizado | Pacote fechado, diária/hora ou sob medida |
| Produto/apresentação | Lista dependente do tipo e modalidade | Serviço/pacote |
| Sabor | Lista dependente do tipo | Formato, linguagem ou canal |
| Personalização | Aplica regra de primeiro pedido | Novo projeto ou recorrência |
| Tamanho | Altera peso estimado por unidade | Duração, resolução ou nível de complexidade |
| Quantidade | Sincroniza unidades e peso | Entregáveis, horas, diárias ou episódios |
| Data de entrega | Obrigatória e não aceita data passada | Data de gravação/prazo de entrega |
| Valor | Sugerido, mas editável | Valor unitário ou total do serviço |
| Recebimento | Retirada ou entrega | Remoto ou presencial |
| Endereço | Exibido somente na entrega | Local da gravação |
| Observações | Texto opcional | Escopo, referências e condições especiais |

### Tipos de produção sugeridos

- Vídeo institucional
- Conteúdo para redes sociais
- Cobertura de evento
- Campanha publicitária
- Podcast ou videocast
- Fotografia
- Motion design ou animação
- Projeto sob consulta

### Formatos ou linguagens sugeridos

- Vertical 9:16
- Horizontal 16:9
- Quadrado 1:1
- Entrevista
- Documental
- Publicitário
- Aftermovie
- Captação multicâmera
- Motion graphics

## 5. Os três modelos de contratação

### A. Pacote fechado

É o equivalente direto à modalidade Presenteável.

Cada pacote tem preço unitário, quantidade de entregáveis e carga de produção estimada. A pessoa informa quantos pacotes serão contratados e o sistema calcula tudo automaticamente.

Exemplo ilustrativo:

```text
Pacote Social Essencial
4 vídeos verticais por pacote
16 horas estimadas de produção por pacote
R$ 2.400,00 por pacote

Quantidade escolhida: 2 pacotes
Produção: 8 vídeos / aproximadamente 32 horas
Subtotal: 2 × R$ 2.400,00 = R$ 4.800,00
```

Fórmulas:

```text
entregáveis = quantidade de pacotes × entregáveis por pacote
carga estimada = quantidade de pacotes × horas por pacote
subtotal = quantidade de pacotes × valor unitário
```

### B. Diária ou hora técnica

É o equivalente à modalidade Por gramatura.

A pessoa pode preencher diárias ou horas; o outro campo é calculado automaticamente. Uma diária pode representar 8 horas, por exemplo. O preço acompanha a unidade escolhida.

```text
horas = diárias × horas por diária
subtotal = diárias × valor da diária
```

Também é possível usar esse modelo para edição, colorização, animação, captação de áudio ou locação de equipamentos.

### C. Projeto sob medida

É o equivalente à modalidade Personalizado.

O orçamento usa uma referência inicial, mas permanece editável. Pode haver uma taxa única de estruturação no primeiro projeto, semelhante à taxa de clichê do sistema atual.

Possíveis componentes:

- briefing e planejamento;
- roteiro;
- pré-produção;
- captação;
- edição e finalização;
- trilha ou locução;
- motion graphics;
- versões e adaptações;
- licenciamento;
- taxa de urgência.

## 6. Regras dinâmicas que devem ser preservadas

### Seleções dependentes

O Serviço/pacote só é liberado depois que Tipo de produção e Modelo de contratação forem escolhidos. A lista de Formato também muda conforme o tipo selecionado.

Se não existir uma combinação cadastrada, o sistema oferece Projeto sob consulta e deixa o valor manual.

### Campos condicionais

- Pacote fechado mostra quantidade de pacotes, entregáveis, carga estimada e preço unitário.
- Diária/hora mostra a conversão entre as duas unidades.
- Sob medida mostra complexidade, recorrência e itens adicionais.
- Presencial revela o endereço e o botão de cálculo de deslocamento.
- Remoto esconde endereço e deslocamento.

### Valores sugeridos, mas editáveis

O sistema preenche um valor de referência com base na configuração escolhida. A equipe pode ajustar esse valor antes do envio. A prévia e a mensagem usam o valor final que estiver no campo.

### Atualização em tempo real

Qualquer mudança em serviço, quantidade, prazo, local ou valor atualiza imediatamente:

- nome do pacote;
- volume de entregáveis;
- carga estimada;
- valor unitário;
- subtotal;
- deslocamento;
- total estimado.

## 7. Deslocamento para trabalhos presenciais

O sistema atual localiza o endereço por meio do Nominatim/OpenStreetMap e calcula a rota de carro com o OSRM. A distância é comparada a faixas de preço cadastradas. Atualmente existe um limite de 20 km.

Na produtora, a mesma lógica pode representar deslocamento da equipe:

```text
deslocamento = faixa de distância da rota
total = serviços + deslocamento
```

Adaptações recomendadas:

- usar endereço do estúdio ou sede como origem;
- cobrar por faixa, quilômetro ou diária fora da cidade;
- adicionar estacionamento e pedágio manualmente;
- permitir quantidade de veículos/equipes;
- sinalizar hospedagem e alimentação como sob consulta;
- exigir novo cálculo quando o endereço for alterado.

Para preservar o endereço privado da empresa, a origem exata e as regras comerciais devem ficar em um backend, não no JavaScript público.

## 8. Estrutura da prévia

A prévia deve permanecer visível durante o preenchimento e conter:

```text
PACOTE OU SERVIÇO
Quantidade de pacotes / entregáveis / carga estimada

Tipo de produção
Formato
Data de gravação ou prazo
Atendimento remoto/presencial

Valor unitário
Serviços
Deslocamento
TOTAL ESTIMADO
```

Exemplo:

```text
2 × Pacote Social Essencial
2 pacotes · 8 vídeos · aproximadamente 32 horas

Tipo: Conteúdo para redes sociais
Formato: Vertical 9:16
Prazo: 30/08/2026
Atendimento: Presencial · 12,4 km

Valor unitário: R$ 2.400,00
Serviços: R$ 4.800,00
Deslocamento: R$ 150,00
Total estimado: R$ 4.950,00
```

## 9. Modelo de mensagem para WhatsApp

```text
*Orçamento [NOME DA PRODUTORA] 🎬*

*Cliente:* Empresa Exemplo
*Contato:* (31) 99999-9999

🎬 *2 × Pacote Social Essencial*
Conteúdo para redes sociais · Pacote fechado
*Formato:* Vertical 9:16
*Quantidade:* 2 pacotes
*Produção estimada:* 8 vídeos · aproximadamente 32 horas
*Valor unitário:* R$ 2.400,00 por pacote
*Data desejada:* 30/08/2026
*Local:* endereço da gravação

*Serviços:* R$ 4.800,00
*Deslocamento:* R$ 150,00 (12,4 km)
*Total estimado:* R$ 4.950,00

*Observações:* inclui captação, edição e uma rodada de ajustes.

[NOME DA PRODUTORA] — mensagem de assinatura.
```

Antes do envio, o sistema valida os campos obrigatórios. Em trabalhos presenciais, também exige que o deslocamento tenha sido calculado para o endereço atual.

## 10. Estrutura de dados sugerida

Na implementação atual, produtos e preços ficam no próprio JavaScript. Para a produtora, é melhor centralizar as configurações em `data/servicos.json` ou em um banco de dados.

```json
{
  "tipos": [
    {
      "id": "social",
      "nome": "Conteúdo para redes sociais",
      "formatos": ["vertical", "horizontal"],
      "pacotes": [
        {
          "id": "social-essencial",
          "nome": "Pacote Social Essencial",
          "entregaveisPorPacote": 4,
          "horasPorPacote": 16,
          "precoPacote": 2400
        }
      ]
    }
  ]
}
```

Campos importantes por serviço:

- identificador estável;
- nome comercial;
- tipo de contratação;
- formatos compatíveis;
- entregáveis incluídos;
- horas estimadas;
- preço unitário;
- adicionais permitidos;
- prazo padrão;
- disponibilidade;
- observações comerciais.

## 11. Arquitetura de arquivos equivalente

```text
area-interna.html                 login e painel interno
orcamentos-audiovisual.html      formulário e prévia
css/orcamentos-audiovisual.css   layout e responsividade
js/internal-auth.js              sessão e autenticação visual
js/orcamentos-audiovisual.js     regras, cálculos e WhatsApp
data/servicos.json               catálogo e preços
```

O sistema pode continuar em HTML, CSS e JavaScript puro. Não exige framework para reproduzir a experiência atual.

## 12. O que o sistema atual não faz

É importante não confundir a interface de acesso com segurança real.

- A senha e sua verificação estão no código publicado no navegador.
- A autenticação usa `sessionStorage` e é válida somente naquela sessão.
- Os orçamentos não são salvos nem recebem numeração.
- Não existe banco de dados ou sincronização entre dispositivos.
- Não há aceite do cliente, assinatura ou pagamento.
- Os preços e regras comerciais podem ficar visíveis no JavaScript público.
- O cálculo de rota depende de serviços públicos de terceiros.

Essa solução atende bem ao uso interno simples em um site estático. Para dados sensíveis ou equipe maior, é necessário backend.

## 13. Evolução recomendada para a produtora

### Primeira versão — cópia fiel

- manter login visual por senha;
- reproduzir formulário, prévia e WhatsApp;
- cadastrar pacotes e preços em JSON;
- calcular entregáveis, horas e deslocamento;
- publicar junto do site existente.

### Segunda versão — operação profissional

- autenticação real de usuários;
- banco de clientes, serviços e orçamentos;
- numeração e validade da proposta;
- histórico e duplicação de orçamento;
- geração de PDF comercial com identidade visual;
- etapas de aprovação: rascunho, enviado, aprovado e recusado;
- aceite eletrônico e sinal de pagamento;
- permissões por membro da equipe;
- painel de produção após aprovação.

## 14. Checklist para iniciar a adaptação

- [ ] Definir nome e identidade visual da produtora.
- [ ] Listar os tipos de produção oferecidos.
- [ ] Definir os três modelos de contratação.
- [ ] Cadastrar pacotes, entregáveis, carga estimada e preços.
- [ ] Definir formatos e combinações válidas.
- [ ] Criar regras de diária, hora técnica e adicionais.
- [ ] Definir regra de deslocamento.
- [ ] Escrever a mensagem padrão do WhatsApp.
- [ ] Informar número oficial do WhatsApp.
- [ ] Decidir se a primeira versão será estática ou terá backend.
- [ ] Testar desktop e celular.
- [ ] Validar cálculos com casos reais antes da publicação.

## 15. Conclusão

O diferencial do sistema é reduzir decisões e transformar um atendimento em uma proposta coerente em poucos minutos. Para o audiovisual, a melhor adaptação é manter o mesmo fluxo e trocar peso/unidades por entregáveis/carga de produção, frete por deslocamento e produto por pacote de serviço.

Com o catálogo e as regras comerciais definidos, a interface atual pode ser reaproveitada quase integralmente. A evolução com backend pode acontecer depois, sem alterar a experiência principal da equipe.
