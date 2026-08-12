import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});


// ======================================================
// General Gemini Function
// Used by:
// 1. Interview Controller
// 2. Concept Controller
// ======================================================

const generateGeminiResponse = async (prompt) => {

    try {

        const response = await genAI.models.generateContent({
            model: "gemini-3.6-flash",
            contents: prompt,
        });

        const text = response.text?.trim();

        if (!text) {
            throw new Error(
                "Gemini returned an empty response"
            );
        }

        console.log("Gemini response received");

        return text;

    } catch (error) {

        console.error(
            "Gemini API Error:",
            error?.message || error
        );

        throw new Error(
            "Gemini request failed"
        );
    }
};


// ======================================================
// Resume Analyzer
// Used by:
// Resume Controller
// ======================================================

const analyzeResumeWithGemini = async (resumeText) => {

    try {

        if (!resumeText || !resumeText.trim()) {
            throw new Error(
                "Resume text is empty"
            );
        }

        const prompt = `
You are an expert ATS Resume Analyzer.

Analyze the following resume carefully.

Return ONLY valid JSON.

Use exactly this format:

{
    "atsScore": 0,
    "strengths": [
        "",
        "",
        ""
    ],
    "weaknesses": [
        "",
        "",
        ""
    ],
    "suggestions": [
        "",
        "",
        ""
    ]
}

Rules:

1. atsScore must be a number between 0 and 100.
2. Give exactly 3 strengths.
3. Give exactly 3 weaknesses.
4. Give exactly 3 suggestions.
5. Do not use Markdown.
6. Do not wrap JSON inside code fences.
7. Do not provide any explanation.
8. The response must be valid JSON.
9. Do not add any fields other than atsScore, strengths, weaknesses and suggestions.

Resume:

${resumeText}
`;

        const response = await genAI.models.generateContent({

            model: "gemini-3.6-flash",

            contents: prompt,

            config: {
                responseMimeType: "application/json",
            },
        });

        let text = response.text?.trim();

        if (!text) {
            throw new Error(
                "Gemini returned an empty resume analysis"
            );
        }

        // Remove markdown fences if Gemini somehow returns them
        text = text
            .replace(/^```json\s*/i, "")
            .replace(/^```\s*/i, "")
            .replace(/\s*```$/i, "")
            .trim();

        const analysis = JSON.parse(text);


        // ==================================================
        // Validate Gemini response
        // ==================================================

        if (
            typeof analysis.atsScore !== "number" ||
            analysis.atsScore < 0 ||
            analysis.atsScore > 100
        ) {
            throw new Error(
                "Invalid ATS score returned by Gemini"
            );
        }


        if (
            !Array.isArray(analysis.strengths) ||
            analysis.strengths.length !== 3
        ) {
            throw new Error(
                "Invalid strengths returned by Gemini"
            );
        }


        if (
            !Array.isArray(analysis.weaknesses) ||
            analysis.weaknesses.length !== 3
        ) {
            throw new Error(
                "Invalid weaknesses returned by Gemini"
            );
        }


        if (
            !Array.isArray(analysis.suggestions) ||
            analysis.suggestions.length !== 3
        ) {
            throw new Error(
                "Invalid suggestions returned by Gemini"
            );
        }


        console.log(
            "Resume analysis generated successfully"
        );

        console.log(
            "ATS Score:",
            analysis.atsScore
        );


        return analysis;

    } catch (error) {

        console.error(
            "Gemini Resume Analysis Error:",
            error?.message || error
        );

        throw new Error(
            error?.message ||
            "Gemini Resume Analysis Failed"
        );
    }
};


export {
    generateGeminiResponse,
    analyzeResumeWithGemini,
};