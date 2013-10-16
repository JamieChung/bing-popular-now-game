
var express = require('express')
var request = require('request')
var cheerio = require('cheerio')
var fs = require('fs')

var app = express();

app.use(express.logger());
app.use(express.static(__dirname + '/public'));
app.use(express.bodyParser());
app.use(express.methodOverride());

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
});

app.get('/', function(req, res){
  res.render('index');
});

app.get('/popular', function (req, res){

  request('http://www.bing.com/hpm',
    function (error, response, body){

      var $ = cheerio.load(body);
      var items = [];

      $('#crs_pane li').each(function(i, el){
        var link = $(el).find('a').attr('href');

        // Thanks to
        // http://stevenbenner.com/2010/03/javascript-regex-trick-parse-a-query-string-into-an-object/
        var queryString = {};
        link.replace(
            new RegExp("([^?=&]+)(=([^&]*))?", "g"),
            function($0, $1, $2, $3) { queryString[$1] = $3; }
        );

        items.push({
          query: queryString["q"],
          title: $(el).text().replace('·', ''),
          image_url: 'http://www.bing.com' + $(el).find('img').attr('src'),
          image_width: 160,
          image_height: 80
        });
      });

      res.json({popular_search_trends: items});
    });
});


var port = process.env.PORT || 3000;
app.listen(port);
console.log('Listening on port ' + port);

