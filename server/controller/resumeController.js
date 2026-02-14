import imagekit from "../config/imageKit.js";
import Resume from "../models/Resume.js";
import fs from "fs";


// Create a resume : Post /api/resumes/create
export const createResume = async (req, res) => {
  try {
    const userId = req.userId;
    const {title} = req.body;

    const newResume = await Resume.create({userId,title});

    res.status(201).json({ message: "Resume created successfully", resume: newResume });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// Delete a resume : Delete /api/resumes/delete/:resumeId
export const deleteResume = async (req, res) => {
    try {
        const userId = req.userId;
        const { resumeId } = req.params;

        const resume = await Resume.findOneAndDelete({ userId, _id: resumeId });

        res.status(200).json({ message: "Resume deleted successfully" }); 
    } catch (error) {
        res.status(500).json({ message: error.message || "Server error" });
    }
};

// Get all resumes of a user : Get:  /api/resumes/get
export const getResumesById = async (req, res) => {
    try {
        const userId = req.userId;
        const {resumeId} = req.params;
        const resume = await Resume.findOne({userId, _id: resumeId });
        if (!resume) {
            return res.status(404).json({ message: "Resume not found" });
        }
        resume.__v=undefined; //remove version key from response
        resume.createdAt=undefined; //remove createdAt key from response
        resume.updatedAt=undefined; //remove updatedAt key from response
        res.status(200).json({resume});
    } catch (error) {
        res.status(500).json({ message: error.message || "Server error" });
    }
};

// Get resume by id public : Get /api/resumes/public
export const getPublicResumeById = async (req, res) => {
    try {
        const { resumeId } = req.params;
        const resume = await Resume.findOne({_id: resumeId,public: true});
        if (!resume) {
            return res.status(404).json({ message: "Resume not found" });
        }
        res.status(200).json({ resume });
    } catch (error) {
        res.status(500).json({ message: error.message || "Server error" });
    }
};

// Update a resume : Put /api/resumes/update
export const updateResume = async (req, res) => {
    try {
        const userId = req.userId;
        const { resumeId,resumeData,removeBackground } = req.body;
        const image = req.file;

        let resumeDataCopy;
        if(typeof resumeData === "string"){
            resumeDataCopy = JSON.parse(resumeData);
        }
        else{
            resumeDataCopy = structuredClone(resumeData);
        }   

        if(image) {
            const imageBufferdData = fs.createReadStream(image.path);

            const response = await imagekit.files.upload({
            file: imageBufferdData,
            fileName: "resume.png",
            folder: "user-resumes",
            transformation:{
                    pre:'w-300,h-300,fo-face,z-0.75'+(removeBackground ? ',e-bgremove' : '')
                }
            });
            resumeDataCopy.personal_info.image=response.url;     
            fs.unlinkSync(image.path); //remove file from server after upload
        }
        
        const resume = await Resume.findOneAndUpdate({userId, _id: resumeId },resumeDataCopy, { new: true });

        res.status(200).json({ message: "Resume updated successfully", resume });
    } catch (error) {
        res.status(500).json({ message: error.message || "Server error" });
    }
};


// Get all public resumes + user's own resumes
export const getDashboardResumes = async (req, res) => {
  try {
    const userId = req.userId;

    const userResumes = await Resume.find({ userId })
      .sort({ updatedAt: -1 });

    const publicResumes = await Resume.find({
      public: true,
      userId: { $ne: userId } // exclude own resumes
    }).sort({ updatedAt: -1 });

    res.status(200).json({ userResumes, publicResumes });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};
