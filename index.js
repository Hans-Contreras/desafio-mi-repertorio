//Importar modulos
const http = require('http');
const url = require('url');
const fs = require('fs');

const { insertar, consultar, editar, eliminar, consultaVideo } = require('./consultas');

//configuracion del servidor
const host = 'localhost';
const port = 3000;

//Se crea el servidor
http
    .createServer(async (req, res) => {
        if (req.url == '/' && req.method === 'GET') {
            res.setHeader('Content-Type', 'text/html');
            const html = fs.readFileSync('./index.html');
            res.end(html);
        }
        //Se disponibiliza petición POST para agregar una cancion
        if (req.url == '/cancion' && req.method === 'POST') {
            res.setHeader('Content-Type', 'application/json');
            let body = '';
            req.on('data', (data) => {
                body += data;
            });
            req.on('end', async () => {
                console.log(body);
                const datos = Object.values(JSON.parse(body));
                const result = await insertar(datos);
                res.end(JSON.stringify(result));
            });
        }

        //Se disponibiliza petición GET para obtener todas las canciones
        if (req.url == '/canciones' && req.method === 'GET') {
            res.setHeader('Content-Type', 'application/json');
            const result = await consultar();
            res.end(JSON.stringify(result.rows));
        }


        //Se disponibiliza petición GET video url
        if (req.url.startsWith('/video?') && req.method == 'GET'){
            const { id } = url.parse(req.url, true).query;
            res.setHeader('Content-Type', 'application/json');
            const result = await consultaVideo(id);
            res.end(JSON.stringify(result));
        }


        //Se disponibiliza petición PUT para editar una cancion
        if (req.url.startsWith("/cancion?") && req.method === 'PUT') {
            const { id } = url.parse(req.url, true).query;
            console.log(id)
            res.setHeader('Content-Type', 'application/json');
            let body = '';
            req.on('data', (data) => {
                body += data;
            });
            req.on('end', async () => {
                const datos = Object.values(JSON.parse(body));
                const result = await editar(id, datos);
                res.statusCode = 200;
                console.log(result);
                res.end(JSON.stringify(result));
            
            });
        }
        //Se disponibiliza petición DELETE para eliminar una cancion
        if (req.url.startsWith('/cancion?') && req.method == 'DELETE') {
            const { id } = url.parse(req.url, true).query;
            console.log(id)
            const respuesta = await eliminar(id);
            res.end(JSON.stringify(respuesta));
        }


    }).listen(port, () => {
        console.log(`\nServer running at http://${host}:${port}/\n`);
    });