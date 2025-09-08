export const apiProviders = {
    gemini: async (userInput, diagramType) => {
        const API_KEY = 'AIzaSyAT6IViDWeG9wH7oD4mTyrXdq4VvO4L0V4';        
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;
        const prompt = genDiagramPrompt(userInput, diagramType);    
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        if (!response.ok) {
            throw new Error('Lỗi không xác định');
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text.trim();
    }
};

function genDiagramPrompt(userInput, diagramType) {
  return JSON.stringify({
    task: "Generate diagram-as-code script from a user's natural language description.",
    context: { userInput, diagramType },
    instructions: {
      role: "Expert in creating diagram-as-code scripts for Mermaid, PlantUML, Graphviz, etc.",
      output_format: {
        type: "json",
        schema: { diagramCode: "string" },
        description: "Response MUST be a JSON with key 'diagramCode' containing the raw diagram script."
      },
      rules: [
        "Analyze context.userInput.",
        "Generate diagram using context.diagramType syntax.",
        "Script must be syntactically correct and renderable.",
        "Do NOT include explanations, comments, or code fences in diagramCode.",
        "Output strictly a JSON object with only 'diagramCode'."
      ],
      positive_example: {
        request: { userInput: "Create a simple flowchart with a start, a process, and an end node.", diagramType: "mermaid" },
        expected_response: { diagramCode: "graph TD\n    A[Start] --> B(Do Process)\n    B --> C{End}" }
      }
    }
  }, null, 2);
}
