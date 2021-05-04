const connection = require('./connection');

// Requisito-1
const create = async (date, nickname, chatMessage) => {
    const newMessage = await connection()
      .then((db) => db.collection('messages').insertOne({ date, nickname, chatMessage }));
    return (newMessage.ops[0]);
  };

  module.exports = {
    create,
  };  