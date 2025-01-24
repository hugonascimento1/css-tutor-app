export const fetchGeminiFeedback = async (inputText) => {
  try {
      const response = await fetch(
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyCHmjREXS-VtPUZcg0MUb0aFIK904yFwUQ",
          {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                  contents: [
                      {
                          parts: [
                              {
                                  text: inputText, // Texto que você deseja enviar para a API
                              },
                          ],
                      },
                  ],
              }),
          }
      );

      if (!response.ok) {
          const errorText = await response.text(); // Obtém detalhes do erro para depuração
          console.error("Erro da API:", errorText);
          throw new Error(`Erro da API Gemini: ${errorText}`);
      }

      const data = await response.json();

      console.log("Resposta da API Gemini (original):", data);

      // Extrair o texto do primeiro candidato
      if (data?.candidates?.length > 0 && data.candidates[0]?.content?.parts?.length > 0) {
          return data.candidates[0].content.parts.map(part => part.text).join(' '); // Concatenar texto das partes
      } else {
          console.error("Resposta inesperada da API Gemini (detalhada):", data);
          throw new Error("Resposta inesperada da API Gemini.");
      }
  } catch (error) {
      console.error("Erro ao usar a API Gemini:", error.message);
      throw error;
  }
};
