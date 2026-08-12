import { ConceptHistory } from "../models/conceptHistory.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { generateGeminiResponse } from "../utils/gemini.js";


const askConceptQuestion = asyncHandler(async (req, res) => {

    const { question } = req.body;

    if (!question || question.trim() === "") {
        throw new ApiError(
            400,
            "Question is required"
        );
    }

    const prompt = `
You are an experienced technical mentor.

Explain the following concept in a simple and beginner-friendly way.

Question:
${question}

Instructions:
- Use simple English.
- Explain step by step.
- If suitable, include a small example.
- Keep the answer concise but complete.
- Make the explanation easy for a beginner to understand.
`;

    let answer;

    try {

        answer = await generateGeminiResponse(prompt);

    } catch (error) {

        console.error(
            "Gemini Concept Error:",
            error
        );

        throw new ApiError(
            502,
            "Failed to generate explanation from Gemini"
        );
    }

    if (!answer || answer.trim() === "") {
        throw new ApiError(
            500,
            "Gemini returned an empty response"
        );
    }

    const concept = await ConceptHistory.create({
        user: req.user._id,
        question: question.trim(),
        answer: answer.trim(),
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            concept,
            "Answer generated successfully"
        )
    );
});


const getConceptHistory = asyncHandler(async (req, res) => {

    const history = await ConceptHistory
        .find({
            user: req.user._id,
        })
        .sort({
            createdAt: -1,
        });

    return res.status(200).json(
        new ApiResponse(
            200,
            history,
            "Concept history fetched successfully"
        )
    );
});


const deleteConceptHistory = asyncHandler(async (req, res) => {

    const { conceptId } = req.params;

    const concept = await ConceptHistory.findById(
        conceptId
    );

    if (!concept) {
        throw new ApiError(
            404,
            "Concept history not found"
        );
    }

    // Check ownership
    if (
        concept.user.toString() !==
        req.user._id.toString()
    ) {
        throw new ApiError(
            403,
            "You are not authorized to delete this record"
        );
    }

    await ConceptHistory.findByIdAndDelete(
        conceptId
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Concept history deleted successfully"
        )
    );
});


export {
    askConceptQuestion,
    getConceptHistory,
    deleteConceptHistory,
};