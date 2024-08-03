const express = require('express'); // "require" the Express module
const router = express.Router(); // create a new router object
const { Team } = require('../modules/nhlStats.js'); // "require" the team model

router.get('/teams', async (req, res) => { // set the route for the home page
    try {
        const teams = await Team.find({});
        res.json(teams);
    } catch (err) {
        res.status(404).json({message: 'Error getting teams.'});
    }
});

document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/teams')
    .then(response => response.json())
    .then(data => populateTable(data))
    .catch(error => console.error('Unable to get teams:', error));
});

function populateTable(teamsData) {
    const tableBody = document.getElementById('teamTable').getElementsByTagName('tbody')[0];
    teamsData.forEach(team => {
        let row = `<tr>
        <td>${team.name}</td>
        <td>${team.rostersize}</td>
        <td>${team.contractsused}</td>
        <td>${team.retentionslots}</td>
        <td>${team.projcaphit}</td>
        <td>${team.currentcapspace}</td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}

let sortDirection = [true, true, true, true, true, true];

function sortTable() {
    let table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("sortableTable");
    switching = true;
    /*Make a loop that will continue until
    no switching has been done:*/
    while (switching) {
      //start by saying: no switching is done:
      switching = false;
      rows = table.rows;
      /*Loop through all table rows (except the
      first, which contains table headers):*/
      for (i = 1; i < (rows.length - 1); i++) {
        //start by saying there should be no switching:
        shouldSwitch = false;
        /*Get the two elements you want to compare,
        one from current row and one from the next:*/
        x = rows[i].getElementsByTagName("TD")[0];
        y = rows[i + 1].getElementsByTagName("TD")[0];
        //check if the two rows should switch place:
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          //if so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
      if (shouldSwitch) {
        /*If a switch has been marked, make the switch
        and mark that a switch has been done:*/
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
      }
    }
  }

module.exports = {router, sortTable}; // export the router object