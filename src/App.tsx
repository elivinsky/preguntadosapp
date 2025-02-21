
import { useState, useEffect } from 'react';
import questionsData from './data/questions.json';
import './App.css';
import { FaGlobeAmericas, FaFlask, FaFootballBall, FaFilm, FaPaintBrush, FaLandmark } from 'react-icons/fa';

const categoryIcons = {
  Geografia: <FaGlobeAmericas />,
  Ciencia: <FaFlask />,
  Deportes: <FaFootballBall />,
  Entretenimiento: <FaFilm />,
  Arte: <FaPaintBrush />,
  Historia: <FaLandmark />
};

type Categoria = keyof typeof questionsData;

export default function App() {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<Categoria | null>(null);
  const [preguntaActual, setPreguntaActual] = useState<any>(null);
  const [preguntasUsadas, setPreguntasUsadas] = useState<Set<string>>(new Set());

  const categorias = Object.keys(questionsData) as Categoria[];

  const obtenerPreguntaAleatoria = () => {
    if (!categoriaSeleccionada) return;
    
    const preguntasCategoria = questionsData[categoriaSeleccionada];
    const preguntasDisponibles = preguntasCategoria.filter(
      p => !preguntasUsadas.has(p.pregunta)
    );

    if (preguntasDisponibles.length === 0) {
      alert('¡Ya no hay más preguntas disponibles en esta categoría!');
      return;
    }

    const preguntaRandom = preguntasDisponibles[
      Math.floor(Math.random() * preguntasDisponibles.length)
    ];
    
    setPreguntaActual(preguntaRandom);
    setPreguntasUsadas(prev => new Set(prev).add(preguntaRandom.pregunta));
  };

  const verificarRespuesta = (opcion: string) => {
    setRespuestaSeleccionada(opcion);
    setMostrarRespuesta(true);
  };

  const reiniciarJuego = () => {
    setPreguntasUsadas(new Set());
    setCategoriaSeleccionada(null);
    setPreguntaActual(null);
  };

  useEffect(() => {
    if (categoriaSeleccionada) {
      obtenerPreguntaAleatoria();
    }
  }, [categoriaSeleccionada]);

  return (
    <main className="container">
      <h1>Juego de Preguntas</h1>
      
      {!categoriaSeleccionada ? (
        <div className="categoria-selector">
          <h2>Selecciona una categoría:</h2>
          <div className="categorias">
            {categorias.map(categoria => (
              <button
                key={categoria}
                onClick={() => setCategoriaSeleccionada(categoria)}
                className="categoria-btn"
              >
                <span className="categoria-icon">{categoryIcons[categoria as keyof typeof categoryIcons]}</span>
                {categoria}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="juego">
          <h2>Categoría: {categoriaSeleccionada}</h2>
          {preguntaActual && (
            <div className="pregunta">
              <p>{preguntaActual.pregunta}</p>
              <div className="opciones">
                {preguntaActual.opciones.map((opcion: string) => (
                  <button
                    key={opcion}
                    className={`opcion-btn ${
                      opcion === preguntaActual.respuestaCorrecta ? 'correcta' : ''
                    }`}
                  >
                    {opcion}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="controles">
            <button onClick={() => setCategoriaSeleccionada(null)}>
              Volver a Categorías
            </button>
            <button onClick={reiniciarJuego}>Reiniciar Juego</button>
          </div>
        </div>
      )}
    </main>
  );
}
