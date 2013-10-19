
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
// app.get('/', function (req, res) {
//     res.render('index', createPiecesArray());
// });

// Proxy for the homepage images
app.get('/images', function(req, res){
  request.get('http://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=10').pipe(res);
});

// API request to get current homepage video
app.get('/videos', function(req, res){

  // we have to fake the user agent so that we can get HTML5 video
  var agent = 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.69 Safari/537.36'

  request.get({url: 'http://www.bing.com', headers: {'user-agent': agent}},
    function (error, response, body){
      var regex = /(var g_vid =(\[\[(.+)\]\])\;)/gm;
      var matches = regex.exec(body);

      var g_vid;
      var items = [];

      if (matches && matches[1]) eval(matches[1]);

      for ( var i in g_vid ) {
        items.push({
          codec: g_vid[i][0],
          source: 'http://www.bing.com' + g_vid[i][1]
        });
      }

      res.json({videos: items});
    });
});

app.get('/', function (req, res){
  request('http://azurethon.cloudapp.net/api/popular',
    function (error, response, body){

      console.log(body);
      res.render('index', createPiecesArray(JSON.parse(body).popular_search_trends));
    });
});

// API request
// app.get('/', function (req, res){

//   // Send a request to the /hpm page of bing
//   request('http://www.bing.com/hpm',
//     function (error, response, body){

//       // manually load the HTML into a cheerio object
//       var $ = cheerio.load(body);
//       var items = [];

//       // we will get all the items in the carousel
//       $('#crs_pane li').each(function(i, el){
//         var link = $(el).find('a').attr('href');

//         // We need to get the query parameters for the link
//         // Credit to:
//         // http://stevenbenner.com/2010/03/javascript-regex-trick-parse-a-query-string-into-an-object/
//         var queryString = {};
//         link.replace(
//             new RegExp("([^?=&]+)(=([^&]*))?", "g"),
//             function($0, $1, $2, $3) { queryString[$1] = $3; }
//         );

//         var image = $(el).find('img').attr('src');

//         if (image){
//           // Store the item in the object array
//           items.push({
//             title: $(el).text().replace('·', ''),
//             query: queryString["q"],
//             query_url: link,
//             image_url: 'http://www.bing.com' + image,
//             image_width: 160,
//             image_height: 80
//           });
//         }
//       });

//       // return a json response with the results
//       res.render('index', createPiecesArray(items));
//     });
// });

var port = process.env.PORT || 3000;
app.listen(port);
console.log('Listening on port ' + port);

//http://www.kirupa.com/html5/shuffling_array_js.htm
function shuffle(input) {

    for (var i = input.length-1; i >=0; i--) {

        var randomIndex = Math.floor(Math.random()*(i+1));
        var itemAtIndex = input[randomIndex];

        input[randomIndex] = input[i];
        input[i] = itemAtIndex;
    }
    return input;
}

function createPiecesArray(subjects)
{
    var subjectsGo = [];
    for(var i = 0; i < subjects.length; i++)
    {
      var cloned = clone(subjects[i]);
      cloned.isImage = true;
      if ( cloned.image_url.indexOf('undefined') == -1 || cloned.image_url !== "http://www.bing.comundefined") {
        subjectsGo.push(cloned);
        subjectsGo.push(subjects[i]);
      }
    }
    subjectsGo = shuffle(subjectsGo);
    return { "popular_search_trends":subjectsGo };
}

function clone(obj){
    if(obj == null || typeof(obj) != 'object')
        return obj;

    var temp = obj.constructor(); // changed

    for(var key in obj)
        temp[key] = clone(obj[key]);
    return temp;
}