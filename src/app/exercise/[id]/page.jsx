// 'use client';

// import { useState, useEffect } from "react";
// import Link from "next/link";
// // import { useRouter } from "next/router";

// export default function ExercisePage() {
//     // const router = useRouter();
//     // const { id } = router.query;
//     const [exercise, setExercise] = useState(null);
//     const [code, setCode] = useState('');
//     const [feedback, setFeedback] = useState('');

//     useEffect(() => {
//         const id = localStorage.getItem('selectedExercise');
//         if (id) {    
//             const fetchExercise = async () => {
//                 const response = await fetch('/exercises.json');
//                 const data = await response.json();
//                 const selectedExercise = data.find((exercise) => exercise.id === parseInt(id));
//                 setExercise(selectedExercise);    
//             };
//             fetchExercise();

//         };
//     }, []);

//     const handleSubmitt = () => {
//         if (!exercise) return;

//         const userProperties = code
//             .split(";")
//             .map((prop) => prop.trim())
//             .filter((prop) => prop !== "");

//         const containsAllRequired = exercise.rules.properties.every((prop) =>
//             userProperties.includes(prop)
//         );
        
//         const hasExtraProperties = userProperties.some(
//             (prop) => !exercise.rules.properties.includes(prop)
//         );

//         if (containsAllRequired && !hasExtraProperties) {
//             setFeedback('Excelente! todos os critérios foram atentidos.');
//         } else if (containsAllRequired && hasExtraProperties) {
//             setFeedback('Quase lá! você adicionou propriedades extras.');
//         } else {
//             setFeedback('Revise o código. Alguns critérios não foram atendidos.');
//         }
//     };

//     if (!exercise) return <p>Carregando...</p>

//     return (
//         <main className="p-6">
//             <nav className="mb-6">
//                 <Link
//                     href="/"
//                     className='text-blue-500 hover:underline '
//                 >
//                     Voltar para a página inicial
//                 </Link>
//             </nav>

//             <h1 className="text-3xl font-bold mb-4">{exercise.title}</h1>
//             <p className="italic mb-4">{exercise.description}</p>
            
//                 <label htmlFor="code" className="block mb-2">
//                     Escreva seu código CSS:
//                 </label>
//                 <textarea
//                     id="code"
//                     value={code}
//                     className="border p-2 w-full mb-4 text-black"
//                     onChange={(e) => setCode(e.target.value)}
//                     rows="6"
//                     placeholder="Digite seu código CSS aqui..."
//                 />
//                 <button
//                     onClick={handleSubmitt}
//                     className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
//                 >
//                     Enviar
//                 </button>
            
//             {feedback && (
//                 <div className="mt-4 p-4 border rounded bg-gray-500 text-gray-800 text-lg">
//                     <strong className=" ">Feedback:</strong> {feedback}
//                 </div>
                
//             )}
//         </main>
//     )

// }
'use client';

import { useState, useEffect } from "react";
import Link from "next/link";

export default function ExercisePage() {
    const [exercise, setExercise] = useState(null);
    const [code, setCode] = useState('');
    const [feedback, setFeedback] = useState('');

    useEffect(() => {
        const id = localStorage.getItem('selectedExercise');
        if (id) {    
            const fetchExercise = async () => {
                const response = await fetch('/exercises.json');
                const data = await response.json();
                const selectedExercise = data.find((exercise) => exercise.id === parseInt(id));
                setExercise(selectedExercise);    
            };
            fetchExercise();
        };
    }, []);

    const handleSubmit = () => {
        if (!exercise) return;

        const cssRules = code.split('}').map(rule => rule.trim()).filter(rule => rule);
        let isValid = true;

        exercise.rules.selectors.forEach((selector, index) => {
            const cssRule = cssRules.find(rule => rule.startsWith(selector));
            if (!cssRule) {
                isValid = false;
                return;
            }

            const properties = cssRule.split('{')[1].trim().split(';').map(prop => prop.trim()).filter(prop => prop);
            exercise.rules.properties.forEach(property => {
                if (!properties.includes(property)) {
                    isValid = false;
                }
            });
        });

        if (isValid) {
            setFeedback('Excelente! Todos os critérios foram atendidos.');
        } else {
            setFeedback('Revise o código. Alguns critérios não foram atendidos.');
        }
    };

    if (!exercise) return <p>Carregando...</p>

    return (
        <main className="p-6">
            <nav className="mb-6">
                <Link href="/" className="text-blue-500 hover:underline">
                    Voltar para a página inicial
                </Link>
            </nav>

            <h1 className="text-3xl font-bold mb-4">{exercise.title}</h1>
            <p className="italic mb-4">{exercise.description}</p>
            
            <label htmlFor="code" className="block mb-2">
                Escreva seu código CSS:
            </label>
            <textarea
                id="code"
                value={code}
                className="border p-2 w-full mb-4 text-black"
                onChange={(e) => setCode(e.target.value)}
                rows="6"
                placeholder="Digite seu código CSS aqui..."
            />
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
        </main>
    );
}

