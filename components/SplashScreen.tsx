import React from 'react';

interface SplashScreenProps {
    onStart: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onStart }) => {
    return (
        <div 
            className="w-screen h-screen bg-cover bg-center flex flex-col items-center justify-center text-center p-4"
            style={{ backgroundImage: "url('https://raw.githubusercontent.com/vdhuerta/assets-aplications/main/Portada_VitoMath.png')" }}
            aria-label="Pantalla de bienvenida de Vito Math"
        >
            <div className="bg-white/20 backdrop-blur-sm p-8 md:p-12 rounded-2xl shadow-2xl border-4 border-vito-yellow/50 w-full max-w-md md:max-w-lg flex flex-col items-center">
                <h1 className="text-5xl md:text-8xl font-press-start text-vito-yellow mb-4 animate-pulse" style={{ textShadow: '6px 6px #000' }}>
                    Vito Math
                </h1>
                <p className="text-white text-xl md:text-3xl font-bold font-fredoka mb-8" style={{ textShadow: '3px 3px #000' }}>
                    Aventura Matemática con Vito
                </p>
                <button
                    onClick={onStart}
                    className="bg-vito-green text-white font-bold py-4 px-8 rounded-full shadow-lg transform hover:scale-110 transition-transform duration-200 text-2xl md:text-3xl animate-pulse"
                    style={{ textShadow: '2px 2px #000' }}
                >
                    A Jugar!!
                </button>
            </div>
        </div>
    );
};

export default SplashScreen;
