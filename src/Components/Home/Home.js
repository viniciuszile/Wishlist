import React, { useState, useEffect } from "react";
import "./home.css";

function Home() {
  const [jogos, setJogos] = useState([]);
  const [flipped, setFlipped] = useState({});
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/viniciuszile/Wishlist/main/Data/jogos.json"
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

  if (loading) return <p style={{ color: "#fff" }}>Carregando...</p>;
  if (erro) return <p style={{ color: "red" }}>{erro}</p>;

  return (
    <div className="container_card">
      {jogos.map((jogo, index) => (
        <div
          key={index}
          className={`card ${flipped[index] ? "flipped" : ""}`}
          onClick={() => toggleFlip(index)}
        >
          <div className="card-front">
            <img
              src={jogo.link}
              alt={`Capa do jogo`}
              onError={(e) => {
                e.currentTarget.src = "https://via.placeholder.com/250x350?text=Sem+Imagem";
              }}
            />
            <span className="plataforma">{jogo.plataforma}</span>
          </div>
          <div className="card-back">
            <p>
              <strong>Comprado:</strong> {jogo.comprado}
            </p>
            <p>
              <strong>Prioridade:</strong> {jogo.prioridade}
            </p>
            <p>
              <strong>Plataforma:</strong> {jogo.plataforma}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Home;
