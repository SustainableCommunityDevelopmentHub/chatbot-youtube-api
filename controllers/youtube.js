module.exports = require("../lib/youtube").Youtube;
var YoutubeAPI = require(__dirname + '/youtube');
const YOUTUBE_ACCESS_TOKEN = "YOUR_YOUTUBE_TOKEN_HERE";
var api = new YoutubeAPI(YOUTUBE_ACCESS_TOKEN);
var imageUrl = "https://s19.postimg.org/y6pd8dn4j/No_image_available.png";

var youtubeURL = "https://www.youtube.com/watch?v=";

module.exports = {
    youtubeController: function (request, response) {
        //console.log(request.query.q);
        if (request.query.q) {
            let options = {
                search: request.query.q,
                part: "snippet",
                order: request.query.order || "viewcount",
                type: request.query.type || "video",
                videoDefinition: request.query.videoDefinition || "high"
            };
            api.getVideoSearch(options, (err, res) => {
                if (err) {
                    console.log("error received in abs search API...")
                } else {
                    let parsedJSON = JSON.parse(res.body) || {};
                    //console.log(parsedJSON);
                    let videoData = parsedJSON;
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
                        console.log("messageData = " + JSON.stringify(messageData));
                    });
                }
            });
        } else {
            response.send(messageData || [{
                "text": "Please send the search query for video search..."
            }]);
        }
    }
}

var loopVideos = function (videoData, done) {
    let elementsData = [];
    for (var i = 0; i < videoData.pageInfo.resultsPerPage || 5; i++) {
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