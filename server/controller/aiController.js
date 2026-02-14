import ai from "../config/ai.js";
import Resume from "../models/Resume.js";

// enhance a professional summary using AI : 
// Post: /api/ai/enhance-pro-sum
export const enhanceProfessionalSummary = async (req, res) => {
    try {
        const { userContent } = req.body;
        if (!userContent) {
            return res.status(400).json({ message: "Please provide a professional summary to enhance" });
        }
        
        const response = await ai.chat.completions.create({
            model: process.env.MODEL_NAME,
            messages:[
                {
                    role:"system",
                    content:"You are a expert in resume writing. Your task is to enhance the professional summary of a resume. The summary should be 1-2 sentences also highlighting key skills, experience and career objectives. Make it compelling and ATS friendly . and only return text no options or anything else."
                },
                {
                    role:"user",
                    content:userContent
                },
            ]
            });

        const enhancedSummary = response.choices[0].message.content.trim();
        res.status(200).json({ enhancedSummary });
    } catch (error) {
        res.status(500).json({ message: error.message || "Server error" });
    }
};

// enhance a job description 
// Post: /api/ai/enhance-job-desc
export const enhanceJobDescription = async (req, res) => {
    try {
        const { userContent } = req.body;

        if (!userContent) {
            return res.status(400).json({ message: "Please provide a job description to enhance" });
        }
        
        const response = await ai.chat.completions.create({
            model: process.env.MODEL_NAME,
            messages:[
                {
                    role:"system",
                    content:"You are a expert in resume writing. Your task is to enhance the job description of a resume. The description should be 1-2 sentences also highlighting key skills, experience and career objectives. Make it compelling and ATS friendly . and only return text no options or anything else."
                },
                {
                    role:"user",
                    content:userContent
                },
            ]
        });

        const enhancedJobDesc = response.choices[0].message.content.trim();
        res.status(200).json({ enhancedJobDesc });
    } catch (error) {
        res.status(500).json({ message: error.message || "Server error" });
    }
};

// upload resume to database
// POST: /api/ai/upload-resume
export const uploadResume = async (req, res) => {
    try {
        const userId = req.userId;
        const { title, resumeText } = req.body;

        if (!title || !resumeText) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        const systemPrompt = "You are a expert in resume writing. Your task is to enhance the resume. The enhanced version should be ATS friendly and should highlight key skills, experience and career objectives. Return only the enhanced resume text without any explanations or options.";
        const userPrompt = `Extract data from this resume:${resumeText} 
        Provide the response in JSON format with no additional text before or after the JSON.
        {
  professional_summary: { 
        type: String, 
        default: "" 
    },
    skills: [{ type: String }],
    personal_info: {
      image: { type: String, default: "" },
      full_name: { type: String, default: "" },
      profession: { type: String, default: "" },
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
      location: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      website: { type: String, default: "" },
    },
    experience: [
      {
        company: { type: String },
        position: { type: String },
        start_date: { type: String },
        end_date: { type: String },
        description: { type: String },
        is_current: { type: Boolean },
      },
    ],
    project: [
      {
        name: { type: String },
        type: { type: String },
        description: { type: String },
      },
    ],
    education: [
      {
        institution: { type: String },
        degree: { type: String },
        field: { type: String },
        graduation_date: { type: String },
        gpa: { type: String },
      },
    ],
}
        `;
       
        const response = await ai.chat.completions.create({
            model: process.env.MODEL_NAME,
            messages:[
                {
                    role:"system",
                    content: systemPrompt,
                },
                {
                    role:"user",
                    content: userPrompt,
                },
            ],
            response_format:{
                type:'json_object',
            }
        });

        const enhancedResumeText = response.choices[0].message.content.trim();
        const resumeContent = JSON.parse(enhancedResumeText);
        const newResume = await Resume.create({userId, title, ...resumeContent });

        res.status(201).json({ message: "Resume uploaded successfully", resumeId: newResume._id });
    } catch (error) {
        res.status(500).json({ message: error.message || "Server error" });
    }
};

