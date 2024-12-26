// scripts/main.js
document.addEventListener('DOMContentLoaded', function() {
    // 获取所有 todos 并显示在页面上
    async function fetchTodos() {
        const response = await fetch('/todos');
        const data = await response.json();
        displayTodos(data);
    }

    // 显示 todos 为表格
    function displayTodos(todos) {
        const tbody = document.querySelector('#todos-table tbody');
        tbody.innerHTML = '';

        todos.forEach(todo => {
            const tr = document.createElement('tr');
            const idCell = document.createElement('td');
            const titleCell = document.createElement('td');
            const statusCell = document.createElement('td');
            const actionsCell = document.createElement('td');

            idCell.textContent = todo.id;
            titleCell.textContent = todo.title;
           

            // 添加状态下拉框
            const statusSelect = document.createElement('select');
            const pendingOption = document.createElement('option');
            const completedOption = document.createElement('option');

            pendingOption.value = 'Pending';
            pendingOption.textContent = 'Pending';
            completedOption.value = 'Completed';
            completedOption.textContent = 'Completed';

            // 设置默认选中项
            if (todo.completed) {
                completedOption.selected = true;
            } else {
                pendingOption.selected = true;
            }

            statusSelect.appendChild(pendingOption);
            statusSelect.appendChild(completedOption);

            // 更改事件
            statusSelect.addEventListener('change', async () => {
                try {
                    const response = await fetch(`/todos/${todo.id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ completed: statusSelect.value === 'Completed' })
                    });

                    if (!response.ok) {
                        throw new Error('Failed to update todo status');
                    }

                    console.log('Updated todo:', todo.id);
                    fetchTodos(); // 刷新 todos 表格
                } catch (error) {
                    console.error('Error updating todo:', error);
                }
            });

            // 添加到单元格
            statusCell.appendChild(statusSelect);

            // 添加删除按钮
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('btn', 'btn-danger');  // 添加 Bootstrap 类

            deleteButton.addEventListener('click', async () => {
                try {
                    const response = await fetch(`/todos/${todo.id}`, {
                        method: 'DELETE'
                    });

                    if (!response.ok) {
                        throw new Error('Failed to delete todo');
                    }

                    console.log('Deleted todo:', todo.id);
                    fetchTodos(); // 刷新 todos 表格
                } catch (error) {
                    console.error('Error deleting todo:', error);
                }
            });

            actionsCell.appendChild(deleteButton);


            tr.appendChild(idCell);
            tr.appendChild(titleCell);
            tr.appendChild(statusCell);
            tr.appendChild(actionsCell);

            tbody.appendChild(tr);
        });
    }

    // 加载 todos
    fetchTodos();

    // 处理表单提交
    document.getElementById('create-todo-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const todoText = document.getElementById('new-todo').value;
        try {
            const response = await fetch('/todos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title: todoText })
            });

            if (!response.ok) {
                throw new Error('Failed to create todo');
            }

            const newTodo = await response.json();
            console.log('Created todo:', newTodo);
            document.getElementById('new-todo').value = ''; // 清空输入框
            fetchTodos(); // 刷新 todos 表格
        } catch (error) {
            console.error('Error creating todo:', error);
        }
    });
});