
import { useState, useEffect } from 'react';
import questionsData from './data/questions.json';
import './App.css';
import { IoEarth } from "react-icons/io5";
import { GiChemicalDrop, GiSoccerBall } from "react-icons/gi";
import { MdTheaterComedy } from "react-icons/md";
import { FaPaintBrush, FaLandmark } from 'react-icons/fa';

const categoryColors = {
  Geografia: "#2b44ff",
  Ciencia: "#4cd964",
  Deportes: "#ff9500",
  Entretenimiento: "#ff2d55",
  Arte: "#8e1d1d",
  Historia: "#ffcc00"
};

const categoryIcons = {
  Geografia: <IoEarth />,
  Ciencia: <GiChemicalDrop />,
  Deportes: <GiSoccerBall />,
  Entretenimiento: <MdTheaterComedy />,
  Arte: <FaPaintBrush />,
  Historia: <FaLandmark />
};

type Categoria = keyof typeof questionsData;

export default function App() {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<Categoria | null>(null);
  const [preguntaActual, setPreguntaActual] = useState<any>(null);
  const [preguntasUsadas, setPreguntasUsadas] = useState<Set<string>>(new Set());
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState<string | null>(null);
  const [mostrarRespuesta, setMostrarRespuesta] = useState(false);

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
                style={{ 
                  backgroundColor: categoryColors[categoria as keyof typeof categoryColors],
                  color: 'white'
                }}
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
                    onClick={() => verificarRespuesta(opcion)}
                    className={`opcion-btn ${
                      mostrarRespuesta && opcion === preguntaActual.respuestaCorrecta
                        ? 'correcta'
                        : mostrarRespuesta && opcion === respuestaSeleccionada
                        ? 'incorrecta'
                        : ''
                    }`}
                  >
                    {opcion}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="controles">
            <button onClick={() => {
              setMostrarRespuesta(false);
              setCategoriaSeleccionada(null);
            }
            }>
              Volver a Categorías
            </button>
            <button onClick={reiniciarJuego}>Reiniciar Juego</button>
          </div>
        </div>
      )}
    </main>
  );
}
