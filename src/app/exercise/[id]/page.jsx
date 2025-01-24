'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchGeminiFeedback } from "@/utils/gemini";

export default function ExercisePage() {
    const [exercise, setExercise] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [feedback, setFeedback] = useState('');
    const [error, setError] = useState("");

    useEffect(() => {
        const id = localStorage.getItem('selectedExercise');
        if (id) {    
            const fetchExercise = async () => {
                try {
                    const response = await fetch('/exercises.json');
                    const data = await response.json();
                    const selectedExercise = data.find((exercise) => exercise.id === parseInt(id));
                    setExercise(selectedExercise);
                } catch (error) {
                    console.error("Erro ao carregar exercícios:", error);
                }
            };
            fetchExercise();
        }
    }, []);

    const handleSubmit = async () => {
        if (!exercise || selectedOption === null) return;

        const promptText = `Avalie a seguinte resposta para o exercício "${exercise.question}": ${exercise.options[selectedOption]} e retorne um feedback para a resposta do usuário se está correto ou não e detalhe em poucas palavras. e no caso da resposta estiver errado eu queria que você ensinasse para o usuário a maneira certa`;
        setFeedback("");
        setError("");

        try {
            const geminiResponse = await fetchGeminiFeedback(promptText);
            if (typeof geminiResponse === 'object') {
                setFeedback(JSON.stringify(geminiResponse)); // Converte objeto em string
            } else {
                setFeedback(geminiResponse); // Define feedback diretamente se já for string
            }
        } catch (error) {
            setError("Erro ao processar sua solicitação. Tente novamente.");
        }
    };

    if (!exercise) return <p>Carregando...</p>;

    return (
        <main className="p-6">
            <nav className="mb-6">
                <Link href="/" className="text-blue-500 hover:underline">
                    Voltar para a página inicial
                </Link>
            </nav>

            <h1 className="text-3xl font-bold mb-4">{exercise.title}</h1>
            <p className="mb-4 text-2xl">{exercise.question}</p>

            <div className="mb-4">
                {exercise.options.map((option, index) => (
                    <div key={index} className="mb-2">
                        <input 
                            type="radio"
                            id={`option-${index}`}
                            name="exercise-option"
                            value={index}
                            checked={selectedOption === index}
                            onChange={() => setSelectedOption(index)}
                            className="mr-2 w-5 h-5"
                        />
                        <label htmlFor={`option-${index}`} className="cursor-pointer text-lg">{option}</label>
                    </div>
                ))}
            </div>

            <button
                onClick={handleSubmit}
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
                Enviar
            </button>

            {feedback && (
                <div className="mt-4 p-4 border rounded bg-gray-500 text-gray-800 text-lg">
                    <strong>Feedback:</strong> {feedback}
                </div>
            )}

            {error && (
                <div className="mt-4 p-4 border rounded bg-red-500 text-white text-lg">
                    <strong>Erro:</strong> {error}
                </div>
            )}
        </main>
    );
}
