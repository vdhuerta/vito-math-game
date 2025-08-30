import React, { useState } from 'react';
import { Question } from '../types';

interface QuestionModalProps {
    question: Question;
    onAnswer: (isCorrect: boolean) => void;
}

const QuestionModal: React.FC<QuestionModalProps> = ({ question, onAnswer }) => {
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    
    const handleOptionClick = (option: number) => {
        // La guarda principal contra clics múltiples ahora está en Game.tsx.
        // Este estado previene más interacciones después de que la primera respuesta
        // ha sido registrada y el componente se ha vuelto a renderizar.
        if (isAnswered) {
            return;
        }
        
        setSelectedOption(option);
        setIsAnswered(true);

        const isCorrect = option === question.answer;

        // Notificar al componente padre del resultado. El padre se encargará de
        // la lógica del juego y de cerrar el modal.
        onAnswer(isCorrect);
    };

    const getButtonClass = (option: number) => {
        if (!isAnswered) {
            return 'bg-vito-blue hover:bg-blue-400';
        }
        if (option === question.answer) {
            return 'bg-vito-green'; // Respuesta correcta siempre verde
        }
        if (option === selectedOption && option !== question.answer) {
            return 'bg-vito-red animate-shake'; // Respuesta incorrecta seleccionada en rojo y tiembla
        }
        return 'bg-gray-500 opacity-70'; // Otras respuestas incorrectas en gris
    };

    return (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-40 p-4">
            <div className="w-full max-w-2xl bg-white rounded-2xl p-8 shadow-2xl border-8 border-vito-brown text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                    {question.question}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {question.options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => handleOptionClick(option)}
                            disabled={isAnswered}
                            className={`p-6 text-white font-bold text-4xl rounded-lg shadow-md transition-all duration-300 transform ${!isAnswered ? 'hover:scale-105' : ''} ${getButtonClass(option)}`}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default QuestionModal;