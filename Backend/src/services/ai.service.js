const config = require("../config/config");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(config.GEMINI_AI_KEY);

const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: `
        Guidelines for Caption Generation:
        - Detect objects, people, scenery, or events in the image.
        - Recognize emotions, activities, and themes (e.g., travel, fashion, food, fitness).
        - Match the caption’s tone with the image’s mood.
        - Keep captions **under 2 lines** and **engaging**.
        - Use emojis & hashtags sparingly for impact.
        - Output **only one** caption.

        Example Outputs:
        - Beach Scene: "Lost in the waves, found in the moment. 🌊💙 #BeachVibes"
        - Gym Selfie: "Sweat now, shine later. 💪🔥 #NoExcuses"
    `,
});

/**
 * Generate caption from a text prompt
 */
const generateCaption = async (prompt) => {
    try {
        if (!prompt) throw new Error("Prompt is required.");

        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error("Error generating caption:", error);
        return "No caption available."; // Fallback caption
    }
};

/**
 * Generate caption from an image buffer
 */
const generateCaptionFromImageBuffer = async (imageBuffer, mimeType = "image/jpeg") => {
    try {
        if (!imageBuffer) throw new Error("Image buffer is required.");

        const result = await model.generateContent([
            {
                inlineData: {
                    mimeType,
                    data: imageBuffer.toString("base64"), // Convert to Base64
                },
            },
        ]);

        return result.response.text();
    } catch (error) {
        console.error("Error generating caption from image:", error);
        return "No caption available."; // Fallback caption
    }
};

module.exports = { generateCaption, generateCaptionFromImageBuffer };
