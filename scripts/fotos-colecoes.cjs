// Fotografias dos produtos DoSim usadas nas aberturas e nos temas com carimbo da marca.
const acervo = {
  '3x-Sim': 'Três biscoitos carimbados DoSim, embalados com laço marrom.',
  'quarteto-dosim': 'Caixa kraft com janela e laço de cetim marrom.',
  'cha-das-simco': 'Caneca com biscoitos DoSim em embalagem transparente.',
  'sim-completo': 'Lata branca aberta com uma seleção de biscoitos DoSim.',
  'encontro-as-09': 'Caixa aberta com biscoitos amanteigados carimbados.',
  '07-padrinhos': 'Caixa comprida com uma fileira de biscoitos de chocolate.',
  'corporativo': 'Biscoito amanteigado com borda ondulada e marca DoSim carimbada.',
  'chocolate': 'Biscoito de chocolate carimbado com a marca DoSim.',
};

const desenhos = {
  'dia-da-mulher': 'Perfil de uma mulher com uma flor no cabelo.',
  'dia-das-maes': 'Dois corações e a palavra “Mãe”.',
  'festa-junina': 'Fogueira sob um cordão de bandeirinhas.',
  'dia-dos-pais': 'Gravata com listras diagonais.',
  'outubro-rosa': 'Laço da campanha Outubro Rosa, com uma fita rosa ao lado do biscoito.',
  'dia-das-criancas': 'Arco-íris entre duas nuvens.',
  'dia-dos-professores': 'Livro aberto com uma maçã.',
  'novembro-azul': 'Bigode e laço de conscientização, com uma fita azul ao lado do biscoito.',
  natal: 'Pinheiro de Natal com uma estrela na ponta.',
  pascoa: 'Coelho sentado de orelhas levantadas.',
  'dia-dos-namorados': 'Coração atravessado por uma flecha.',
  'agradecimento-clientes': 'Um coração e a palavra “Gratidão”.',
  veterinaria: 'Pegada de animal dentro de um coração.',
  medicina: 'Estetoscópio.',
  psicologia: 'Letra grega psi entre dois ramos.',
  'cha-de-lingerie': 'Espartilho com laço.',
  casamentos: 'Duas alianças entrelaçadas sob um coração.',
  aniversarios: 'Bolo de aniversário com velinhas.',
  'cha-revelacao': 'Dois balões com um ponto de interrogação.',
  'primeira-comunhao': 'Cálice com hóstia marcada por uma cruz.',
  'frases-de-fe': 'Palavra “Fé” acima de um ramo.',
  'super-herois': 'Máscara de super-herói com um raio.',
};

const campanhas = {
  halloween: ['collections/halloween', 'Fantasminhas gravados em biscoitos dourados e de chocolate.'],
  safari: ['collections/safari', 'Biscoitos carimbados com um leão e uma girafa.'],
  dinossauros: ['collections/dinossauros', 'Biscoitos com desenhos de dinossauros gravados na massa.'],
  princesas: ['collections/princesas', 'Biscoitos carimbados com coroas e estrelas.'],
  batizado: ['collections/batizado', 'Biscoitos dourados com uma cruz carimbada.'],
  'cha-de-bebe': ['home/cha-de-bebe', 'Biscoitos com carrinhos de bebê gravados na massa.'],
  'eventos-corporativos': ['home/empresarial', 'Caixa de biscoitos dourados e de chocolate com o mesmo emblema de folhas.'],
};

const fotosReais = {
  'brindes-e-recepcao': 'corporativo',
  'dia-do-cliente': 'chocolate',
};

function fotoDoTema(id) {
  if (desenhos[id]) {
    return { src: `/assets/collections/carimbo-${id}.webp`, alt: 'Carimbo no biscoito amanteigado. ' + desenhos[id] };
  }
  if (campanhas[id]) {
    const [arquivo, alt] = campanhas[id];
    return { src: `/assets/${arquivo}.webp`, alt };
  }
  const nome = fotosReais[id];
  if (!nome) throw Error('Escolha um carimbo para a coleção ' + id);
  return { src: `/assets/img/${nome}.webp`, alt: acervo[nome] };
}

module.exports = { fotoDoTema, acervo };
