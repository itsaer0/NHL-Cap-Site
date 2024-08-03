const express = require('express'); // "require" the Express module
const bodyParser = require('body-parser'); // "require" the body-parser module
const nhlData = require('./modules/nhlStats'); // "require" the playerStats module
const userRoutes = require('./routes/user'); // "require" the userRoutes module
const teamsRouter = require('./routes/teams'); // "require" the teamsRouter module
//require('pg'); // "require" the pg module
//const Sequelize = require('sequelize'); // "require" the sequelize module
const app = express(); // obtain the "app" object
const HTTP_PORT = process.env.PORT || 8080; // assign a port
app.set('view engine', 'ejs'); // set the view engine
app.use(express.static(__dirname + '/public')); // set the static folder
app.use(bodyParser.json()); // enable JSON bodies
app.use(express.urlencoded({extended: true})); // enable URL-encoded bodies
app.set('views', __dirname + '/views'); // set the views folder

nhlData.initializeDB().then(() => { // initialize the playerStats module

    app.get('/', async (req, res) => { // set the route for the home page
        try {
            const teams = await nhlData.getAllTeams(); // get all the teams
            res.render('home', { teams }); // render the home page
        } catch (err) { // if an error occurs
            res.status(404).render('404', {message: 'Error getting teams.'}); // render the 404 page
        }
    });

    app.get('/about', (req, res) => { // set the route for the about page
        res.render('about'); // render the about page
    });

    app.get('/players', (req, res) => { // set the route for the players page
        nhlData.getAllPlayers().then((data) => { // get all players
            res.render('players', {players: data}); // render the players page
        })
        .catch((err) => { // if an error occurs
            res.status(404).render('404', {message: 'Error getting players.'}); // render the 404 page
        });
    });

    app.get('/players/addPlayer', (req, res) => { // set the route for the add players page
        nhlData.getAllTeams().then((data) => { // get all the teams
            res.render('addPlayer', {teams: data}); // render the add player page
        })
        .catch((err) => { // if an error occurs
            res.status(404).render('404', {message: 'Error getting teams.'}); // render the 404 page
        });
    });

    app.post('/players/addPlayer', (req, res) => { // set the route for adding a player
        nhlData.addPlayer(req.body).then(() => { // add the player
            res.redirect('/players'); // redirect to the players page
        })
        .catch((err) => { // if an error occurs
            res.status(404).render('404', {message: 'Error adding player.'}); // render the 404 page
        });
    });

    app.get('/teams/:teamName', (req, res) => { // set the route for the team page
        nhlData.getPlayersByTeam(req.params.teamName).then((data) => { // get the players for a team
            res.render('players', {players: data}); // render the players page
        })
        .catch((err) => { // if an error occurs
            res.status(404).render('404', {message: 'Error getting players for that team.'}); // render the 404 page
        });
    });

    app.use('/user', userRoutes); // use the userRoutes module

    app.use('/api', teamsRouter); // use the userRoutes module

    // start the server on the port and output a confirmation to the console
    app.listen(HTTP_PORT, () => console.log(`server listening on: http://localhost:${HTTP_PORT}`));

});

module.exports = app; // export the app object