var admin = require('firebase-admin');
const http = require('http');
var serverAccount = require('../../.keys/fctdam-45f92-firebase-adminsdk-t4c1g-e91f1c48fd.json');
var gd = require('querystring');

admin.initializeApp({
    credential: admin.credential.cert(serverAccount),
    databaseURL: "https://fctdam-45f92-default-rtdb.europe-west1.firebasedatabase.app/"
});

const server = http.createServer(function (request, response) {
    if (request.method == "POST") {
        console.log("Algo por POST");
        var body = [];

        request.on('data', function (data) {
            body.push(data);
        });

        request.on('close', () => {
            console.log("Se acabo");
            var tokenStr = Buffer.concat(body).toString();

            console.log(tokenStr);
            var message = {
                notification: {
                    title: 'Un contacto ha tenido COVID-19',
                    body: 'Un contacto ha tenido COVID-19'
                },
                token: tokenStr
            };

            admin.messaging().send(message).then((res) => {
                console.log("De puta madre socio " + res);
            }).catch((err) => {
                console.error("puta mierda " + err);
            });
        }
        );
    } else {
        console.log("Otra cosa");
    }

});

const port = 3000;

const host = "192.168.1.43";
try {
    server.listen(port, host)
} catch (error) {
    console.log(error);
}
console.log("Escuchando en " + host + ":" + port);