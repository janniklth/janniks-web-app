const fs = require('fs');
const readline = require('readline');

const csvFilePath = 'db_trainstations_2020.csv';




function findIdForName(stationName) {
    const fileStream = fs.createReadStream(csvFilePath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    return new Promise((resolve, reject) => {
        rl.on('line', (line) => {
            const parts = line.split(';');
            if (parts[3] === stationName) {
                rl.close();
                resolve(parts[0]);
            }
        });

        rl.on('close', () => {
            reject('Bahnhof nicht gefunden');
        });
    });
}


function findNameForId(stationId) {
    const fileStream = fs.createReadStream(csvFilePath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    return new Promise((resolve, reject) => {
        rl.on('line', (line) => {
            const parts = line.split(';');
            if (parts[0] === stationId) {
                rl.close(); // End reading the file as a match was found
                resolve(parts[3]);
            }
        });

        rl.on('close', () => {
            if (!rl.closed) {
                // Check if the 'close' event was called due to a match
                reject('No station found with ID ' + stationId);
            }
        });
    });

    rl.closed = false; // A custom property to track whether 'close' was manually called
}



module.exports = { findIdForName, findNameForId };
