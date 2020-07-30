const http  = require('http');
const querystring = require('querystring');
const bible = require('./bible');
const PORT = 3000;

/*
http://localhost:3000/bibleapi?&book=%22foo%22&chapter=%22bar%22&verses=[1]
*/

let serverRequestHandler = function(request,response) {
    let data = request.url.split("?");
    let path = data[0];
    let parameters = data[1];

    if( path === "/bibleapi" )
    {
        try
        {
            let requestObj = querystring.parse(parameters);
            requestObj.verses = eval(requestObj.verses);
    
            console.log(requestObj);
            response.end("Hello world");
        }
        catch(err) {
            response.end(`Invalid paramaters error: ${err}`);
        }
    }
    else
    {
        response.end("Bad request - invalid URL");
    }
}

let initServer = function (data) {
    let server = http.createServer(serverRequestHandler);

    server.data = data;
    
    server.listen(PORT,'localhost', function() {
        console.log(`Server listening on port ${PORT}`);
    });
}

bible.initBible(initServer);


