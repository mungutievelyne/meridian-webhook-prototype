const http = require('http');

const attendees =[]; // Ill use this as a storage for the mean time

const server = http.createServer((req, res) =>{

    if (req.method==='GET' && req.url==='/attendees'){

        res.setHeader('Content-Type', 'application/json');

        res.end(JSON.stringify(attendees));
    
}
else if (req.method === 'POST' && req.url === '/webhook') {

}
});

server.listen(3000, () => {
    console.log('Day 2 server running on port 3000');
});
