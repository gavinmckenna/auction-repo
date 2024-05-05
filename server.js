const express = require('express');
const firebaseAdmin = require('firebase-admin');
const path = require('path');

const serviceAccount = require('serviceKey/serviceKey.json');
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount)
});


const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Add more routes as needed

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
