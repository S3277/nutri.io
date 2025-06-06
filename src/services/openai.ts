import { AnalysisResult } from '../types';
import OpenAI from 'openai';

export const analyzeImageWithOpenAI = async (imageBase64: string): Promise<AnalysisResult> => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OpenAI API key is not configured');
  }

  const openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true // Note: In production, you should proxy this through your backend
  });

  try {
    // Remove the data URL prefix to get just the base64 data
    const base64Image = imageBase64.split(',')[1];
    
    const response = await openai.chat.completions.create({
      model: "gpt-4.1",
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
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    // First, try to parse the content directly
    try {
      const parsedData = JSON.parse(content.trim());
      if (isValidNutritionData(parsedData)) {
        return parsedData;
      }
    } catch (e) {
      // If direct parsing fails, try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const extractedData = JSON.parse(jsonMatch[0]);
          if (isValidNutritionData(extractedData)) {
            return extractedData;
          }
        } catch (e) {
          // If both attempts fail, throw an error
          console.error('Failed to parse OpenAI response:', content);
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