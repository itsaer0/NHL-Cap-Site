const express = require('express');
const router = express.Router();
const { Team } = require('../modules/nhlStats.js'); // Import your data/model logic

// Route to get all teams
router.get('/teams', async (req, res) => {
    try {
        const teams = await Team.find({}); // Fetch data from your database
        res.json(teams); // Send data as JSON response
    } catch (err) {
        res.status(500).json({ message: 'Error getting teams.' }); // Handle errors
    }
});

module.exports = router; // Export the router to be used in your main server file
