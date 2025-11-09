import React from 'react';

interface InstructionsModalProps {
    onClose: () => void;
}

const InstructionsModal: React.FC<InstructionsModalProps> = ({ onClose }) => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    return (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 font-fredoka">
            <div className="w-full max-w-lg bg-white rounded-2xl p-8 shadow-2xl border-8 border-vito-yellow text-center">
                <h2 className="text-3xl md:text-4xl font-press-start text-vito-blue mb-6">¡A Jugar!</h2>
                
                <div className="text-left space-y-4 text-gray-700 text-lg mb-8">
                    <p>
                        <strong className="text-vito-red">Objetivo:</strong> ¡Resuelve los problemas matemáticos para avanzar y rescatar a la princesa!
                    </p>
                    <div>
                        <h3 className="font-bold text-xl text-vito-red">Controles:</h3>
                        {isTouchDevice ? (
                             <p className="list-disc list-inside ml-4">Usa los <strong>controles en pantalla</strong> para moverte y saltar.</p>
                        ) : (
                            <ul className="list-disc list-inside ml-4">
                                <li><strong>Moverse:</strong> Flechas Izquierda y Derecha</li>
                                <li><strong>Saltar:</strong> Barra Espaciadora o Flecha Arriba</li>
                            </ul>
                        )}
                    </div>
                     <p>
                        <strong className="text-vito-red">¡Cuidado!</strong> Salta sobre los enemigos para vencerlos. ¡No dejes que te toquen!
                    </p>
                </div>

                <button
                    onClick={onClose}
                    className="bg-vito-green text-white font-bold py-3 px-8 rounded-full hover:bg-vito-yellow hover:text-black transition-transform transform hover:scale-110 text-2xl animate-pulse"
                >
                    ¡Entendido!
                </button>
            </div>
        </div>
    );
};

export default InstructionsModal;
