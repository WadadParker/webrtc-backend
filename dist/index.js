"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
// We create 2 socket objects, so both the sender n reciever will have their own websocket instance
let senderSocket = null;
let receiverSocket = null;
wss.on('connection', function connection(ws) {
    ws.on('error', console.error);
    ws.on('message', function message(data) {
        const message = JSON.parse(data);
        console.log("This is a message from websocket", message);
        // Based on the message type, we will now create different ws instance
        if (message.type === 'sender') {
            console.log("Sender set");
            senderSocket = ws;
        }
        else if (message.type === 'receiver') {
            console.log("receiver set");
            receiverSocket = ws;
        }
        else if (message.type === 'createOffer') {
            if (ws !== senderSocket)
                return;
            console.log("offer received");
            receiverSocket === null || receiverSocket === void 0 ? void 0 : receiverSocket.send(JSON.stringify({ type: 'createOffer', sdp: message.sdp }));
        }
        else if (message.type === 'createAnswer') {
            if (ws !== receiverSocket)
                return;
            console.log("answer received");
            senderSocket === null || senderSocket === void 0 ? void 0 : senderSocket.send(JSON.stringify({ type: 'createAnswer', sdp: message.sdp }));
        }
        else if (message.type === 'iceCandidate') {
            if (ws === senderSocket) {
                receiverSocket === null || receiverSocket === void 0 ? void 0 : receiverSocket.send(JSON.stringify({ type: 'iceCandidate', candidate: message.candidate }));
            }
            else if (ws === receiverSocket) {
                senderSocket === null || senderSocket === void 0 ? void 0 : senderSocket.send(JSON.stringify({ type: 'iceCandidate', candidate: message.candidate }));
            }
        }
    });
});
