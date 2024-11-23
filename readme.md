# WebRTC Backend

This is the backend of a simple WebRTC backend. Focuses on P2P connection

- Setup a websocket logic to act as your signalling server
- You need to setup callbacks for 3 events
- - create offer
- - create answer
- - add ice candidate
- But before you create those 3 events, you need to have an event which identifies the sender & reciever
- - identify-as-sender
- - identify-as-receiver
- The code here will only support simple one way communication b/w two tabs