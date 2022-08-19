const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

 const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
const { username } = request.headers;

const user = users.find((user) => user.username === username);

// se nao existir um usuario ele vai mostrar a mensagem
if(!user){
  return response.status(400).json({ error: "usuario nao encontrado"});

}

//!!
request.user = user;

return next()

}
// criando o usuario
app.post('/users', (request, response) => {
  // Complete aqui
const { name, username } = request.body;

const usuarioJaExiste = users.find((users) => users.username === username);

if(usuarioJaExiste){
  return response.status(400).json({ error: "Usuario ja existe!"})
}

  const user = 
    { 
      id: uuidv4(), 
      name, 
      username, 
      todos: []
    
  }
  users.push(user);

  return response.status(201).json(user);
});
//retornar uma lista com todas as tarefas desse usuário.
app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;

  return response.json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // esse post cria as tarefas
  const {user} = request;
  const { title, deadline } = request.body;

//aqui ele verifica se a conta é valida
  


// Aqui cria a tarefa
  const todo = { 
    id: uuidv4(), 
    title,
    done: false, 
    deadline: new Date(deadline), 
    created_at: new Date()
  }


    // aqui ele insere dentro do user
  user.todos.push(todo);

  return response.status(201).json(todo);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { title, deadline } = request.body;
  const { id } = request.params;
  
  const todo = user.todos.find((todo) => todo.id === id);

  if(!todo){
    return response.status(404).json({ error: "lista nao encontrada"})
  }

  todo.title = title;
  todo.deadline = new Date(deadline);

  return response.status(201).json(todo);


});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { id } = request.params;
  

  const todo = user.todos.find((todo) => todo.id === id);

  if(!todo){
    return response.status(404).json({ error: "lista nao encontrada"})
  }

  todo.done = true;
  
  return   response.status(201).json(todo);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui

  const { user } = request;
  const { id } = request.params;

  const todoIndex = user.todos.findIndex((todo) => todo.id === id);
  

  if(todoIndex === -1){
    return response.status(404).json({error: 'todo nao encontrado' })
  }

  user.todos.splice(todoIndex, 1);
  
  return response.status(204).json();
});

module.exports = app;
