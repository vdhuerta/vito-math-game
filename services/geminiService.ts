import { GoogleGenAI, Type } from "@google/genai";
import { GameLevel, Question } from '../types';

// La API Key se obtiene directamente de las variables de entorno, restaurando el método original.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });


// --- Helpers para generación de números ---

const getNumberRange = (level: GameLevel) => {
    switch (level) {
        case GameLevel.FirstGrade: return { min: 1, max: 9 };
        case GameLevel.SecondGrade: return { min: 10, max: 99 };
        case GameLevel.ThirdGrade: return { min: 100, max: 999 };
        default: return { min: 1, max: 9 };
    }
};

const randomNumber = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// --- Definición de Estructuras de Problemas Aditivos ---

interface ProblemType {
    key: string;
    description: string;
    generateOperands: (level: GameLevel) => { n1: number; n2: number; answer: number };
}

const problemTypes: ProblemType[] = [
    {
        key: 'Combinación 1',
        description: 'Relación parte-parte-todo. Se conocen dos partes y se pregunta por el todo. La operación es una suma.',
        generateOperands: (level) => {
            const { min, max } = getNumberRange(level);
            const n1 = randomNumber(min, max);
            const n2 = randomNumber(min, max);
            return { n1, n2, answer: n1 + n2 };
        }
    },
    {
        key: 'Combinación 2',
        description: 'Relación parte-parte-todo. Se conoce el todo y una de las partes. Se pregunta por la otra parte. La operación es una resta.',
        generateOperands: (level) => {
            const { min, max } = getNumberRange(level);
            const n1 = randomNumber(min, max);
            const n2 = randomNumber(min, max);
            const total = n1 + n2;
            return { n1: total, n2: n1, answer: n2 };
        }
    },
    {
        key: 'Transformación 1',
        description: 'Aumento, final desconocido. Se tiene una cantidad inicial, se le añade otra y se pregunta por la cantidad final. La operación es una suma.',
        generateOperands: (level) => {
            const { min, max } = getNumberRange(level);
            const n1 = randomNumber(min, max);
            const n2 = randomNumber(min, max);
            return { n1, n2, answer: n1 + n2 };
        }
    },
    {
        key: 'Transformación 2',
        description: 'Disminución, final desconocido. Se tiene una cantidad inicial, se le quita otra y se pregunta por la cantidad final. La operación es una resta.',
        generateOperands: (level) => {
            const { min, max } = getNumberRange(level);
            const n1 = randomNumber(min, max);
            const n2 = randomNumber(min, n1); // n2 no puede ser mayor que n1
            return { n1, n2, answer: n1 - n2 };
        }
    },
    {
        key: 'Transformación 3',
        description: 'Aumento, transformación desconocida. Se conoce la cantidad inicial y la final (mayor). Se pregunta por la cantidad que se añadió. La operación es una resta.',
        generateOperands: (level) => {
            const { min, max } = getNumberRange(level);
            const n1 = randomNumber(min, max);
            const n2 = randomNumber(min, max);
            const final = n1 + n2;
            return { n1, n2: final, answer: n2 };
        }
    },
    {
        key: 'Transformación 6',
        description: 'Disminución, inicio desconocido. No se conoce la cantidad inicial. Después de quitar una cantidad, queda una cantidad final. Se pregunta por la inicial. La operación es una suma.',
        generateOperands: (level) => {
            const { min, max } = getNumberRange(level);
            const n1 = randomNumber(min, max);
            const n2 = randomNumber(min, max);
            return { n1, n2, answer: n1 + n2 };
        }
    },
    {
        key: 'Comparación 1',
        description: 'Diferencia desconocida. Se comparan dos cantidades y se pregunta por la diferencia. La operación es una resta.',
        generateOperands: (level) => {
            const { min, max } = getNumberRange(level);
            const n1 = randomNumber(min, max);
            const n2 = randomNumber(min, max);
            const larger = Math.max(n1, n2);
            const smaller = Math.min(n1, n2);
            return { n1: larger, n2: smaller, answer: larger - smaller };
        }
    },
    {
        key: 'Comparación 2',
        description: 'Referido desconocido, "menos que". Se conoce una cantidad y cuánto menos tiene otra. Se pregunta por la segunda cantidad. La operación es una resta.',
        generateOperands: (level) => {
            const { min, max } = getNumberRange(level);
            const n1 = randomNumber(min, max);
            const n2 = randomNumber(min, n1 - 1); // n2 debe ser menor que n1
            return { n1, n2, answer: n1 - n2 };
        }
    },
    {
        key: 'Comparación 3',
        description: 'Referido desconocido, "más que". Se conoce una cantidad y cuánto más tiene otra. Se pregunta por la segunda cantidad. La operación es una suma.',
        generateOperands: (level) => {
            const { min, max } = getNumberRange(level);
            const n1 = randomNumber(min, max);
            const n2 = randomNumber(min, max);
            return { n1, n2, answer: n1 + n2 };
        }
    },
    {
        key: 'Igualación 1',
        description: 'Cantidad a añadir para igualar. Se comparan dos cantidades y se pregunta cuánto le falta a la menor para igualar a la mayor. La operación es una resta.',
        generateOperands: (level) => {
            const { min, max } = getNumberRange(level);
            const n1 = randomNumber(min, max);
            const n2 = randomNumber(min, max);
            const larger = Math.max(n1, n2);
            const smaller = Math.min(n1, n2);
            return { n1: smaller, n2: larger, answer: larger - smaller };
        }
    },
    {
        key: 'Igualación 2',
        description: 'Cantidad a quitar para igualar. Se comparan dos cantidades y se pregunta cuánto le sobra a la mayor para igualar a la menor. La operación es una resta.',
        generateOperands: (level) => {
            const { min, max } = getNumberRange(level);
            const n1 = randomNumber(min, max);
            const n2 = randomNumber(min, max);
            const larger = Math.max(n1, n2);
            const smaller = Math.min(n1, n2);
            return { n1: larger, n2: smaller, answer: larger - smaller };
        }
    },
];

