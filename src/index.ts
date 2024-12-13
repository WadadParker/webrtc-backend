import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

// We create 2 socket objects, so both the sender and receiver will have their own WebSocket instance

let senderSocket: any = null;
let receiverSocket: any = null;

wss.on('connection', function connection(ws) {
    ws.on('error', console.error);

    ws.on('message', function message(data: any) {
        const message = JSON.parse(data);
        console.log("This is a message from websocket", message);

        switch (message.type) {
            case 'sender':
                console.log("Sender set");
                senderSocket = ws;
                break;

            case 'receiver':
                console.log("Receiver set");
                receiverSocket = ws;
                break;

            case 'createOffer':
                if (ws !== senderSocket) return;

                console.log("Offer received");
                receiverSocket?.send(JSON.stringify({ type: 'createOffer', sdp: message.sdp }));
                break;

            case 'createAnswer':
                if (ws !== receiverSocket) return;

                console.log("Answer received");
                senderSocket?.send(JSON.stringify({ type: 'createAnswer', sdp: message.sdp }));
                break;

            case 'iceCandidate':
                if (ws === senderSocket) {
                    receiverSocket?.send(JSON.stringify({ type: 'iceCandidate', candidate: message.candidate }));
                } else if (ws === receiverSocket) {
                    senderSocket?.send(JSON.stringify({ type: 'iceCandidate', candidate: message.candidate }));
                }
                break;

            default:
                console.log("Unknown message type:", message.type);
                break;
        }
    });
});
