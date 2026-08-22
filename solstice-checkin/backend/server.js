const http = require('http');

const attendees = [
    {
        id: 'A001',
        name: 'Mary Mbugua',
        checkedIn: false
    },
    {
        id: 'A002',
        name: 'Faith Omondi',
        checkedIn: false
    },
    {
        id: 'A003',
        name: 'Keith Kazungu',
        checkedIn: false
    }
];

const server = http.createServer((req, res) => {

});

server.listen(3000, () => {
    console.log('Solstice Check-In running on port 3000');
});