export default {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['id', 'text', 'completed'],
      properties: {
        id: {
          bsonType: 'string',
          description: 'must be a string and is required',
        },
        text: {
          bsonType: 'string',
          description: 'must be a string and is required',
        },
        completed: {
          bsonType: 'bool',
          description: 'must be a boolean and is required',
        },
      },
    },
  },
};
