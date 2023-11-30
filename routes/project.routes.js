const router = require("express").Router();
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



module.exports = router;
