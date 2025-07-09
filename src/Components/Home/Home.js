import React, { useState, useEffect, useRef } from "react";
import "./home.css";

function Home() {
  const [jogos, setJogos] = useState([]);
  const [flipped, setFlipped] = useState({});
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  const [filtro, setFiltro] = useState("todos");
  const [ordenacao, setOrdenacao] = useState(null);
  const [menuAberto, setMenuAberto] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/viniciuszile/Jogos-Main/refs/heads/main/Data/jogos.json"
    )
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao buscar os dados");
        return res.json();
      })
      .then((data) => {
        setJogos(data);
        setLoading(false);
      })
      .catch(() => {
        setErro("Falha ao carregar os jogos.");
        setLoading(false);
      });
  }, []);

  function toggleFlip(index) {
    setFlipped((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  }

  function removerAcentos(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function isConcluido(situacao) {
    if (!situacao) return false;
    const normalizado = removerAcentos(situacao).toLowerCase().trim();
    return normalizado === "concluido";
  }

  function extrairHoras(jogo) {
    const valor = jogo["Horas De Jogo"]?.trim() || "";
    const num = parseInt(valor, 10);
    if (!isNaN(num)) {
      return num;
    }
    return 0;
  }

  function ordenarPorNome(a, b) {
    const nomeA = (a.nome || "").toLowerCase();
    const nomeB = (b.nome || "").toLowerCase();
    if (nomeA < nomeB) return -1;
    if (nomeA > nomeB) return 1;
    return 0;
  }

  function ordenarPorTempo(a, b) {
    return extrairHoras(a) - extrairHoras(b);
  }

  function toggleOrdenacaoNome() {
    if (ordenacao === "nome-asc") {
      setOrdenacao("nome-desc");
    } else {
      setOrdenacao("nome-asc");
    }
  }

  function toggleOrdenacaoTempo() {
    if (ordenacao === "tempo-asc") {
      setOrdenacao("tempo-desc");
    } else {
      setOrdenacao("tempo-asc");
    }
  }

  let jogosFiltrados = jogos.filter((jogo) => {
    if (filtro === "concluidos") return isConcluido(jogo.situacao);
    if (filtro === "nao-concluidos") return !isConcluido(jogo.situacao);
    return true;
  });

  if (ordenacao === "nome-asc") {
    jogosFiltrados = [...jogosFiltrados].sort(ordenarPorNome);
  } else if (ordenacao === "nome-desc") {
    jogosFiltrados = [...jogosFiltrados].sort((a, b) => ordenarPorNome(b, a));
  } else if (ordenacao === "tempo-asc") {
    jogosFiltrados = [...jogosFiltrados].sort(ordenarPorTempo);
  } else if (ordenacao === "tempo-desc") {
    jogosFiltrados = [...jogosFiltrados].sort((a, b) => ordenarPorTempo(b, a));
  }

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuAberto(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) return <p style={{ color: "#fff" }}>Carregando...</p>;
  if (erro) return <p style={{ color: "red" }}>{erro}</p>;

  return (
    <>
      <button className="filtro-toggle" onClick={() => setMenuAberto(!menuAberto)}>
        🎮 Filtros
      </button>

      {menuAberto && (
        <div className="menu-flutuante" ref={menuRef}>
          <h4>Filtrar por:</h4>
          <button
            className={filtro === "todos" ? "ativo" : ""}
            onClick={() => setFiltro("todos")}
          >
            Todos
          </button>
          <button
            className={filtro === "concluidos" ? "ativo" : ""}
            onClick={() => setFiltro("concluidos")}
          >
            Concluídos
          </button>
          <button
            className={filtro === "nao-concluidos" ? "ativo" : ""}
            onClick={() => setFiltro("nao-concluidos")}
          >
            Não Concluídos
          </button>

          <h4>Ordenar por:</h4>
          <button
            className={ordenacao === "nome-asc" ? "ativo" : ""}
            onClick={toggleOrdenacaoNome}
          >
            Ordem alfabética{" "}
            {ordenacao === "nome-asc"
              ? "(A → Z)"
              : ordenacao === "nome-desc"
              ? "(Z → A)"
              : ""}
          </button>
          <button
            className={ordenacao === "tempo-asc" ? "ativo" : ""}
            onClick={toggleOrdenacaoTempo}
          >
            Tempo de jogo{" "}
            {ordenacao === "tempo-asc"
              ? "(Menor → Maior)"
              : ordenacao === "tempo-desc"
              ? "(Maior → Menor)"
              : ""}
          </button>
          <button onClick={() => setOrdenacao(null)}>Limpar ordenação</button>
        </div>
      )}

      <div className="container_card">
        {jogosFiltrados.map((jogo, index) => (
          <div
            key={index}
            className={`card ${flipped[index] ? "flipped" : ""} ${
              isConcluido(jogo.situacao) ? "concluido" : "nao-concluido"
            }`}
            onClick={() => toggleFlip(index)}
          >
            <div className="card-front">
              <img src={jogo.imagem} alt={`Capa do jogo ${jogo.nome || "sem nome"}`} />
              <span className="plataforma">{jogo.plataforma}</span>
            </div>
            <div className="card-back">
              <p>
                <strong>Nome:</strong> {jogo.nome}
              </p>
              <p>
                <strong>Início:</strong> {jogo.inicio || "-"}
              </p>
              <p>
                <strong>Término:</strong> {jogo.termino || "-"}
              </p>
              <p>
                <strong>Situação:</strong> {jogo.situacao || "-"}
              </p>
              <p>
                <strong>Horas De Jogo:</strong> {extrairHoras(jogo)}
              </p>
              <p>
                <strong>Dificuldade:</strong> {jogo.dificuldade || "-"}
              </p>
              <p>
                <strong>Nota:</strong> {jogo.nota || "-"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Home;
