import { chatCompletion } from "./ai.ts";

export async function generateNewsIllustration(
  apiKey: string,
  titolo: string,
): Promise<string | null> {
  try {
    const imageResponse = await chatCompletion({
      apiKey,
      model: Deno.env.get("AI_IMAGE_MODEL") ?? "google/gemini-2.5-flash-image",
      messages: [{
        role: "user",
        content: `Generate a professional, modern illustration for a financial news article titled: "${titolo}". Style: flat design, blue and green color palette, no text in the image, clean and minimal, suitable as article thumbnail.`,
      }],
      extraBody: {
        modalities: ["image", "text"],
      },
    });

    if (!imageResponse.ok) {
      const errorText = await imageResponse.text();
      console.error("News image generation failed:", imageResponse.status, errorText);
      return null;
    }

    const imageData = await imageResponse.json();
    const imageUrl = imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    return typeof imageUrl === "string" && imageUrl.length > 0 ? imageUrl : null;
  } catch (error) {
    console.error("News image generation failed (non-blocking):", error);
    return null;
  }
}
