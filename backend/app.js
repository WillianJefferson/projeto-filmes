import tabelafilmes from "./tabela.js";
import express from "express";

// PORTA DA APLICAÇÃO
const PORTA = 3000;

// INICIALIZAR A APLICAÇÃO EXPRESS
const app = express();

// PERMITE RECEBER JSON NO BODY DAS REQUISIÇÕES
app.use(express.json());

// FUNÇÃO PARA CARREGAR OS FILMES
function carregar_filmes() {
  return tabelafilmes;
}

// ======================================================
// ROTA RAIZ
// GET /
// ======================================================
app.get("/", (req, res) => {
  res.json({
    mensagem: "API FUNCIONANDO",
    rotas: {
      listar: "GET /filmes",
      buscarPorId: "GET /filmes/id/:id",
      buscarPorSigla: "GET /filmes/:sigla",
      buscarPorGenero: "GET /filmes/genero/:genero",
      buscaPorDiretor: "GET /filmes/diretor/:diretor",
      trailer: "GET /filmes/id/:id/trailer",
      adicionar: "POST /filmes",
      deletar: "DELETE /filmes/:id",
    },
  });
});

// ======================================================
// LISTAR TODOS OS FILMES
// GET /filmes
// ======================================================
app.get("/filmes", (req, res) => {
  res.json(tabelafilmes);
});

// ======================================================
// BUSCAR FILME PELO ID
// GET /filmes/id/:id
// ======================================================
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

// ======================================================
// MOSTRA O TRAILER DO FILME
// GET /filmes/id/:id/trailer
// ======================================================
app.get("/filmes/id/:id/trailer", (req, res) => {
  const filmes = carregar_filmes();
  const id = Number(req.params.id);
  const filme = filmes.find((filme) => filme.id === id);

  if (!filme) {
    return res.status(404).json({
      erro: "Filme não encontrado",
    });
  }

  res.json({
    id: filme.id,
    nome: filme.nome,
    trailer: filme.trailer,
  });
});

// ======================================================
// BUSCAR FILME PELA SIGLA
// GET /filmes/:sigla
// ======================================================
app.get("/filmes/:sigla", (req, res) => {
  const sigla_buscar = req.params.sigla.toUpperCase();
  const filme = tabelafilmes.find(
    (filme) => filme.sigla.toUpperCase() === sigla_buscar,
  );

  if (!filme) {
    return res.status(404).json({ erro: "Filme não encontrado" });
  }

  res.json(filme);
});

// ======================================================
// BUSCAR FILMES PELO GÊNERO
// GET /filmes/genero/:genero
// ======================================================
app.get("/filmes/genero/:genero", (req, res) => {
  const genero_buscar = req.params.genero.toUpperCase();
  const filmes = tabelafilmes.filter(
    (filme) => filme.genero.toUpperCase() === genero_buscar,
  );

  if (filmes.length === 0) {
    return res.status(404).json({
      erro: "Nenhum filme encontrado para esse gênero",
    });
  }

  res.json(filmes);
});

// ======================================================
// BUSCAR FILMES PELO DIRETOR
// GET /filmes/diretor/:diretor
// ======================================================
app.get("/filmes/diretor/:diretor", (req, res) => {
  const diretor_buscar = req.params.diretor.toUpperCase();
  const diretor = tabelafilmes.filter(
    (filme) => filme.diretor.toUpperCase() === diretor_buscar,
  );

  if (diretor.length === 0) {
    return res.status(404).json({
      erro: "Nenhum filme encontrado para esse diretor",
    });
  }

  res.json(diretor);
});

// ======================================================
// ADICIONAR NOVO FILME
// POST /filmes
// ======================================================
app.post("/filmes", (req, res) => {
  const novoFilme = req.body;

  if (novoFilme.id === undefined) {
    return res.status(400).json({
      erro: "O ID do filme é obrigatório",
    });
  }

  const filmeExistente = tabelafilmes.find(
    (filme) => filme.id === Number(novoFilme.id),
  );

  if (filmeExistente) {
    return res.status(400).json({
      erro: "Já existe um filme com esse ID",
    });
  }

  tabelafilmes.push(novoFilme);

  res.status(201).json({
    mensagem: "Filme adicionado com sucesso",
    filme: novoFilme,
  });
});

// ======================================================
// DELETAR FILME PELO ID
// DELETE /filmes/:id
// ======================================================
app.delete("/filmes/:id", (req, res) => {
  const id = Number(req.params.id);
  const indice = tabelafilmes.findIndex((filme) => filme.id === id);

  if (indice === -1) {
    return res.status(404).json({
      erro: "Filme não encontrado",
    });
  }

  const filmeRemovido = tabelafilmes.splice(indice, 1);

  res.json({
    mensagem: "Filme deletado com sucesso",
    filme: filmeRemovido[0],
  });
});

// ======================================================
// INICIALIZAÇÃO DO SERVIDOR
// ======================================================
app.listen(PORTA, () => {
  console.log(`Servidor rodando em http://localhost:${PORTA}`);
});
