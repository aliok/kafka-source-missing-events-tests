const express = require('express');
const bodyParser = require('body-parser');

let receiveDuration = process.env['RECEIVE_DURATION'];
if (!receiveDuration) {
    console.log("RECEIVE_DURATION env var is not defined");
    process.exit();
}
// ignore exceptions
receiveDuration = parseInt(receiveDuration, 10);

const app = express();

app.use(bodyParser.raw({
    inflate: true, limit: '1000kb', type: function (req) {
        return true
    }
}));

let receivedMessageCount = 0;

app.all('*', function (req, res) {
    if (receivedMessageCount === 0) {
        setTimeout(function () {
            // keep the server running. timing of sender should be adjusted properly
            // app.disable()
            console.log("Total received message count: " + receivedMessageCount);
        }, receiveDuration);
    }
    console.log("Received message: " + String(req.body));
    receivedMessageCount++;

    res.status(202).send('');
});


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
