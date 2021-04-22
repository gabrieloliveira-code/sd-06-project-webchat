const getPrefix = require('../utils/getMessagePrefix');

const sendMessage = async ({ nickname, chatMessage }, io) => {
  const prefix = getPrefix(nickname);
  const completeMessage = `${prefix}${chatMessage}`;
  io.emit('message', completeMessage);
};

module.exports = { sendMessage };