import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import * as Colyseus from "colyseus.js"; // not necessary if included via <script> tag.

var client = new Colyseus.Client('ws://localhost:2567');
client.joinOrCreate("my_room").then(room => {
  console.log(room.sessionId, "joined", room.name);

  room.onStateChange((state) => {
    console.log(room.name, "has new state:", state);
  });

  room.onMessage("message_type", (message) => {
    console.log(room.sessionId, "received on", room.name, message);
  });

  room.onError((code, message) => {
    console.log(room.sessionId, "couldn't join", room.name);
  });

  room.onLeave((code) => {
    console.log(room.sessionId, "left", room.name);
  });

}).catch(e => {
  console.log("JOIN ERROR", e);
});



const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
