import Boom from '@hapi/boom';
import debugLib from 'debug';
import { checkId, checkIdAndCompleted, checkIdAndText } from '../utils/validateRequest';
import DataInterface from './DataInterface';

const debug = debugLib('todo-api:express:controller');

class TasksController {
  static async retrieveHealth(req, res, next) {
    const dataInterface = await DataInterface.mongoConnect();
    const health = dataInterface.retrieveHealth();
    debug('health', health);
    if (!health) {
      return next(Boom.internal());
    }
    return res.sendStatus(200);
  }

  static async retrieveAllTasks(req, res, next) {
    const dataInterface = await DataInterface.mongoConnect();
    let data;
    try {
      data = await dataInterface.retrieveAllTasks();
    } catch (err) {
      return next(Boom.internal(err));
    }
    debug('response', data);
    if (data === null) {
      return res.json([]);
    }
    return res.json(data);
  }

  static async retrieveTasksById(req, res, next) {
    await checkId(req.params.id).catch(err => next(Boom.badRequest(err)));

    const dataInterface = await DataInterface.mongoConnect();
    let data;
    try {
      data = await dataInterface.retrieveTasksById({
        id: req.params.id,
      });
    } catch (err) {
      return next(Boom.internal(err));
    }

    if (data === null) {
      return next(Boom.notFound('invalid id'));
    }
    return res.json(data);
  }

  static async createTask(req, res, next) {
    await checkIdAndText(req.body).catch(err => next(Boom.badRequest(err)));

    const dataInterface = await DataInterface.mongoConnect();
    let data;
    try {
      data = await dataInterface.createTask({
        id: req.body.id,
        text: req.body.text,
      });
    } catch (err) {
      return next(Boom.internal(err));
    }
    debug('response', data);
    return res.sendStatus(200);
  }

  static async updateTask(req, res, next) {
    await checkIdAndCompleted(req.params.id, req.body).catch(err => next(Boom.badRequest(err)));

    const dataInterface = await DataInterface.mongoConnect();
    let data;
    try {
      data = await dataInterface.updateTask({
        id: req.params.id,
        completed: req.body.completed,
      });
    } catch (err) {
      return next(Boom.internal(err));
    }
    debug('response', data);
    return res.sendStatus(200);
  }

  static async deleteTask(req, res, next) {
    await checkId(req.params.id).catch(err => next(Boom.badRequest(err)));

    const dataInterface = await DataInterface.mongoConnect();
    let data;
    try {
      data = await dataInterface.deleteTask({
        id: req.params.id,
      });
    } catch (err) {
      return next(Boom.internal(err));
    }

    debug('response', data);
    return res.sendStatus(200);
  }
}

export default TasksController;
