/* First homework for restful api section */

var http = require('http');
var url = require('url');
var stringDecoder = require('string_decoder').StringDecoder;

var server = http.createServer(function(req,res){
  var parsedUrl = url.parse(req.url,true);
  var path = parsedUrl.pathname;
  var pathTrimmed = path.replace(/^\/+|\/+$/g,'');
  var queryObject = parsedUrl.query;
  var method = req.method.toLocaleLowerCase();
  var headers = req.headers;
  var decoder = new stringDecoder('utf-8');
  var buffer = '';

  req.on('data',function(data){
    buffer += decoder.write(data);
  });

  req.on('end',function(){
    buffer += decoder.end();

    var data = {
      'pathTrimmed' : pathTrimmed,
      'queryObject' : queryObject,
      'method' : method,
      'headers' : headers,
      'load' : buffer
    }

    var selectHandler = typeof(router[pathTrimmed]) !== 'undefined' ? router[pathTrimmed] : handlers.notFound;

    selectHandler(data,function(statusCode,load) {
      statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

      load = typeof(load) == 'object' ? load : {};

      var loadString = JSON.stringify(load);

      res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCode);
      res.end(loadString);
      console.log('This is the returned response: ',statusCode,loadString);
    })
  })
})

server.listen(3261,function(){
  console.log('The server is running on port 3261');
})

var handlers = {};

handlers.hello = function(data, callback){
  callback(200,{
    'Welcome to my diner' : {
      'We offer the following meals': {
        'breakfast': {
          'name' : 'Pancake',
          'drinks' : 'Brewed Coffee'
        },
        'lunch' : {
          'name': 'Rice',
          'viand': 'Ampalaya',
          'drinks': 'Pineapple juice'
        },
        'dinner': {
          'name': 'Soup',
          'appetizer' : 'sisig',
          'drinks' : 'red horse'
        }
      }
    }
  })
};

handlers.notFound = function(data,callback){
  callback(404,{
    'message' : {
      'error' : 'data not found'
    }
  });
}

var router = {
  'hello' : handlers.hello
}