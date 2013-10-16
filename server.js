
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

// Homepage
app.get('/', function(req, res){
  res.render('index');
});

// Proxy for the homepage images
app.get('/images', function(req, res){
  request.get('http://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=10').pipe(res);
});

// API request
app.get('/popular', function (req, res){

  // Send a request to the /hpm page of bing
  request('http://www.bing.com/hpm',
    function (error, response, body){

      // manually load the HTML into a cheerio object
      var $ = cheerio.load(body);
      var items = [];

      // we will get all the items in the carousel
      $('#crs_pane li').each(function(i, el){
        var link = $(el).find('a').attr('href');

        // We need to get the query parameters for the link
        // Credit to:
        // http://stevenbenner.com/2010/03/javascript-regex-trick-parse-a-query-string-into-an-object/
        var queryString = {};
        link.replace(
            new RegExp("([^?=&]+)(=([^&]*))?", "g"),
            function($0, $1, $2, $3) { queryString[$1] = $3; }
        );

        // Store the item in the object array
        items.push({
          title: $(el).text().replace('·', ''),
          query: queryString["q"],
          query_url: link,
          image_url: 'http://www.bing.com' + $(el).find('img').attr('src'),
          image_width: 160,
          image_height: 80
        });
      });

      // return a json response with the results
      res.json({popular_search_trends: items});
    });
});

var port = process.env.PORT || 3000;
app.listen(port);
console.log('Listening on port ' + port);

