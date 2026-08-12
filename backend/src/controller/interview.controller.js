import { Interview } from "../models/interview.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { generateGeminiResponse } from "../utils/gemini.js";


const generateInterviewQuestions = asyncHandler(async (req, res) => {

    const {
        topic,
        difficulty,
        numberOfQuestions
    } = req.body;

    if (
        !topic?.trim() ||
        !difficulty ||
        !numberOfQuestions
    ) {
        throw new ApiError(
            400,
            "All fields are required"
        );
    }

    const questionCount = Number(numberOfQuestions);

    if (
        !Number.isInteger(questionCount) ||
        questionCount < 1 ||
        questionCount > 30
    ) {
        throw new ApiError(
            400,
            "Number of questions must be between 1 and 30"
        );
    }

    const prompt = `
You are an expert technical interviewer.

Generate ${questionCount} technical interview questions.

Topic: ${topic}

Difficulty: ${difficulty}

Rules:
1. Return ONLY valid JSON.
2. Do not return any explanation.
3. Do not use Markdown.
4. Generate exactly ${questionCount} questions.
5. Questions should be suitable for a technical interview.
6. Do not provide answers.

Return exactly this JSON format:

{
    "questions": [
        "Question 1",
        "Question 2",
        "Question 3"
    ]
}
`;

    const text = await generateGeminiResponse(prompt);

    let cleanedText = text
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

    let parsed;

    try {
        parsed = JSON.parse(cleanedText);
    } catch (error) {
        console.error(
            "Gemini returned invalid JSON:",
            cleanedText
        );

        throw new ApiError(
            500,
            "Gemini returned an invalid response"
        );
    }

    if (
        !parsed.questions ||
        !Array.isArray(parsed.questions) ||
        parsed.questions.length === 0
    ) {
        throw new ApiError(
            500,
            "Interview questions were not generated"
        );
    }

    const interview = await Interview.create({
        user: req.user._id,
        topic,
        difficulty,
        numberOfQuestions: questionCount,
        questions: parsed.questions,
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            interview,
            "Interview questions generated successfully"
        )
    );
});


const getInterviewHistory = asyncHandler(async (req, res) => {

    const history = await Interview
        .find({
            user: req.user._id
        })
        .sort({
            createdAt: -1
        });

    return res.status(200).json(
        new ApiResponse(
            200,
            history,
            "Interview history fetched successfully"
        )
    );
});


const deleteInterviewHistory = asyncHandler(async (req, res) => {

    const { interviewId } = req.params;

    const interview = await Interview.findById(
        interviewId
    );

    if (!interview) {
        throw new ApiError(
            404,
            "Interview record not found"
        );
    }

    if (
        interview.user.toString() !==
        req.user._id.toString()
    ) {
        throw new ApiError(
            403,
            "You are not authorized to delete this interview record"
        );
    }

    await Interview.findByIdAndDelete(
        interviewId
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Interview record deleted successfully"
        )
    );
});


export {
    generateInterviewQuestions,
    getInterviewHistory,
    deleteInterviewHistory,
};