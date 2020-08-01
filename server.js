const http  = require('http');
const url = require('url');
const bible = require('./bible');
const PORT = 3000;

/*
http://localhost:3000/bibleapi?&book=%22foo%22&chapter=%22bar%22&verses=[1]
*/

let serverRequestHandler = function(request,response) {
    try{
        let paths = url.parse(request.url).pathname.split("/")
        let query = url.parse(request.url,true).query;

        if( paths[1] === "bibleapi" && paths.length > 2 ) {  
            switch(paths[2])
            {
                case "books":
                    let books = {
                        books:this.data.map( b => b.name )
                    };
                    response.end(JSON.stringify(books));
                    break;
                case "chapters":
                    if( query.book )
                    {
                        let bookObj = this.data.find(b => {
                            return (
                                b && 
                                b.name.toLowerCase().replace(/ /g,'') == query.book.toLowerCase().replace(/ /g,'')
                            )
                        });
                        
                        if( bookObj )
                        {
                            let chapters = {
                                chapters: bookObj.chapters.map((c,i) => {
                                    return i+1;
                                })
                            }
                            
                            response.end(JSON.stringify(chapters));
                        }
                        else
                        {
                            response.end("No such bible book");
                        }
                    }
                    else
                    {
                        response.end("This endpoint requires a 'book' parameter");
                    }
                    break;
                default:
                    response.end("No such endpoint");
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
        console.log(`Bible API Server listening on port ${PORT}`);
    });
}

bible.initBible(initServer);


