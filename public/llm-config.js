const genDiagramPrompt = (userInput, diagramType) => {
  return JSON.stringify({
    task: "Generate diagram-as-code script from a user's natural language description.",
    context: { userInput, diagramType },
    instructions: {
      role: "Expert in creating diagram-as-code scripts for Mermaid, PlantUML, Graphviz, etc.",
      output_format: {
        type: "json",
        schema: { diagramCode: "string" },
        description: "Response MUST be a JSON object with a single key 'diagramCode' containing the raw diagram script as a string."
      },
      rules: [
        "Analyze the user's input from the context.",
        "Generate a complete and syntactically correct diagram script using the specified diagramType syntax.",
        "The value of 'diagramCode' must NOT contain any explanations, comments, or markdown code fences (like ```mermaid). It must only be the pure, renderable diagram code.",
        "The final output must be ONLY the JSON object, nothing else before or after."
      ],
      positive_example: {
        request: { userInput: "Create a simple flowchart with a start, a process, and an end node.", diagramType: "mermaid" },
        expected_response: { diagramCode: "graph TD\n    A[Start] --> B(Do Process)\n    B --> C{End}" }
      }
    }
  }, null, 2);
}

export const apiProviders = {
    gemini: async (userInput, diagramType) => {
        const API_KEY = 'AIzaSyC3AJCBcHCWgFMZZsoEXFLmZvHQyTbTMqw';

        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;
        const prompt = genDiagramPrompt(userInput, diagramType);

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    responseMimeType: "application/json",
                    temperature: 0.2,
                }
            })
        });

        if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(`Lỗi từ API Server: ${errorBody.error.message}`);
        }

        const data = await response.json();

        try {
            const textResponse = data.candidates[0].content.parts[0].text;
            const parsedData = JSON.parse(textResponse);
            
            if (typeof parsedData.diagramCode !== 'string') {
                 throw new Error("Key 'diagramCode' không tồn tại hoặc không phải là chuỗi.");
            }
            
            return parsedData.diagramCode.trim();
        } catch (e) {
            throw new Error("Gemini đã trả về dữ liệu không đúng định dạng JSON mong muốn.");
        }
    }
};