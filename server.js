const http  = require('http');
const url = require('url');
const bible = require('./bible');
const PORT = 3000;

const fs = require('fs');

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
                                b.name.toLowerCase().replace(/ /g,'') == query.book.toLowerCase()
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

                case "verses":
                    if( query.book && query.chapter )
                    {
                        let book = this.data.find(b => b.name.toLowerCase().replace(/ /g,'') == query.book.toLowerCase());
                        let chapter = {
                            chapter:book.chapters[query.chapter-1]
                        };
                        response.end(JSON.stringify(chapter));
                    }
                    else
                    {
                        response.end("This endpoint requires a 'book' and 'chapter' parameter" );
                    }
                    break;
                default:
                    response.end("No such endpoint");
                    break;
            }    
        }
        else {
            let index = fs.readFileSync(`./index.html`);
            response.writeHead(200 , {'Content-Type':'text/html'});
            response.end(index);
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


