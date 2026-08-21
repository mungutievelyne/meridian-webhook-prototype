console.log("Hello from meridian-webhook-prototype");

const http = require('http'); //Give me Node's built-in HTTP functionality.
const server = http.createServer((req, res) => {
    console.log(req.method);
    console.log(req.url);
      res.end('Hello!'); //Finish this response and send the text Hello! back to whoever made the request.
      });

server.listen(3000);

