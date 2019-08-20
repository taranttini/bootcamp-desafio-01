const express = require('express');

const server = express();
server.use(express.json());

// vars
let countReq = 0;

const projects = [
  {id:1, title: 'tau', tasks: []},
  {id:3, title: 'lisa', tasks: []}
];

// functions middleware
function countTotalReq (req, res, next) {

    countReq++;

    console.log(req, `Total requisições global ${countReq}`);
  
    next();
}

function findProjectById(id) {

  return projects.find( q => q.id == id );

}

function checkProjectExists(req, res, next) {
  const {id} = req.params;

  const project = findProjectById( id );

  if (!project) {
    return res.status(400).send({ erro: 'Project not found' })
  }

  req.project = project;

  next();
}

// using middleware global
server.use(countTotalReq);

// server http routes
server.get('/projects', (req, res) => {
  return res.json(projects);
});

server.get('/projects/:id', checkProjectExists, (req, res) => {
  return res.json(req.project);
});

server.put('/projects/:id', checkProjectExists, (req, res) => {
  const {title} = req.body;

  req.project.title = title;

  return res.json(req.project);
});

server.delete('/projects/:id', (req, res) => {
  const {id} = req.params
  const projectIndex = projects.findIndex( q => q.id == id )

  projects.splice(projectIndex, 1);

  return res.json(projects);
});

server.post('/projects', (req, res) => {
  const {id, title} = req.body;

  const newProject = { id: id, title: title, tasks: [] };

  const project = findProjectById(id);

  if (project) {
    return res.status(400).json({'msg': 'project already exists'})
  }
  projects.push(newProject);

  return res.json(newProject);
});

server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
  const {title} = req.body;

  req.project.tasks.push(title);

  return res.json(projects);
});


server.listen(3001)