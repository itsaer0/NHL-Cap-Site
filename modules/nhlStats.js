const mongoose = require('mongoose');
const { start } = require('repl');
const Schema = mongoose.Schema;
require('dotenv').config();
const dbConnection = mongoose.connect(process.env.DB_CONNECTION_STRING)
.then(() => {
    console.log('Connected to database');
})
.catch(err => {
    console.log('Error connecting to database: ' + err);
});

const playerSchema = new Schema({
    id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    birthdate: {
        type: String,
        required: true
    },
    height: {
        type: String,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    birthplace: {
        type: String,
        required: true
    },
    nationality: {
        type: String,
        required: true
    },
    draftyear: {
        type: Number,
        required: false
    },
    draftposition: {
        type: Number,
        required: false
    },
    draftround: {
        type: Number,
        required: false
    },
    draftteam: {
        type: String,
        required: false
    },
    currentteam: {
        type: String,
        required: false
    },
    positions: {
        type: [String],
        required: true
    },
    handedness: {
        type: String,
        required: true
    },
    currentcaphit: {
        type: Number,
        required: true
    },
    captain: {
        type: Boolean,
        required: true
    },
    alternatecaptain: {
        type: Boolean,
        required: true
    },
    active: {
        type: Boolean,
        required: true
    },
    injuredreserve: {
        type: Boolean,
        required: true
    },
    longterminjuredreserve: {
        type: Boolean,
        required: true
    },
}, {timestamps: false});

const Player = mongoose.model('Player', playerSchema);

const teamSchema = new Schema({
    id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    abbreviation: {
        type: String,
        required: true
    },
    conference: {
        type: String,
        required: true
    },
    division: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    arena: {
        type: String,
        required: true
    },
    projcaphit: {
        type: Number,
        required: true
    },
    projltirused: {
        type: Number,
        required: true
    },
    currentcapspace: {
        type: Number,
        required: true
    },
    deadlinecapspace: {
        type: Number,
        required: true
    },
    currentcaphit: {
        type: Number,
        required: true
    },
    rostersize: {
        type: Number,
        required: true
    },
    contractslots: {
        type: Number,
        required: true
    },
    retentionslots: {
        type: Number,
        required: true
    },
    currentinjuries: {
        type: Number,
        required: true
    },
    generalmanager: {
        type: String,
        required: false
    },
    headcoach: {
        type: String,
        required: false
    }
}, {timestamps: false});

const Team = mongoose.model('Team', teamSchema);

const contractSchema = new Schema({
    playerid: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Player'
    },
    startdate: {
        type: Number,
        required: true
    },
    enddate: {
        type: Number,
        required: true
    },
    basesalary: {
        type: Number,
        required: true
    },
    totalsalary: {
        type: Number,
        required: true
    },
    expirystatus: {
        type: String,
        required: true
    },
    cappercentage: {
        type: Number,
        required: true
    },
    signingmanager: {
        type: String,
        required: true
    },
    signingteam: {
        type: String,
        required: true
    },
    performancebonus: {
        type: Number,
        required: true
    },
    signingbonus: {
        type: Number,
        required: true
    },
    tradeclause: {
        type: String,
        required: true
    },

}, {timestamps: false});

const Contract = mongoose.model('Contract', contractSchema);

const playerData = require('../data/playerData.json');
const teamData = require('../data/teamData.json');
const contractData = require('../data/contractData.json');
const { get } = require('http');
const { type } = require('os');

let players = [];

async function initializeDB() {
    try{
        for (const player of playerData) {
            const existingPlayer = await Player.findOne({id: player.id});
            if (!existingPlayer) {
                await Player.create(player);
            } else {
                await Player.updateOne({id: player.id}, player);
            }
        }

        for (const team of teamData) {
            const existingTeam = await Team.findOne({id: team.id});
            if (!existingTeam) {
                await Team.create(team);
            } else {
                await Team.updateOne({id: team.id}, team);
            }
        }
    }
    catch(err) {
        console.log('Error initializing database: ' + err);
    }
}

async function getAllPlayers() {
    try {
        return await Player.find();
    }
    catch(err) {
        return "Error getting all sets: " + err;
    }
}

async function getAllTeams() {
    try {
        return await Team.find();
    }
    catch(err) {
        return "Error getting all teams: " + err;
    }
}

async function getActivePlayers() {
    try {
        return await Player.find({active: true});
    }
    catch(err) {
        return "Error getting all active players: " + err;
    }
}

async function getPlayersByTeam(team) {
    try {
        return await Player.find({currentteam: team});
    }
    catch(err) {
        return "Error getting players by team: " + err;
    }
}

async function getPlayersByPosition(position) {
    try {
        return await Player.find({position: position});
    }
    catch(err) {
        return "Error getting players by position: " + err;
    }
}

async function getPlayersByAge(age) {
    try {
        return await Player.find({age: age});
    }
    catch(err) {
        return "Error getting players by age: " + err;
    }
}

async function getPlayersByDraftYear(year) {
    try {
        return await Player.find({draftyear: year});
    }
    catch(err) {
        return "Error getting players by draft year: " + err;
    }
}

async function getTeamByName(team) {
    try {
        return await Team.findOne({name: team});
    }
    catch(err) {
        return "Error getting team by name: " + err;
    }
}

async function getTeamByID(id) {
    try {
        return await Team.findOne({id: id});
    }
    catch(err) {
        return "Error getting team by ID: " + err;
    }
}

async function addPlayer(player) {
    return new Promise((resolve, reject) => {
        Player.create(player)
        .then(() => {
            resolve();
        })
        .catch(err => {
            reject(err.errors[0].message);
        });
    });
}

async function getNextID() {
    try {
        let nextID = 0;
        const players = await Player.find({});
        players.forEach(player => {
            if (player.id > nextID) {
                nextID = player.id;
            }
        });
        return nextID + 1;
    } catch (err) {
        return "Error getting next ID: " + err;
    }
}

module.exports = { dbConnection, initializeDB, getAllPlayers, getAllTeams, getActivePlayers, getPlayersByTeam, getPlayersByPosition, getPlayersByAge, getPlayersByDraftYear, getTeamByName, getTeamByID, addPlayer, getNextID, Player, Team, Contract};