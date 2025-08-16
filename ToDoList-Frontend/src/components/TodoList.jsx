import "./TodoList.css";
import { FaEdit, FaTrashAlt, FaSave, FaTimes } from 'react-icons/fa';
import { MdEdit, MdDelete, MdSave, MdClose } from 'react-icons/md';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  // Fetch todos from backend
  useEffect(() => {
    fetchTodos();
  }, []);

  // Apply dark mode class
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const fetchTodos = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/tasks");
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos", error);
    }
  };

  // Add new todo
  const addTodo = async () => {
    if (newTask.trim() === "") return; // prevent empty task

    try {
      const response = await axios.post("http://localhost:8080/api/tasks", {
        taskName: newTask,
        completed: false
      });
      setTodos([...todos, response.data]); // add new todo to list
      setNewTask(""); // clear input
    } catch (error) {
      console.error("Error adding todo", error);
    }
  };

  // Delete todo
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/tasks/${id}`);
      setTodos(todos.filter((todo) => todo.id !== id)); // remove from state
    } catch (error) {
      console.error("Error deleting todo", error);
    }
  };


  // Edit mode
  const handleEdit = (todo) => {
    setEditingId(todo.id);
    setEditedTitle(todo.taskName);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedTitle("");
  };

  // Save edited todo
  const handleSave = async (id) => {
    try {
      const response = await axios.put(`http://localhost:8080/api/tasks/update/${id}`, {
        ...todos.find((t) => t.id === id),
        taskName: editedTitle
      });

      setTodos(todos.map((t) => (t.id === id ? response.data : t)));
      setEditingId(null);
      setEditedTitle("");
    } catch (error) {
      console.error("Error updating task", error);
    }
  };

  const toggleComplete = async (id) => {
    try {
      const todoToUpdate = todos.find(todo => todo.id === id);
      const response = await axios.put(`http://localhost:8080/api/tasks/update/${id}`, {
        ...todoToUpdate,
        completed: !todoToUpdate.completed
      });

      setTodos(todos.map(todo =>
        todo.id === id ? response.data : todo
      ));
    } catch (error) {
      console.error("Error updating task status", error);
    }
  };

  return (
    <div className={`todo-container ${darkMode ? 'dark-mode' : ''}`}>
      <div className="header-section">
        <h1 className="todo-title">My ToDo List</h1>
        <button
          className="dark-mode-toggle"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>

      {/* Add task */}
      <div className="input-section">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter new task"
        />
        <button onClick={addTodo}>Add</button>
      </div>

      {/* Todo list */}
      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
            {editingId === todo.id ? (
              <>
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                />

                <div className="todo-buttons">
                  {/* <button onClick={() => handleSave(todo.id)}>Save</button> */}
                  <button onClick={() => handleSave(todo.id)} className="icon-button"><MdSave /></button>
                  {/* <button onClick={handleCancel}>Cancel</button> */}
                  <button onClick={handleCancel} className="icon-button"><FaTimes/></button>
                </div>
              </>
            ) : (
              <>
                <div className="checkbox-container">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleComplete(todo.id)}
                  />
                  <span className={`todo-title-text ${todo.completed ? 'completed' : ''}`}>
                    {todo.taskName}
                  </span>
                </div>

                <div className="todo-buttons">
                  <button onClick={() => handleEdit(todo)} className="icon-button">
                    <MdEdit />
                  </button>
                  <button onClick={() => deleteTodo(todo.id)} className="icon-button">
                    <FaTrashAlt />
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>


    </div>
  );
}

export default TodoList;
