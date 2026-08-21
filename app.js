console.log("Hello from meridian-webhook-prototype");

const http = require('http'); //Give me Node's built-in HTTP functionality.
const server = http.createServer((req, res) => {
    console.log(req.method);
    console.log(req.url);
       
    
if (req.method === 'POST') {
  console.log("Post received successfully");
  let body = '';
req.on('data', (chunk) => {
    body += chunk;
});

  req.on('end', ( ) => {
        console.log(body);
    });

}
 res.end('Hello!'); //Finish this response and send the text Hello! back to whoever made the request.
     
    });

server.listen(3000);



