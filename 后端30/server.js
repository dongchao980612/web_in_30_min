const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

const port = 3000;

// 首页
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

// 获取所有 todos
app.get("/todos", async (req, res) => {
    try {
        const todosData = await readDataFile();
        res.json(todosData.todos);
    } catch (error) {
        console.error('Error reading todos:', error);
        res.status(500).json({ message: 'Failed to read todos' });
    }
});


app.get('/about', (req, res) => {
    res.send('About Us');
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});