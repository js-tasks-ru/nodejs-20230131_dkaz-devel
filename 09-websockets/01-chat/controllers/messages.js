const Message = require('../models/Message');

const mapMessage = require('../mappers/message')

module.exports.messageList = async function messages(ctx, next) {
  const messages = await Message.find({
    chat: ctx.user._id
  })
  .sort('date')
  .limit(20)

  ctx.body = {messages: messages.map(message => mapMessage(message))};
};
