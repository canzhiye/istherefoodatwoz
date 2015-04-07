var express = require('express');
var app = express();
var request = require('request');

app.set('port', (process.env.PORT || 5000));
app.use(express.static('at.txt'));

app.get('/', function (req, res) {
    res.sendFile('index.html', { root: __dirname });
});

app.get('/location', function (req, res) {
    var access_token = process.env.AT;

    console.log(req.query.name);
    console.log(access_token);

    var url = 'https://graph.facebook.com/search?q=' + req.query.name + '&type=event&limit=100&access_token=' + access_token;
    console.log(url);
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log("body: " + body);
            var data = JSON.parse(body);
            data = data.data;
            for (var i = 0; i < data.length; i++) {
                e = data[i];
                if ("location" in e) {
                    if (e.location == "Wozniak Lounge") {
                        console.log("event name: " + e.name);
                        var start_time = new Date(e.start_time);

                        var end_time = new Date();
                        if ("end_time" in e) {
                            end_time = new Date(e.end_time);
                        } else {
                            var mins = 60; //how many minutes we arbitrarily decide the event to be
                            end_time.setTime(start_time.getTime() + (mins * 60 * 1000));
                        }

                        var now = new Date();
                        console.log("start time: " + start_time);
                        console.log("end time: " + end_time);
                        console.log("current time: " + now);
                        if (start_time.getTime() < now && now < end_time.getTime()) {
                            res.json({food: true, id: e.id});
                        }
                  }
                }
            }
            res.json({food: false});
        } else {
            console.log("error: " + error);
        }
    });
});

var server = app.listen(app.get('port'), function () {
  console.log("Node app is running at localhost:" + app.get('port'));
});

