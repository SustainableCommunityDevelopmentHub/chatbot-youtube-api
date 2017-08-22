var express = require('express');
var youtube = require("./controllers/youtube");
const app = express();

const REST_PORT = (process.env.PORT || 3000);

app.get('/videoChannel', youtube.youtubeController);

app.listen(REST_PORT, function() {
    console.log('Bot-Server listening on port ' + REST_PORT);
});

