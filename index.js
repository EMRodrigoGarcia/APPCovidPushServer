var admin = require('firebase-admin');
const http = require('http');
var serverAccount = require('../../.keys/fctdam-45f92-firebase-adminsdk-t4c1g-e91f1c48fd.json');
var cron = require('node-cron');

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

var db = admin.database();
var ref = db.ref();
ref.on('value', (snapshot) => {
    //coge todos los hijos
    let snap = snapshot.val();
    for (const key in snap) {
        if (Object.hasOwnProperty.call(snap, key)) {
            const element = snap[key];
            //coge todos los valores de los hijos
            for (const a in element) {
                if (Object.hasOwnProperty.call(element, a)) {
                    const b = element[a];
                    console.log(b);
                    if (Date.parse(b)) {
                        let valDate = Date.parse(b);
                        let nowDate = Date.now();
                    }
                }
            }
        }
    }
})
// para ejecucion diaria la string es '00 00 * * *'
cron.schedule('* * * * *', () => {
    console.log("Corriendo");

})

const port = 3000;

const host = "192.168.1.43";
try {
    server.listen(port, host)
} catch (error) {
    console.log(error);
}
console.log("Escuchando en " + host + ":" + port);