const http  = require('http');
const querystring = require('querystring');

const PORT = 3000;

/*
http://localhost:3000/bibleapi?&book=%22foo%22&chapter=%22bar%22&verses=[1]
*/
let server = http.createServer(function(request,response) {
    let data = request.url.split("?");
    let path = data[0];
    let parameters = data[1];

    if( path === "/bibleapi" )
    {
        let requestObj = querystring.parse(parameters);
        requestObj.verses = eval(requestObj.verses);

        console.log(requestObj);
        response.end("Hello world");
    }
    else
    {
        response.end("Bad request - invalid URL");
    }
});

server.listen(PORT,'localhost', function() {
    console.log(`Server listening on port ${PORT}`);
});
