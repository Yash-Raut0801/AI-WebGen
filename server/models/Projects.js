import mongoose from "mongoose";

const FileSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    content: {
        type: String,
        required: true
    }

});

const ProjectSchema = new mongoose.Schema({

    prompt: {
        type: String,
        required: true
    },

    files: [FileSchema],

    createdAt: {
        type: Date,
        default: Date.now
    }

});

const Project = mongoose.model("Project", ProjectSchema);

export default Project;