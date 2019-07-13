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

        const retrieveAllTasks = async () =>
          dbInstance
            .collection('tasks')
            .find({}, FILTER)
            .toArray();

        const retrieveTasksById = async data => dbInstance.collection('tasks').findOne({ id: data.id }, FILTER);

        const createTask = async data => dbInstance.collection('tasks').insertOne({ ...data, completed: false });

        const updateTask = async data =>
          dbInstance.collection('tasks').updateOne({ id: data.id }, { $set: { completed: data.completed } });

        const deleteTask = async data => {
          const res = await dbInstance.collection('tasks').deleteOne({ id: data.id });
          return res;
        };

        resolve({
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
