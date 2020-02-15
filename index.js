const express = require('express');
const server = express();
const projects = [];

server.use(express.json());

const getProjectById = id => projects.find(project => project.id === id);

// middlewares
function checkExist(req, res, next) {
  const { id } = req.params;

  if (getProjectById(id)) {
    return next();
  }

  return res.status(400).json({ error: 'Project not found' });
}

server.use((req, res, next) => {
  console.count('Requests');
  return next();
})

server.get('/projects', (req, res) => {
  return res.json(projects);
});

server.post('/projects', (req, res) => {
  const project = req.body;

  if (!getProjectById(project.id)) {
    project.tasks = [];
    projects.push(project);
    return res.json(project);
  }

  return res.status(400).json({ error: 'Project ID already registered' });
});

server.put('/projects/:id', checkExist, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const project = getProjectById(id);

  project.title = title;
  return res.json(project);
});

server.delete('/projects/:id', checkExist, (req, res) => {
  const { id } = req.params;
  const index = projects.findIndex(project => project.id === id);

  projects.splice(index, 1);
  return res.json('Project removed!');
});

server.post('/projects/:id/tasks', checkExist, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const project = getProjectById(id);

  project.tasks.push(title);
  return res.json(project);
});

server.listen(3000);
