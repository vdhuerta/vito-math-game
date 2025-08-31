

import React, { useState } from 'react';

interface HelpModalProps {
    onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
    const [view, setView] = useState<'player' | 'teacher'>('player');

    const renderPlayerHelp = () => {
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        return (
            <>
                <h2 className="text-3xl md:text-4xl font-press-start text-vito-blue mb-6 text-center">¿Cómo Jugar?</h2>
                <div className="space-y-4 text-gray-700 text-lg">
                    <div>
                        <h3 className="font-bold text-xl text-vito-red">Objetivo</h3>
                        <p>¡Ayuda a Vito a rescatar a la princesa! Resuelve acertijos matemáticos para avanzar por las etapas, derrotar enemigos y llegar al castillo final.</p>
                    </div>
                    <div>
                        <h3 className="font-bold text-xl text-vito-red">Controles</h3>
                        {isTouchDevice ? (
                             <p className="list-disc list-inside ml-4">Usa los <strong>controles táctiles</strong> en la pantalla para moverte a la izquierda, derecha y para saltar.</p>
                        ) : (
                            <ul className="list-disc list-inside ml-4">
                                <li><strong>Moverse:</strong> Usa las <strong>Flechas Izquierda y Derecha</strong>.</li>
                                <li><strong>Saltar:</strong> Presiona la <strong>Barra Espaciadora</strong> o la <strong>Flecha Arriba</strong>.</li>
                            </ul>
                        )}
                    </div>
                    <div>
                        <h3 className="font-bold text-xl text-vito-red">Elementos del Juego</h3>
                        <ul className="list-disc list-inside ml-4 space-y-2">
                            <li><strong>Bloques de Interrogación (?):</strong> ¡Golpéalos desde abajo! Cada bloque contiene un acertijo matemático. Si respondes bien, ganas puntos y el bloque se marca como resuelto.</li>
                            <li><strong>Tortubits (Enemigos):</strong> Evita tocarlos o perderás una vida. ¡Sáltales encima para derrotarlos y ganar puntos extra!</li>
                            <li><strong>Vidas:</strong> Comienzas con 3 vidas. Ganas una vida extra cada dos etapas completadas. ¡Cuidado! Si te quedas sin vidas, el juego termina.</li>
                            <li><strong>Niveles de Bonus:</strong> Si resuelves todos los acertijos de una etapa, ¡se abrirá un nivel secreto! Recoge todas las gemas que puedas antes de que se acabe el tiempo.</li>
                        </ul>
                    </div>
                </div>
                <div className="text-center mt-8">
                    <button
                        onClick={() => setView('teacher')}
                        className="bg-vito-green text-white font-bold py-2 px-6 rounded-full hover:bg-vito-yellow hover:text-black transition-transform transform hover:scale-110 text-xl"
                    >
                        Para el Profesor
                    </button>
                </div>
            </>
        );
    }

    const renderTeacherHelp = () => (
        <>
            <h2 className="text-3xl md:text-4xl font-press-start text-vito-blue mb-6 text-center">Guía para el Profesor</h2>
            <div className="space-y-4 text-gray-700 text-lg">
                <p><strong>Vito Math</strong> no solo es un juego divertido, sino también una herramienta pedagógica diseñada para fortalecer la comprensión de las <strong>estructuras aditivas</strong> en los estudiantes.</p>
                <div>
                    <h3 className="font-bold text-xl text-vito-red">Fundamento Didáctico</h3>
                    <p>Las preguntas no son simples operaciones. Están basadas en la clasificación de problemas aditivos de investigadores como Gérard Vergnaud. Cada acertijo pertenece a una de las siguientes categorías:</p>
                    <ul className="list-disc list-inside ml-4 mt-2">
                        <li><strong>Combinación:</strong> Relación parte-parte-todo.</li>
                        <li><strong>Transformación:</strong> Involucran una acción que aumenta o disminuye una cantidad.</li>
                        <li><strong>Comparación:</strong> Relación de "más que" o "menos que".</li>
                        <li><strong>Igualación:</strong> Buscan la acción para que dos cantidades sean iguales.</li>
                    </ul>
                </div>
                 <div>
                    <h3 className="font-bold text-xl text-vito-red">Objetivo Pedagógico</h3>
                    <p>Al exponer a los niños a esta variedad de problemas, se fomenta un razonamiento matemático más flexible y profundo, evitando que dependan únicamente de "palabras clave" para resolver problemas.</p>
                 </div>
                 <div>
                    <h3 className="font-bold text-xl text-vito-red">Progresión</h3>
                     <p>La dificultad aumenta con los niveles, utilizando números de 1, 2 y 3 cifras para 1er, 2do y 3er Grado, respectivamente.</p>
                 </div>
            </div>
            <p className="text-center text-vito-blue mt-8">Creado por Victor Huerta © 2025</p>
             <div className="text-center mt-8">
                <button
                    onClick={() => setView('player')}
                    className="bg-vito-brown text-white font-bold py-2 px-6 rounded-full hover:bg-yellow-600 transition-transform transform hover:scale-110 text-xl"
                >
                    Volver a la Ayuda
                </button>
            </div>
        </>
    );

    return (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-40 p-4 font-fredoka">
            <div className="w-full max-w-3xl bg-white rounded-2xl p-6 md:p-8 shadow-2xl border-8 border-vito-yellow relative max-h-[90vh] overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-vito-red text-5xl font-bold leading-none"
                    aria-label="Cerrar ayuda"
                >
                    &times;
                </button>
                {view === 'player' ? renderPlayerHelp() : renderTeacherHelp()}
            </div>
        </div>
    );
};

export default HelpModal;
