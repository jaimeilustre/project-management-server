const router = require("express").Router();
const mongoose = require("mongoose");

const Project = require('../models/Project.model');


//  POST /api/projects  -  Creates a new project
router.post('/projects', (req, res, next) => {
    const { title, description } = req.body;

    Project.create({ title, description, tasks: [] })
        .then(response => res.status(201).json(response))
        .catch(err => {
            console.log("Error creating project...", err);
            res.status(500).json({ message: "Error creating project..." });
        });
});



// GET /api/projects -  Retrieves all of the projects
router.get('/projects', (req, res, next) => {
    Project.find()
        .populate("tasks")
        .then((projectsArr) => {
            res.json(projectsArr);
        })
        .catch(err => {
            console.log("Error getting projects...", err);
            res.status(500).json({ message: "Error getting projects..." });
        });
});




// GET /api/projects/:projectId -  Retrieves a specific project by id
router.get('/projects/:projectId', (req, res, next) => {
    const { projectId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }

    // Each Project document has a `tasks` array holding `_id`s of Task documents
    // We use .populate() method to get swap the `_id`s for the actual Task documents
    Project.findById(projectId)
        .populate('tasks')
        .then(project => res.status(200).json(project))
        .catch(err => {
            console.log("Error getting project details...", err);
            res.status(500).json({ message: "Error getting project details..." });
        });
});



// PUT  /api/projects/:projectId  -  Updates a specific project by id
router.put('/projects/:projectId', (req, res, next) => {
    const { projectId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }

    Project.findByIdAndUpdate(projectId, req.body, { new: true })
        .then(updatedProject => res.json(updatedProject))
        .catch(err => {
            console.log("Error updating project...", err);
            res.status(500).json({ message: "Error updating project..." });
        });
});




// DELETE  /api/projects/:projectId  -  Deletes a specific project by id
router.delete('/projects/:projectId', (req, res, next) => {
    const { projectId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }

    Project.findByIdAndDelete(projectId)
        .then(() => res.json({ message: `Project with ${projectId} is removed successfully.` }))
        .catch(err => {
            console.log("Error deleting project...", err);
            res.status(500).json({ message: "Error deleting project..." });
        });
});



module.exports = router;
