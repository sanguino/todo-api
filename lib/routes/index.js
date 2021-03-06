import { Router } from 'express';
import TasksController from '../controllers/TasksController';

function getRoutes() {
  const routes = Router();
  routes.get('/api/health/task', TasksController.retrieveHealth);
  routes.get('/api/task', TasksController.retrieveAllTasks);
  routes.get('/api/task/:id', TasksController.retrieveTasksById);
  routes.post('/api/task', TasksController.createTask);
  routes.put('/api/task/:id', TasksController.updateTask);
  routes.delete('/api/task/:id', TasksController.deleteTask);
  routes.all('*', (req, res) => {
    const resText = `req.originalUrl: ${req.originalUrl}, req.baseUrl: ${req.baseUrl}, req.path: ${req.path}`;
    return res.status(404).send(resText);
  });
  return routes;
}

export default getRoutes();
