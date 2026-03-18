import { HfInference } from "@huggingface/inference";



// Replace with your actual token (use an .env file for security!)

const hf = new HfInference(process.env.REACT_APP_HF_TOKEN);



export const interpretDream = async (dreamText) => {

  try {

    const result = await hf.textGeneration({

      model: "mistralai/Mistral-7B-Instruct-v0.2", // A very capable free model

      inputs: `Analyze this dream and give a short 2-sentence interpretation: ${dreamText}`,

      parameters: { max_new_tokens: 100 },

    });

    

    return result.generated_text;

  } catch (error) {

    console.error("AI Error:", error);

    return "The stars are blurry right now. Try again later.";

  }

};