import React, { useState, useEffect } from 'react';
import questionsData from './data/questions.json';
import './App.scss';
import { IoEarth } from "react-icons/io5";
import { GiChemicalDrop as GiChemicalDropIcon, GiSoccerBall } from "react-icons/gi";
import { IoIosArrowBack } from "react-icons/io";
import { MdTheaterComedy } from "react-icons/md";
import { FaPaintBrush, FaLandmark } from 'react-icons/fa';
import { RiResetLeftFill } from "react-icons/ri";
import incorrectSound from './assets/audio/incorrect.mp3';
import correctSound from './assets/audio/correct.mp3';

const categoryColors = {
  Geografia: "#2b44ff",
  Ciencia: "#4cd964",
  Deportes: "#ff9500",
  Entretenimiento: "#ff2d55",
  Arte: "#8e1d1d",
  Historia: "#ffcc00"
};

const categoryIcons = {
  Geografia: IoEarth,
  Ciencia: GiChemicalDropIcon,
  Deportes: GiSoccerBall,
  Entretenimiento: MdTheaterComedy,
  Arte: FaPaintBrush,
  Historia: FaLandmark
};

const defaultEquipos = Array.from({length: 8}, (_, i) => ({
  nombre: '',
  puntos: 0,
}));

type Categoria = keyof typeof questionsData;
type Equipo = {
  nombre: string;
  puntos: number;
};

export default function App() {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<Categoria | null>(null);
  const [preguntaActual, setPreguntaActual] = useState<any>(null);
  const [preguntasUsadas, setPreguntasUsadas] = useState<Set<string>>(new Set());
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState<string | null>(null);
  const [mostrarRespuesta, setMostrarRespuesta] = useState(false);
  const [opcionesDescartadas, setOpcionesDescartadas] = useState<string[]>([]);
  const [dobleChanceUsada, setDobleChanceUsada] = useState<boolean>(false);
  const [opcionesSeleccionadas, setOpcionesSeleccionadas] = useState<string[]>([]);

  const [equipos, setEquipos] = useState<Equipo[]>(defaultEquipos);

  const categorias = Object.keys(questionsData) as Categoria[];

  // Levantar de localStorage
  useEffect(() => {
    const storedPreguntasUsadas = localStorage.getItem('preguntasUsadas');
    if (storedPreguntasUsadas) {
      setPreguntasUsadas(new Set(JSON.parse(storedPreguntasUsadas)));
    }

    const storedEquipos = localStorage.getItem('equipos');
    console.log(storedEquipos);
    if (storedEquipos) {
      setEquipos(JSON.parse(storedEquipos));
    }
  }, []);

  // Guardar localStorage
  useEffect(() => {
    localStorage.setItem('preguntasUsadas', JSON.stringify(Array.from(preguntasUsadas)));
  }, [preguntasUsadas]);
  useEffect(() => {
    localStorage.setItem('equipos', JSON.stringify(equipos));
  }, [equipos]);

  // Reiniciar estados al cambiar de pregunta
  useEffect(() => {
    if (categoriaSeleccionada) {
      obtenerPreguntaAleatoria();
      setOpcionesSeleccionadas([]);
    }
  }, [categoriaSeleccionada]);

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
    setOpcionesDescartadas([]);
  };

  const verificarRespuesta = (opcion: string) => {
    if (opcion === preguntaActual.respuestaCorrecta) {
      new Audio(correctSound).play();
    } else {
      new Audio(incorrectSound).play();
    }
    setRespuestaSeleccionada(opcion);
    setMostrarRespuesta(true);
  };

  const reiniciarJuego = () => {
    setPreguntasUsadas(new Set());
    setCategoriaSeleccionada(null);
    setPreguntaActual(null);
    setEquipos(defaultEquipos);
    localStorage.removeItem('preguntasUsadas');
    localStorage.removeItem('equipos');
  };

  const setNombreEquipo = (index: number, nombre: string) => {
    setEquipos(prev => {
      const nuevosEquipos = [...prev];
      nuevosEquipos[index].nombre = nombre;
      return nuevosEquipos;
    });
  };

  const setPuntajeEquipo = (index: number, puntos: number) => {
    setEquipos(prev => {
      const nuevosEquipos = [...prev];
      nuevosEquipos[index].puntos = puntos;
      return nuevosEquipos;
    });
  };

  return (
    <main className="container">
      {!categoriaSeleccionada ? (
        <div className="categoria-selector">
          <div className="categorias">
            {categorias.map(categoria => (
              <button
                key={categoria}
                onClick={() => setCategoriaSeleccionada(categoria)}
                className="categoria-btn"
                style={{
                  backgroundColor: categoryColors[categoria as keyof typeof categoryColors],
                }}
              >
                <span className="categoria-icon">{
                  categoryIcons[categoria]
                    ? React.createElement(categoryIcons[categoria] as React.ComponentType)
                    : null
                }</span>
                {categoria}
              </button>
            ))}
          </div>
          <div className="puntajes">
            {equipos.map(({nombre, puntos}, i) => (
                <div className="equipo" key={i}>
                  <div>Equipo {i + 1}</div>
                  <input
                      type="text"
                      value={nombre}
                      onChange={(event) => setNombreEquipo(i, event.target.value)}
                  />
                  <input
                      type="number"
                      value={puntos}
                      step={100}
                      onChange={(event) => setPuntajeEquipo(i, +event.target.value)}
                  />
                </div>
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
                {preguntaActual.opciones.map((opcion: string) => {
                  const estaDescartada = opcionesDescartadas.includes(opcion);
                  const estaSeleccionada = opcionesSeleccionadas.includes(opcion);
                  return (
                    <button
                      key={opcion}
                      onClick={() => verificarRespuesta(opcion)}
                      className={`opcion-btn ${mostrarRespuesta && opcion === preguntaActual.respuestaCorrecta
                        ? 'correcta'
                        : mostrarRespuesta && opcion === respuestaSeleccionada
                          ? 'incorrecta'
                          : ''
                        } ${estaDescartada ? 'descartada' : ''} ${estaSeleccionada ? 'seleccionada' : ''}`}
                      disabled={mostrarRespuesta || estaDescartada || (dobleChanceUsada && opcionesSeleccionadas.length >= 2)}
                    >
                      {opcion}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          <div className="controles">
            <button
              onClick={() => {
                setMostrarRespuesta(false);
                setCategoriaSeleccionada(null);
              }}
            >
              {React.createElement(IoIosArrowBack as React.ComponentType)}
              Volver
            </button>
            <button
              onClick={() => reiniciarJuego()}
            >
              {React.createElement(RiResetLeftFill as React.ComponentType)}
              Reiniciar
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
