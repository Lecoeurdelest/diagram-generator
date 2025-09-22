import axios from 'axios';

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
    const apiKey = localStorage.getItem('apiKey') || 'YOUR-API-KEY';
    let model = localStorage.getItem('model');
    if (!model || model === 'undefined' || model === 'null') {
      model = 'gemini-1.5-flash-latest';
      localStorage.setItem('model', model);
    }
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const prompt = genDiagramPrompt(userInput, diagramType);

    try {
      const response = await axios.post(apiUrl, {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.2,
        }
      });

      const data = response.data;
      const textResponse = data.candidates[0].content.parts[0].text;
      const parsedData = JSON.parse(textResponse);
      if (typeof parsedData.diagramCode !== 'string') {
        throw new Error("Key 'diagramCode' does not exist or is not a string.");
      }
      return parsedData.diagramCode.trim();
    } catch (error) {
      if (error.response) {
        throw new Error(`Error from Gemini API: ${error.response.data.error.message}`);
      }
      throw new Error("Gemini returned data in an incorrect JSON format.");
    }
  },
  openai: async (userInput, diagramType, model) => {
    const apiKey = localStorage.getItem('apiKey') || 'YOUR-API-KEY';
    const apiUrl = `https://api.openai.com/v1/chat/completions`;
    const prompt = genDiagramPrompt(userInput, diagramType);

    try {
      const response = await axios.post(apiUrl, {
        model: model,
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        temperature: 0.2
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      });

      const data = response.data;
      const textResponse = data.choices[0].message.content;
      const parsedData = JSON.parse(textResponse);
      if (typeof parsedData.diagramCode !== 'string') {
        throw new Error("Key 'diagramCode' does not exist or is not a string.");
      }
      return parsedData.diagramCode.trim();
    } catch (error) {
      if (error.response) {
        throw new Error(`Error from Open AI API: ${error.response.data.error.message}`);
      }
      throw new Error("Open AI returned data in an incorrect JSON format.");
    }
  }
};