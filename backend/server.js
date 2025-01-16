const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs').promises; // 使用fs.promises以获取更简洁的异步API

app.use(express.static(path.join(__dirname, '/public'))); // 静态文件目录
app.use(express.json()); // 用于解析JSON请求体
app.use(express.urlencoded({ extended: true })); // 用于解析URL编码的表单数据
const dataFilePath = path.join(__dirname, 'data.json');

// 读取todos数据
async function readTodos() {
    try {
        const data = await fs.readFile(dataFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading todos data:', error);
        return { todos: [], nextId: 1 };
    }
}

// 写入todos数据
async function writeTodos(data) {
    const content = JSON.stringify(data, null, 2);
    await fs.writeFile(dataFilePath, content, 'utf8');
}

const port = 3000;

// 首页
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

// 获取所有 todos
app.get("/todos", async (req, res) => {
    const data = await readTodos();
    res.status(200).json(data);
});

// 获取单个 todo
app.get("/todos/:id", async (req, res) => {
    const data = await readTodos();
    const id = parseInt(req.params.id);
    const todo = data.todos.find((t) => t.id === id);
    if (todo) {
        res.status(200).json(todo);
    } else {
        res.status(404).json({ message: "Todo not found" });
    }
});

// 创建 todo
app.post("/todos", async (req, res) => {
    const data = await readTodos();
    const { title, completed = false } = req.body;
    if (!title) {
        res.status(400).json({ message: "Title is required" });
        return;
    }
    const newTodo = {
        id: data.nextId,
        title,
        completed,
    };
    data.todos.push(newTodo);
    data.nextId += 1; // 更新nextId
    await writeTodos(data);
    res.status(201).json(newTodo);
});

// 删除 todo
app.delete("/todos/:id", async (req, res) => {
    const data = await readTodos();
    const id = parseInt(req.params.id);
    const index = data.todos.findIndex((t) => t.id === id);
    if (index >= 0) {
        data.todos.splice(index, 1);
        await writeTodos(data);
        res.status(200).send();
    } else {
        res.status(404).json({ message: "Todo not found" });
    }
});

// 开启服务
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});