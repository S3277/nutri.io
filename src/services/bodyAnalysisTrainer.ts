import OpenAI from 'openai';
import { BodyAnalysis } from '../types';

export const analyzeBodyWithOpenAI = async (
  imageBase64: string,
  userData: {
    height: number;
    weight: number;
    age: number;
    gender: string;
    activityLevel: number;
    goal: string;
  }
): Promise<BodyAnalysis> => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OpenAI API key is not configured');
  }

  const openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true
  });

  try {
    const base64Image = imageBase64.split(',')[1];
    
    const systemPrompt = `You are a professional fitness trainer and nutritionist. Analyze the full-body photo and provided metrics to give a comprehensive fitness assessment and personalized recommendations. Consider:

1. Body composition and structure
2. Visible muscle development
3. Overall body proportions
4. Potential areas for improvement
5. Suitable workout types based on body structure
6. Nutritional needs based on body type and goals

IMPORTANT: For exercise recommendations, ALWAYS provide rep ranges as strings (e.g., "8-12" not 8-12).

Provide analysis in the following JSON format ONLY:
{
  "bodyComposition": {
    "bodyFatPercentage": number,
    "muscleMass": string,
    "bodyType": string
  },
  "recommendations": {
    "workout": {
      "type": string,
      "frequency": number,
      "exercises": [
        {
          "name": string,
          "sets": number,
          "reps": string
        }
      ]
    },
    "nutrition": {
      "dailyCalories": number,
      "macroSplit": {
        "protein": number,
        "carbs": number,
        "fat": number
      },
      "mealTiming": string[]
    }
  },
  "areas": {
    "strengths": string[],
    "improvements": string[]
  }
}

CRITICAL: Exercise rep ranges MUST be strings like "8-12", not numbers or ranges like 8-12.`;

    const userPrompt = `Analyze this person's physique with these metrics:
- Height: ${userData.height}cm
- Weight: ${userData.weight}kg
- Age: ${userData.age}
- Gender: ${userData.gender}
- Activity Level: ${userData.activityLevel} days/week
- Goal: ${userData.goal}

Provide a detailed analysis and recommendations in the specified JSON format. Remember to provide rep ranges as strings (e.g., "8-12").`;

    const response = await openai.chat.completions.create({
      model: "gpt-4.1",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: [
            { type: "text", text: userPrompt },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      max_tokens: 1000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    // First try to parse the content directly
    try {
      const parsedData = JSON.parse(content.trim());
      if (isValidBodyAnalysis(parsedData)) {
        return parsedData;
      }
    } catch (e) {
      // If direct parsing fails, try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const extractedData = JSON.parse(jsonMatch[0]);
          if (isValidBodyAnalysis(extractedData)) {
            return extractedData;
          }
        } catch (e) {
          console.error('Failed to parse OpenAI response:', content);
          throw new Error('Invalid response format from OpenAI');
        }
      }
    }

    throw new Error('Invalid response format from OpenAI');
  } catch (error) {
    console.error('Error analyzing body with OpenAI:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to analyze image: ${error.message}`);
    }
    throw new Error('Failed to analyze image. Please try again.');
  }
};

function isValidBodyAnalysis(data: any): data is BodyAnalysis {
  try {
    // Basic structure check
    if (
      typeof data !== 'object' ||
      data === null ||
      typeof data.bodyComposition !== 'object' ||
      typeof data.recommendations !== 'object' ||
      typeof data.areas !== 'object'
    ) {
      return false;
    }

    // Check bodyComposition
    const { bodyComposition } = data;
    if (
      typeof bodyComposition.bodyFatPercentage !== 'number' ||
      typeof bodyComposition.muscleMass !== 'string' ||
      typeof bodyComposition.bodyType !== 'string'
    ) {
      return false;
    }

    // Check recommendations
    const { recommendations } = data;
    if (
      typeof recommendations.workout !== 'object' ||
      typeof recommendations.nutrition !== 'object' ||
      !Array.isArray(recommendations.workout.exercises)
    ) {
      return false;
    }

    // Check exercises
    for (const exercise of recommendations.workout.exercises) {
      if (
        typeof exercise !== 'object' ||
        typeof exercise.name !== 'string' ||
        typeof exercise.sets !== 'number' ||
        typeof exercise.reps !== 'string'
      ) {
        return false;
      }
    }

    // Check nutrition
    const { nutrition } = recommendations;
    if (
      typeof nutrition.dailyCalories !== 'number' ||
      typeof nutrition.macroSplit !== 'object' ||
      !Array.isArray(nutrition.mealTiming)
    ) {
      return false;
    }

    // Check areas
    if (!Array.isArray(data.areas.strengths) || !Array.isArray(data.areas.improvements)) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
}