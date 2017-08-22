var request = require('request');
var API_END_POINT = 'https://www.googleapis.com/youtube/v3/search';

var callAPI = function(resource, qs, callback) {

    if(resource == 'videoSearch'){
        resource = "?" + "part="+ qs.part +"&order=" + qs.order + "&q="+ qs.search+ 
                   "&type="+ qs.type +"&videoDefinition=" + qs.videoDefinition +"&";
        console.log(resource);
    }

    var options = {
        method: 'GET',
        url: API_END_POINT + resource + "key=" + YOUTUBE_ACCESS_TOKEN,
        headers: {
            'content-type': 'application/json'
        }
    };
    request(options, function(error, response, body) {
        //console.log(options.url + "?" + "res_id=" + qs.res_id);
        callback(error, response);
    });
};

var Youtube = function(user_key) {
    YOUTUBE_ACCESS_TOKEN = user_key;

    // this.verify = function(callback) {
    //     callAPI('abs', {}, function(error, response) {
    //         if (error) {
    //             callback(false);
    //             return;
    //         }
    //         callback(true);
    //     });
    // };

    // Common APIs
    this.getVideoSearch = function(options, callback) {
        callAPI('videoSearch', options, callback);
    };

};

exports.Youtube = Youtube;
