require('dotenv').config();
const express = require('express');
const {PORT} = require('./config');
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const {router:postRouter} = require('./routers/postReceive');
const app = express();

app.use(jsonParser);
app.use('/order',postRouter);

let server;

function runServer( databaseUrl, port = PORT) {
  return new Promise((resolve, reject) => {
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
        .on('error', err => {
          reject(err);
        });
    });
}

function closeServer(){
	return new Promise((resolve,reject) => {
		console.log("closing server");
		server.close(err => {
			if(err){
				return reject(err);
			}
			resolve();
		});
	});
}

if (require.main === module){
	runServer().catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };