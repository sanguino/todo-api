import { Router } from 'express';
import TasksController from '../controllers/TasksController';

function getRoutes() {
  const routes = Router();
  routes.get('/task', TasksController.retrieveAllTasks);
  routes.get('/task/:id', TasksController.retrieveTasksById);
  routes.post('/task', TasksController.createTask);
  routes.put('/task/:id', TasksController.updateTask);
  routes.delete('/task/:id', TasksController.deleteTask);
  return routes;
}

export default getRoutes();
