
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
app.get('/', function (req, res) {
    
    res.render('index', createPiecesArray());
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

function getJS() {
    return {
        "popular_search_trends": [
          {
              "title": "School bus hijacked",
              "query": "School+bus+hijacked",
              "query_url": "/search?q=School+bus+hijacked&filters=TopicID%3a%22fa99c270-4d0c-4e44-863e-c12cc8245ac5%22+DataVersion%3a%22461505%22+tt_col%3a%220%22+tt_ord%3a%228efa3f30-8759-46ee-ad00-1c7d86b04020%22+segment%3a%22popularnow.carousel%22&FORM=HPNN01",
              "image_url": "http://www.bing.com/th?id=OS.-1xrUFOcSh6bQKnTkq39dA600C600&w=160&h=80&c=8&rs=2&qlt=80&pid=PopNow",
              "image_width": 160,
              "image_height": 80
          },
          {
              "title": "'Americans fed up'",
              "query": "Obama+%27Americans+fed+up%27",
              "query_url": "/search?q=Obama+%27Americans+fed+up%27&filters=TopicID%3a%22de387b4d-0332-4d73-970f-383e3510fb5d%22+DataVersion%3a%22461505%22+tt_col%3a%221%22+tt_ord%3a%228efa3f30-8759-46ee-ad00-1c7d86b04020%22+segment%3a%22popularnow.carousel%22&FORM=HPNN01",
              "image_url": "http://www.bing.com/th?id=OS.xCUkr8xbh6r8hdeiQSpi3w600C600&w=160&h=80&c=8&rs=2&qlt=80&pid=PopNow",
              "image_width": 160,
              "image_height": 80
          },
          {
              "title": "Ed Lauter dies",
              "query": "Ed+Lauter",
              "query_url": "/search?q=Ed+Lauter&filters=TopicID%3a%22b0552d23-db0f-43ce-95dd-f32ab8e3bc08%22+DataVersion%3a%22461505%22+tt_col%3a%222%22+tt_ord%3a%228efa3f30-8759-46ee-ad00-1c7d86b04020%22+segment%3a%22popularnow.carousel%22&FORM=HPNN01",
              "image_url": "http://www.bing.com/th?id=OS.19soEoBNAxpb4q82XaxSUA600C600&w=160&h=80&c=8&rs=2&qlt=80&pid=PopNow",
              "image_width": 160,
              "image_height": 80
          },
          {
              "title": "Yeti mystery solved?",
              "query": "Yeti+mystery",
              "query_url": "/search?q=Yeti+mystery&filters=TopicID%3a%226cc10447-fde1-45fd-9f2a-212499c52021%22+DataVersion%3a%22461505%22+tt_col%3a%223%22+tt_ord%3a%228efa3f30-8759-46ee-ad00-1c7d86b04020%22+segment%3a%22popularnow.carousel%22&FORM=HPNN01",
              "image_url": "http://www.bing.com/th?id=OS.7MZ54FEdqQlarIMUYEuJ8g600C600&w=160&h=80&c=8&rs=2&qlt=80&pid=PopNow",
              "image_width": 160,
              "image_height": 80
          },
          {
              "title": "Scientology fraud?",
              "query": "France+Scientology+fraud",
              "query_url": "/search?q=France+Scientology+fraud&filters=TopicID%3a%22733849d3-ca4c-4f62-8d13-4838e8c2b325%22+DataVersion%3a%22461505%22+tt_col%3a%224%22+tt_ord%3a%228efa3f30-8759-46ee-ad00-1c7d86b04020%22+segment%3a%22popularnow.carousel%22&FORM=HPNN01",
              "image_url": "http://www.bing.com/th?id=OS.XyaFvUHPNCDolB2c8dX1HA600C600&w=160&h=80&c=8&rs=2&qlt=80&pid=PopNow",
              "image_width": 160,
              "image_height": 80
          },
          {
              "title": "Windows 8.1 update",
              "query": "Windows+8.1",
              "query_url": "/search?q=Windows+8.1&filters=TopicID%3a%22e8b2a38b-f992-4be5-899e-db310ba59a0c%22+DataVersion%3a%22461505%22+tt_col%3a%225%22+tt_ord%3a%228efa3f30-8759-46ee-ad00-1c7d86b04020%22+segment%3a%22popularnow.carousel%22&FORM=HPNN01",
              "image_url": "http://www.bing.com/th?id=OS.iWwy4GU8ZyabQBiZOaYG7A600C600&w=160&h=80&c=8&rs=2&qlt=80&pid=PopNow",
              "image_width": 160,
              "image_height": 80
          },
          {
              "title": "30 million enslaved",
              "query": "Global+Slavery+Index",
              "query_url": "/search?q=Global+Slavery+Index&filters=TopicID%3a%22dae4542c-4b42-40ba-84fe-725f4dcfdeb3%22+DataVersion%3a%22461505%22+tt_col%3a%226%22+tt_ord%3a%228efa3f30-8759-46ee-ad00-1c7d86b04020%22+segment%3a%22popularnow.carousel%22&FORM=HPNN01",
              "image_url": "http://www.bing.com/th?id=OS.mqH-6mSJodc4lUr1Tv1Yog600C600&w=160&h=80&c=8&rs=2&qlt=80&pid=PopNow",
              "image_width": 160,
              "image_height": 80
          },
          {
              "title": "Drescher's new beau",
              "query": "Fran+Drescher",
              "query_url": "/search?q=Fran+Drescher&filters=TopicID%3a%22f9e53734-1331-489b-9287-b851c4e99aed%22+DataVersion%3a%22461505%22+tt_col%3a%227%22+tt_ord%3a%228efa3f30-8759-46ee-ad00-1c7d86b04020%22+segment%3a%22popularnow.carousel%22&FORM=HPNN01",
              "image_url": "http://www.bing.com/th?id=OS.73yL7ZtVuFA8QwTnh5gHrA600C600&w=160&h=80&c=8&rs=2&qlt=80&pid=PopNow",
              "image_width": 160,
              "image_height": 80
          },
          {
              "title": "Cara in Times Square",
              "query": "Cara+Delevingne",
              "query_url": "/search?q=Cara+Delevingne&filters=TopicID%3a%224e2cc89b-b3ff-4bda-a6b1-9330901db258%22+DataVersion%3a%22461505%22+tt_col%3a%228%22+tt_ord%3a%228efa3f30-8759-46ee-ad00-1c7d86b04020%22+segment%3a%22popularnow.carousel%22&FORM=HPNN01",
              "image_url": "http://www.bing.com/th?id=OS.thPKub2Q5Fjy5y915Lqu9A600C600&w=160&h=80&c=8&rs=2&qlt=80&pid=PopNow",
              "image_width": 160,
              "image_height": 80
          },
          {
              "title": "House stenographer",
              "query": "House+stenographer",
              "query_url": "/search?q=House+stenographer&filters=TopicID%3a%228de76df9-f0cb-4bc2-ad65-435808cd9122%22+DataVersion%3a%22461505%22+tt_col%3a%229%22+tt_ord%3a%228efa3f30-8759-46ee-ad00-1c7d86b04020%22+segment%3a%22popularnow.carousel%22&FORM=HPNN01",
              "image_url": "http://www.bing.com/th?id=OS.RsKsQh6G-gblN_KSEWWzIw600C600&w=160&h=80&c=8&rs=2&qlt=80&pid=PopNow",
              "image_width": 160,
              "image_height": 80
          },
          {
              "title": "Bay attacked on set",
              "query": "Michael+Bay",
              "query_url": "/search?q=Michael+Bay&filters=TopicID%3a%2275968416-25ae-4129-80fd-ae15837be1c4%22+DataVersion%3a%22461505%22+tt_col%3a%2210%22+tt_ord%3a%228efa3f30-8759-46ee-ad00-1c7d86b04020%22+segment%3a%22popularnow.carousel%22&FORM=HPNN01",
              "image_url": "http://www.bing.com/th?id=OS.lmqsLRPUS6xeQ2mUXYpbLw600C600&w=160&h=80&c=8&rs=2&qlt=80&pid=PopNow",
              "image_width": 160,
              "image_height": 80
          },
          {
              "title": "Oregon pink helmets",
              "query": "Oregon+pink+helmets",
              "query_url": "/search?q=Oregon+pink+helmets&filters=TopicID%3a%2299d69bfc-ba3b-40ea-a745-284ef242a707%22+DataVersion%3a%22461505%22+tt_col%3a%2211%22+tt_ord%3a%228efa3f30-8759-46ee-ad00-1c7d86b04020%22+segment%3a%22popularnow.carousel%22&FORM=HPNN01",
              "image_url": "http://www.bing.com/th?id=OS.W8EMR6SgU1fbx45LVfda4w600C600&w=160&h=80&c=8&rs=2&qlt=80&pid=PopNow",
              "image_width": 160,
              "image_height": 80
          },
          {
              "title": "Soldier's salute",
              "query": "Wounded+soldier+salute",
              "query_url": "/search?q=Wounded+soldier+salute&filters=TopicID%3a%2289434f8f-18fb-4e9a-8386-3d0d5d39e6d1%22+DataVersion%3a%22461505%22+tt_col%3a%2212%22+tt_ord%3a%228efa3f30-8759-46ee-ad00-1c7d86b04020%22+segment%3a%22popularnow.carousel%22&FORM=HPNN01",
              "image_url": "http://www.bing.com/th?id=OS.fSTAIyj1NFLLMop65eAwRA600C600&w=160&h=80&c=8&rs=2&qlt=80&pid=PopNow",
              "image_width": 160,
              "image_height": 80
          },
          {
              "title": "Suh fined for hit",
              "query": "Ndamukong+Suh",
              "query_url": "/search?q=Ndamukong+Suh&filters=TopicID%3a%221908f7d6-721f-4cd5-9861-e210a5751d7b%22+DataVersion%3a%22461505%22+tt_col%3a%2213%22+tt_ord%3a%228efa3f30-8759-46ee-ad00-1c7d86b04020%22+segment%3a%22popularnow.carousel%22&FORM=HPNN01",
              "image_url": "http://www.bing.com/th?id=OS.MXS50G6eItUdNTyJFGqw3g600C600&w=160&h=80&c=8&rs=2&qlt=80&pid=PopNow",
              "image_width": 160,
              "image_height": 80
          },
          {
              "title": "Diet Coke gut check",
              "query": "Diet+Coke+artificial+sweeteners",
              "query_url": "/search?q=Diet+Coke+artificial+sweeteners&filters=TopicID%3a%2263450293-799a-48ef-910e-39c652a8f05e%22+DataVersion%3a%22461505%22+tt_col%3a%2214%22+tt_ord%3a%228efa3f30-8759-46ee-ad00-1c7d86b04020%22+segment%3a%22popularnow.carousel%22&FORM=HPNN01",
              "image_url": "http://www.bing.com/th?id=OS.DkWdbUMM9YpyTxP6Uueoqg600C600&w=160&h=80&c=8&rs=2&qlt=80&pid=PopNow",
              "image_width": 160,
              "image_height": 80
          }
        ]
    };
}

function createPiecesArray()
{
    subjects = getJS().popular_search_trends;
    var subjectsGo = subjects.slice(0);
    for(var i = 0; i < subjects.length; i++)
    {
      var cloned = clone(subjects[i]);
      cloned.isImage = true;  
      subjectsGo.push(cloned);
    }
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