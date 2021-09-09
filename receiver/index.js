const express = require('express');
const bodyParser = require('body-parser');

const RECEIVE_DURATION = 3 * 60 * 1000; // N mins

const app = express();

app.use(bodyParser.raw({
    inflate: true, limit: '1000kb', type: function (req) {
        return true
    }
}));

let receivedMessageCount = 0;
let startTime = new Date().getTime();

app.all('*', function (req, res) {
    console.log("Received message: " + String(req.body));
    receivedMessageCount++;

    res.status(202).send('');
});

setTimeout(function () {
    // keep the server running. timing of sender should be adjusted properly
    // app.disable()
    console.log("Total received message count: " + receivedMessageCount);
}, RECEIVE_DURATION);

app.listen(8080, () => {
    console.log('https://github.com/aliok/request-logger');
    console.log('App listening on :8080');
});


registerGracefulExit();

function registerGracefulExit() {
    let logExit = function () {
        console.log("Exiting");
        process.exit();
    };

    // handle graceful exit
    //do something when app is closing
    process.on('exit', logExit);
    //catches ctrl+c event
    process.on('SIGINT', logExit);
    process.on('SIGTERM', logExit);
    // catches "kill pid" (for example: nodemon restart)
    process.on('SIGUSR1', logExit);
    process.on('SIGUSR2', logExit);
}
