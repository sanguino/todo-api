import { MongoClient } from 'mongodb';
import debugLib from 'debug';
import tasksSchema from '../utils/schemas';

const debug = debugLib('todo-api:mongo:interface');

let dbConnectionPromise;

const FILTER = { projection: { _id: 0 } };

export default class DataInterface {
  static async mongoConnect() {
    if (dbConnectionPromise) {
      return dbConnectionPromise;
    }

    const URI = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`;

    dbConnectionPromise = new Promise((resolve, reject) => {
      MongoClient.connect(URI, { useNewUrlParser: true }, async (err, db) => {
        if (err || db === null) {
          reject(err);
        }
        const dbInstance = db.db(process.env.MONGO_DB);
        debug(`Db connected ${process.env.MONGO_DB}`);
        await dbInstance.createCollection('tasks', tasksSchema);
        await dbInstance.collection('tasks').createIndex({ id: 1 }, { unique: true });
        debug('collection created');

        const retrieveHealth = () => (!dbInstance ? false : dbInstance.serverConfig.isConnected());

        const retrieveAllTasks = async username =>
          dbInstance
            .collection('tasks')
            .find({ username }, FILTER)
            .toArray();

        const retrieveTasksById = async (username, data) =>
          dbInstance.collection('tasks').findOne({ username, id: data.id }, FILTER);

        const createTask = async (username, data) =>
          dbInstance.collection('tasks').insertOne({ ...data, username, completed: false });

        const updateTask = async (username, data) =>
          dbInstance.collection('tasks').updateOne({ username, id: data.id }, { $set: { completed: data.completed } });

        const deleteTask = async (username, data) => {
          const res = await dbInstance.collection('tasks').deleteOne({ username, id: data.id });
          return res;
        };

        resolve({
          retrieveHealth,
          retrieveAllTasks,
          retrieveTasksById,
          createTask,
          updateTask,
          deleteTask,
        });
      });
    });

    return dbConnectionPromise;
  }
}
