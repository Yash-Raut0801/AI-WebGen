import { generateWebsite } from "../services/geminiService.js";
import { parseFiles } from "../utils/parseFiles.js";
// import fs from "fs-extra";
// import path from "path";
import Project from "../models/Projects.js";

export const generateWebsiteController = async (req, res) => {

    try {

        const { prompt } = req.body;

        const aiOutput = await generateWebsite(prompt);

        const files = parseFiles(aiOutput);
        if (!files || files.length === 0) {
            throw new Error("AI failed to generate valid files");
        }

        // if (files.length === 0) {
        //     throw new Error("AI returned no files");
        // }

        if (files.length > 15) {
            throw new Error("Too many files generated");
        }
        const savedProject = await Project.create({
            prompt,
            files
        });

        const projectId = savedProject._id;

        // const projectPath = `projects/project-${projectId}`;

        // await fs.ensureDir(projectPath);

        // for (const file of files) {

        //     const filePath = path.join(projectPath, file.name);

        //     await fs.ensureDir(path.dirname(filePath));

        //     await fs.writeFile(filePath, file.content);

        // }
        console.log("AI OUTPUT:", aiOutput);
        console.log("PARSED FILES:", files);
        console.log("FILES PARSED:", files.length);


        res.json({
            success: true,
            projectId,
            files
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};