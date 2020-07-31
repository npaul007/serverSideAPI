const http  = require('http');
const querystring = require('querystring');
const bible = require('./bible');
const PORT = 3000;

/*
http://localhost:3000/bibleapi?&book=%22foo%22&chapter=%22bar%22&verses=[1]
*/

let serverRequestHandler = function(request,response) {
    try{
        let paths = request.url.split("/")
        let requestObj = querystring.parse( request.url.split("?")[1]);

        if( paths[1] === "bibleapi" && paths.length > 2 ) {
            
            switch(paths[2])
            {
                case "books":
                    let books = this.data.map( b => b.name );
                    response.end(books.join("\n"));
                    break;
            }    
        }
        else {
            response.end("Bad request - invalid URL");
        }
    } catch(err) {
        response.end(`Failed to process request due to error: ${err}`);
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


