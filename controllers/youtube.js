module.exports = require("../lib/youtube").Youtube;
var YoutubeAPI = require(__dirname + '/youtube');
const YOUTUBE_ACCESS_TOKEN = process.env.YOUTUBE_ACCESS_TOKEN; // declare your YOUTUBE_ACCESS_TOKEN in heroku environment variable
                                                               // under settings
var api = new YoutubeAPI(YOUTUBE_ACCESS_TOKEN);

var imageUrl = "https://s19.postimg.org/y6pd8dn4j/No_image_available.png";
var youtubeURL = "https://www.youtube.com/watch?v=";

module.exports = {
    youtubeController: function (request, response) {
        //console.log(request.query.q);
        if (request.query.q) {
            let options = {
                search: request.query.q, // user query received in request
                part: "snippet",
                order: request.query.order || "relevance", // if user provides order set the value else set as viewcount
                type: request.query.type || "video", 
                videoDefinition: request.query.videoDefinition || "any",
                videoType: "any"
            };
            //*********************function to search the video on youtube - START ***************************
            api.getVideoSearch(options, (err, res) => {
                if (err) {
                    console.log("error received in abs search API...")
                } else {
                    let videoData = JSON.parse(res.body) || {};
                    //console.log(parsedJSON);
                    loopVideos(videoData, (elementsData) => {
                        var messageData = [{
                            "attachment": {
                                "type": "template",
                                "payload": {
                                    "template_type": "generic",
                                    "elements": elementsData
                                }
                            }
                        }];
                        response.send(messageData || [{
                            "text": "Sorry, video service is not available right now..."
                        }]);
                        //console.log("messageData = " + JSON.stringify(messageData));
                    });
                }
            });
            //*********************function to search the video on youtube - END ***************************
        } else {
            response.send(messageData || [{
                "text": "Please send the search query for video search..."
            }]);
        }
    }
}

//******************* loop through all the data received from youtube API and convert to Facebook gallery format -  START ***********************
var loopVideos = function (videoData, done) {
    let elementsData = []; // elementsData is the JSON format array containing cards
    for (var i = 0; i < videoData.pageInfo.resultsPerPage; i++) {
        elementsData[i] = {
            "title": videoData.items[i].snippet.title,
            "image_url": videoData.items[i].snippet.thumbnails.high.url || imageUrl,
            "subtitle": videoData.items[i].snippet.description,
            "buttons": [{
                    "type": "web_url",
                    "url": youtubeURL + videoData.items[i].id.videoId,
                    "title": "Watch Youtube Video"
                }
                // ,
                // {
                //     "type": "show_block",
                //     "block_names": ["Default answer"],
                //     "title": "Menu"
                // }
            ]
        }
    }
    //console.log("elementsData = " + elementsData);
    return done(elementsData);
}
//******************* loop through all the data received from youtube API and convert to Facebook gallery format -  START ***********************