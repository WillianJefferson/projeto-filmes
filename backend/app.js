import tabelafilmes from "./tabela.js";
import express from "express";

const app = express();
const PORTA = 3000;

app.use(express.json());

// ==========================================
// FUNÇÃO PARA CARREGAR OS FILMES
// ==========================================

function carregar_filmes() {
  return tabelafilmes;
}

// ==========================================
// ROTA RAIZ
// ==========================================

app.get("/", (req, res) => {
  res.json({
    mensagem: "API FUNCIONANDO",
    rotas: {
      listar: "GET /filmes",
      buscarPorId: "GET /filmes/id/:id",
      buscarPorSigla: "GET /filmes/:sigla",
      buscarPorGenero: "GET /filmes/genero/:genero",
      buscarPorAvaliacao: "GET /filmes/avaliacao/:nota",
    },
  });
});

// ==========================================
// GET /filmes
// LISTAR TODOS
// ==========================================

app.get("/filmes", (req, res) => {
  res.json(tabelafilmes);
});

// ==========================================
// GET /filmes/id/:id
// BUSCAR POR ID
// ==========================================

app.get("/filmes/id/:id", (req, res) => {
  const filmes = carregar_filmes();

  const id = Number(req.params.id);

  const filme = filmes.find((filme) => filme.id === id);

  if (!filme) {
    return res.status(404).json({
      erro: "Filme não encontrado",
    });
  }

  res.json(filme);
});

// ==========================================
// GET /filmes/genero/:genero
// BUSCAR POR GÊNERO
// ==========================================

app.get("/filmes/genero/:genero", (req, res) => {
  const genero_buscar = req.params.genero.toUpperCase();

  const filmes = tabelafilmes.filter(
    (filme) => filme.genero.toUpperCase() === genero_buscar,
  );

  if (filmes.length === 0) {
    return res.status(404).json({
      erro: "Nenhum filme encontrado nesse gênero",
    });
  }

  res.json(filmes);
});

// ==========================================
// GET /filmes/avaliacao/:nota
// BUSCAR POR AVALIAÇÃO
// ==========================================

app.get("/filmes/avaliacao/:nota", (req, res) => {
  const nota = parseFloat(req.params.nota);

  console.log("Nota recebida:", nota);

  const filmes = tabelafilmes.filter((filme) => {
    console.log("Filme:", filme.nome, "Avaliação:", filme.avaliacao);

    return Number(filme.avaliacao) === nota;
  });

  if (filmes.length === 0) {
    return res.status(404).json({
      erro: "Nenhum filme encontrado com essa avaliação",
      notaBuscada: nota,
    });
  }

  res.json(filmes);
});

// ==========================================
// GET /filmes/:sigla
// BUSCAR POR SIGLA
// ==========================================
// DEIXAR ESSA ROTA POR ÚLTIMO!

app.get("/filmes/:sigla", (req, res) => {
  const sigla_buscar = req.params.sigla.toUpperCase();

  const filme = tabelafilmes.find(
    (filme) => filme.sigla && filme.sigla.toUpperCase() === sigla_buscar,
  );

  if (!filme) {
    return res.status(404).json({
      erro: "Filme não encontrado",
    });
  }

  res.json(filme);
});

// ==========================================
// INICIAR SERVIDOR
// ==========================================

app.listen(PORTA, () => {
  console.log(`Servidor rodando em http://localhost:${PORTA}`);
});
