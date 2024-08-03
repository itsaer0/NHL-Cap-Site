const express = require('express'); // "require" the Express module
const router = express.Router(); // create a new router object

router.get('/profile', (req, res) => { // set the route for the profile page
    res.send('This is the profile page'); // send a response
});

module.exports = router; // export the router object