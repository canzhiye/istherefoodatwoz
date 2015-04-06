var express = require('express');
var app = express();
var request = require('request');
fs = require('fs');

app.use(express.static('at.txt'));

app.get('/', function (req, res) {
    res.sendFile('index.html', { root: __dirname });
});

app.get('/location', function (req, res) {
    var access_token = "";
    fs.readFile('at.txt', 'utf8', function (err,data) {
        if (err) {
          console.log(err);
        }
        access_token = data;

        console.log(req.query.name);
        console.log(access_token);

        var url = 'https://graph.facebook.com/search?q=' + req.query.name + '&type=event&limit=100&access_token=' + access_token;
        console.log(url);
        request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body);
                var data = JSON.parse(body);
                data = data.data;
                console.log(data.length);
                for (var i = 0; i < data.length; i++) {
                    e = data[i];
                    console.log(i);
                    if ("location" in e) {
                        if (e.location == "Wozniak Lounge") {
                            console.log(e.name);
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
                                console.log("THERE IS FOOD");
                                res.json({food: true, id: e.id});
                            }
                      }
                    }
                }
                res.json({food: false});
            } else {
                console.log(error);
            }
        });
    });
});

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

