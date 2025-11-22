import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-1234', // Fallback for build time, but should be set in env
  baseURL: process.env.OPENAI_BASE_URL,
});

export async function generateImage(prompt: string): Promise<string | null> {
  try {
    console.log("Generating image with prompt:", prompt);
    const response = await openai.images.generate({
      model: "azure/gpt-image-1",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    });

    const image = response.data?.[0];
    
    if (!image) {
      return null;
    }

    if (image.b64_json) {
      return `data:image/png;base64,${image.b64_json}`;
    } else if (image.url) {
      return image.url;
    }
    
    return null;
  } catch (error) {
    console.error("Error generating image:", error);
    return null;
  }
}
