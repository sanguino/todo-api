import { Router } from 'express';
import TasksController from '../controllers/TasksController';

function getRoutes() {
  const routes = Router();
  routes.get('/api/task', TasksController.retrieveAllTasks);
  routes.get('/api/task/:id', TasksController.retrieveTasksById);
  routes.post('/api/task', TasksController.createTask);
  routes.put('/api/task/:id', TasksController.updateTask);
  routes.delete('/api/task/:id', TasksController.deleteTask);
  return routes;
}

export default getRoutes();
