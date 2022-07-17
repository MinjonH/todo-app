import React, {useState} from 'react'
import './App.css';


function App() {

  const [todos, setTodos] = useState([])
  const [todo, setTodo] = useState('')

  function handleSubmit(e) {
    e.preventDefault()

    const newTodo = {
      id: new Date().getTime(),
      text: todo,
      completed: false,
    }
    setTodos([...todos].concat(newTodo))
    setTodo('')
  }

  function deleteTodo(id) {
    const updatedTodos = [...todos].filter((todo)=> todo.id !== id)

    setTodos(updatedTodos)
  }

  function toggleComplete(id) {
    const updatedTodos = [...todos].map((todo)=> {
      if(todo.id === id){
        todo.completed = !todo.completed
      }
      return todo
    })
    setTodos(updatedTodos)
  }

  return (
    <div id="todo-list">
      <h1>Todo List</h1>
      <form onSubmit={handleSubmit}>
        <input type='text' onChange={(e)=> setTodo(e.target.value)} value={todo} />
        <button type='submit'>Add Todo</button>
      </form>

      {todos.map((todo) => 
        <div key={todo.id} className="todo">
        <div className='todo-text'>
          <input
          type='checkbox'
          id='completed'
          onChange={() => toggleComplete(todo.id)}
          checked={todo.completed} />
          <div>{todo.text}</div>
        </div>
        <div className='todo-actions'>
          <button onClick={()=> deleteTodo(todo.id)}>Delete</button>
        </div>
        
      </div>)}
    </div>
  );
}

export default App;