export const generateQuestion = async (level: GameLevel): Promise<Question> => {
    try {
        if (!process.env.API_KEY) {
             throw new Error("API Key no configurada en las variables de entorno.");
        }
        // 1. Seleccionar un tipo de problema aleatorio
        const problemType = problemTypes[Math.floor(Math.random() * problemTypes.length)];

        // 2. Generar operandos y respuesta correcta según el tipo y nivel
        const { n1, n2, answer } = problemType.generateOperands(level);
        
        // 3. Construir el prompt para la IA
        const gradeMap = {
            [GameLevel.FirstGrade]: '6-7 años (1er Grado)',
            [GameLevel.SecondGrade]: '7-8 años (2do Grado)',
            [GameLevel.ThirdGrade]: '8-9 años (3er Grado)',
        };

        const prompt = `
            Genera un problema matemático para un niño de ${gradeMap[level]}.
            El problema DEBE seguir la siguiente estructura aditiva y usar los números proporcionados:
            - Tipo de Problema: ${problemType.key}
            - Descripción de la estructura: ${problemType.description}
            - Números a usar en el enunciado: ${n1} y ${n2}.
            
            Instrucciones:
            1. Crea un problema verbal corto, claro y conciso, apropiado para la edad.
            2. La pregunta final debe incluir la clave del tipo de problema entre paréntesis. Ejemplo: "¿Cuántos tiene ahora? (${problemType.key})".
            3. No uses emojis, imágenes ni formato de lista. Solo el texto del problema.
            4. Asegúrate de que la respuesta correcta al problema sea ${answer}.
        `;

        const responseSchema = {
            type: Type.OBJECT,
            properties: {
                question: { type: Type.STRING, description: 'El problema matemático verbal, incluyendo la clave del tipo entre paréntesis al final.' },
                options: {
                    type: Type.ARRAY,
                    items: { type: Type.NUMBER },
                    description: 'Un array de 3 números: la respuesta correcta y dos incorrectas plausibles.',
                },
                answer: { type: Type.NUMBER, description: 'La respuesta correcta al problema.' },
            },
            required: ['question', 'options', 'answer'],
        };
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 1.0,
            },
        });
        
        const jsonString = response.text.trim();
        const parsedQuestion = JSON.parse(jsonString) as Question;

        // Verificación y corrección de la respuesta por si la IA se equivoca
        if (parsedQuestion.answer !== answer) {
             console.warn(`La IA generó una respuesta (${parsedQuestion.answer}) que no coincide con la calculada (${answer}). Corrigiendo.`);
             parsedQuestion.answer = answer;
             if (!parsedQuestion.options.includes(answer)) {
                 // Reemplaza una de las opciones incorrectas con la respuesta correcta
                 parsedQuestion.options[0] = answer;
             }
        }

        // Asegurar que las opciones se muestren en orden aleatorio
        parsedQuestion.options.sort(() => Math.random() - 0.5);

        return parsedQuestion;

    } catch (error) {
        console.error("Error al generar pregunta desde Gemini API:", error);
        // Pregunta de respaldo en caso de fallo de la API
        const fallbackAnswer = level === 1 ? 4 : level === 2 ? 30 : 150;
        return {
            question: `¿${fallbackAnswer-2} + 2 = ? (Error API)`,
            options: [fallbackAnswer - 1, fallbackAnswer, fallbackAnswer + 2].sort(() => Math.random() - 0.5),
            answer: fallbackAnswer
        };
    }
};