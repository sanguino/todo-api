import chai from 'chai';
import sinon from 'sinon';
import chaiAsPromised from 'chai-as-promised';
import { MongoClient } from 'mongodb';
import DataInterface from '../../lib/controllers/DataInterface';

const { expect } = chai;
chai.use(chaiAsPromised);

const task1Mock = { id: '1', text: 'buy milk', completed: true };
const task2Mock = { id: '2', text: 'buy beer', completed: false };
const findMock = { toArray: () => [task1Mock, task2Mock] };

describe('DataInterface', () => {
  let sandbox;
  let createDBResposeFixture;

  before(() => {
    sandbox = sinon.createSandbox({});
    createDBResposeFixture = () => {
      const collectionStub = sandbox.stub();
      collectionStub.withArgs('tasks').returns({
        createIndex: sandbox.stub().resolves(),
        find: sandbox.stub().returns(findMock),
        findOne: sandbox.stub().returns(task1Mock),
        insertOne: sandbox.stub(),
        updateOne: sandbox.stub(),
        deleteTask: sandbox.stub(),
      });

      return {
        db: sandbox.stub().returns({
          createCollection: sandbox.stub().resolves(),
          collection: collectionStub,
        }),
      };
    };
    sinon.stub(process, 'env').value({
      MONGO_HOST: 'localhost',
      MONGO_PORT: '1111',
      MONGO_DB: 'db',
    });

    sandbox.stub(MongoClient, 'connect').callsFake((url, options, fn) => {
      fn(null, createDBResposeFixture());
    });
  });

  after(() => {
    sandbox.restore();
  });

  describe('when mongoConnect is called', () => {
    it('should return an object with retrieveAllTasks, retrieveTasksById, createTask, updateTask and deleteTask functions', () =>
      DataInterface.mongoConnect().then(di => {
        expect(di).to.have.property('retrieveAllTasks');
        expect(di.retrieveAllTasks).to.be.a('function');

        expect(di).to.have.property('retrieveTasksById');
        expect(di.retrieveTasksById).to.be.a('function');

        expect(di).to.have.property('createTask');
        expect(di.createTask).to.be.a('function');

        expect(di).to.have.property('updateTask');
        expect(di.updateTask).to.be.a('function');

        expect(di).to.have.property('deleteTask');
        expect(di.deleteTask).to.be.a('function');
      }));

    it('should return an array of tasks if mongo finds tasks', () =>
      DataInterface.mongoConnect().then(di => {
        expect(di.retrieveAllTasks()).to.eventually.eql([task1Mock, task2Mock]);
      }));
  });
});
