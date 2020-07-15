"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Server_1 = require("./server/Server");
const Users_router_1 = require("./users/Users.router");
const server = new Server_1.Server();
server.bootstrap([Users_router_1.usersRouter]).then(server => {
    console.log("Server is listening on:", server.application.address());
}).catch(error => {
    console.log('Server fail to start');
    console.error(error);
    process.exit(1);
});
// server.get('/hello', (req, resp, next) => {
//   resp.json({
//     message: "Hello"
//   })
//   return next()
// })
// server.get('/escolas', (req, resp, next) => {
//   resp.json({
//     escolas: ["Maria rita", "Iracema", "latão", "Leopoldo Santana", "Antonio D'avila"]
//   })
//   return next()
// })
