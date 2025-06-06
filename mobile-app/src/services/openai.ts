import { AnalysisResult } from '../types';

export const analyzeImageWithOpenAI = async (imageBase64: string): Promise<AnalysisResult> => {
  // IMPORTANT: Replace with your actual OpenAI API key
  const apiKey = 'your-openai-api-key';
  
  if (!apiKey || apiKey === 'your-openai-api-key') {
    throw new Error('OpenAI API key is not configured');
  }

  try {
    const base64Image = imageBase64.split(',')[1];
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4-vision-preview",
        messages: [
          {
            role: "system",
            content: `You are a nutrition expert. Analyze the food image and provide nutritional information.
              RESPOND ONLY WITH A VALID JSON OBJECT in this exact format:
              {
                "name": "Food name",
                "calories": number,
                "protein": number,
                "carbs": number,
                "fat": number
              }
              DO NOT include any other text, markdown, or formatting.`
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "What food is in this image? Provide nutritional information in JSON format."
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`
                }
              }
            ]
          }
        ],
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to analyze image');
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    try {
      const parsedData = JSON.parse(content.trim());
      if (isValidNutritionData(parsedData)) {
        return parsedData;
      }
    } catch (e) {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const extractedData = JSON.parse(jsonMatch[0]);
          if (isValidNutritionData(extractedData)) {
            return extractedData;
          }
        } catch (e) {
          throw new Error('Invalid response format from OpenAI');
        }
      }
    }

    throw new Error('Invalid response format from OpenAI');
  } catch (error) {
    console.error('Error analyzing image with OpenAI:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to analyze image: ${error.message}`);
    }
    throw new Error('Failed to analyze image. Please try again.');
  }
};

function isValidNutritionData(data: any): data is AnalysisResult {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.name === 'string' &&
    typeof data.calories === 'number' &&
    typeof data.protein === 'number' &&
    typeof data.carbs === 'number' &&
    typeof data.fat === 'number'
  );
}