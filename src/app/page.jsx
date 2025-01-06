'use client';

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await fetch('/exercises.json');
        if (!response.ok) {
          throw new Error('Erro ao buscar os exercícios')
        }
        const data = await response.json();
        console.log('Exercícios: ', data);
        setExercises(data);
      } catch (error) {
        
      }
        
    };

    fetchExercises();
  }, []);

  const handleLinkClick = (id) => {
    localStorage.setItem('selectedExercise', id);
  };

  return (
    <main className="flex items-center justify-center min-h-screen p-6 bg-gray-900 text-white">
      <div className="max-w-[800px] w-full">
        <h1 className="text-3xl font-bold mb-4">Lista de Exercícios</h1>
        {exercises.length === 0 ? (
          <p>Carregando exercícios...</p>
        ) : (
          <ul className="max-w-[800px] space-y-4">
            {exercises.map((exercise) => (
              <li key={exercise.id} className="p-4 border rounded bg-slate-900 hover:bg-slate-800 cursor-pointer">
                <Link
                  href={`/exercise/${exercise.id}`}
                  onClick={() => handleLinkClick(exercise.id)}
                  className="block text-white"
                >
                  {exercise.title} - <span className="italic">{exercise.level}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
