const express = require('express');
const cors = require('cors');
const expressWs = require('express-ws');
// const nanoid = require('nanoid');

const app = express();
const port = 8000;

expressWs(app);

app.use(express.json());
app.use(cors());
app.ws('/chat', function (ws, req) {
  console.log('client connected');

  ws.on('close', (msg) => {
    console.log('client disconnected!');
  });
});


app.listen(port, () => {
  console.log(`Server started on ${port} port!`);
});