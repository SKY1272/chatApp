const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/login', (req, res) => {
    const { username } = req.body;
    if (username) {
        res.cookie('username', username);
        res.redirect('/');
    } else {
        res.send('Please enter a valid username.');
    }
});

app.get('/', (req, res) => {
    const username = req.cookies.username;
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/message', (req, res) => {
    const username = req.cookies.username;
    const message = req.body.message;
    if (username && message) {
        const data = `${username}: ${message}\n`;
        fs.appendFile('messages.txt', data, (err) => {
            if (err) throw err;
            console.log('Message saved to file.');
        });
        res.redirect('/');
    } else {
        res.send('Please enter a message.');
    }
});

app.get('/messages', (req, res) => {
    fs.readFile('messages.txt', 'utf8', (err, data) => {
        if (err) throw err;
        const messages = data.split('\n');
        res.send(messages);
    });
});

// Route for displaying the contact form
app.get('/contactus', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'contactus.html'));
});

// Route for handling form submission
app.post('/contactus', (req, res) => {
    // Handle form submission and show success message
    // Here, we're simply redirecting to '/success'
    res.redirect('/success');
});

// Route for showing success message
app.get('/success', (req, res) => {
    res.send('Form successfully filled');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

