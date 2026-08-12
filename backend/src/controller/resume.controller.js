import fs from "fs";
import { Resume } from "../models/resume.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../../cloudinary.js";
import { extractPdfText } from "../utils/pdfParse.js";
import { analyzeResumeWithGemini } from "../utils/gemini.js";


const analyzeResume= asyncHandler(async(req , res)=>{
    if(!req.file){
        throw new ApiError(400,"Resume file is required");
    }

    const localFilePath = req.file.path;
    try{

        const resumeText = await extractPdfText(localFilePath);

        if(!resumeText || resumeText.trim()===""){
            throw new ApiError(400,"Unable to extract text from resume");
        }
        const uploadedResume = await uploadOnCloudinary(localFilePath);

        if(!uploadedResume){
            throw new ApiError(500,"Failed to upload resume");
        }

        

        const analysis  = await analyzeResumeWithGemini(resumeText);

        if(!analysis){
            throw new ApiError(500,"Failed to analyze resume");
        }

        const resume = await Resume.create({
            user: req.user._id,
            resumeName: req.file.originalname,
            resumeUrl: uploadedResume.secure_url,
            publicId: uploadedResume.public_id || uploadedResume.publicId || "",
            atsScore:analysis.atsScore,
            strengths: analysis.strengths,
            weaknesses: analysis.weaknesses,
            suggestions: analysis.suggestions,
        });

        return res.status(201).json(
            new ApiResponse(
                201,
                resume,
                "Resume analyzed successfully"
            )
        );
    }catch(error){
        if(fs.existsSync(localFilePath)){
            fs.unlinkSync(localFilePath);
        }
        throw new ApiError(
            error.statusCode || 500,
            error.message || "Resume analysis failed"
        );
    }
});

const getUserResumes = asyncHandler(async(req , res)=>{
    const resumes = await Resume.find({
        user: req.user._id,
    }).sort({
        createdAt:-1,
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            resumes,
            "Resume history fetched successfully"
        )
    );
});

const getResumeById = asyncHandler(async(req , res)=>{
    const { resumeId} = req.params;
    const resume = await Resume.findById(resumeId);

    if(!resume){
        throw new ApiError(404, "Resume not found");
    }

    if(resume.user.toString()!== req.user._id.toString()){
        throw new ApiError(403,"you are not  authorized to access this resume");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            resume,
            "Resume fetched successfully"
        )
    );
});

const deleteResume = asyncHandler(async(req , res)=>{
    const { resumeId} = req.params;

    const resume = await Resume.findById(resumeId);

    if(!resume){
        throw new ApiError(404, "Resume not found");
    }

    if(resume.user.toString()!==req.user._id.toString()){
        throw new ApiError(403,"you are not authrorized to delete this resume");
    }

    await deleteFromCloudinary(resume.publicId);

    await Resume.findByIdAndDelete(resumeId);

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Resume deleted successfully"
        )
    );
});

export { 
    analyzeResume,
    getUserResumes,
    getResumeById,
    deleteResume,
}
