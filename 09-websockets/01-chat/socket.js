const socketIO = require('socket.io');

const Session = require('./models/Session');
const Message = require('./models/Message');

const mapUser = require('./mappers/user')

function socket(server) {
  const io = socketIO(server, {allowEIO3: true});

  io.use(async (socket, next) => {
    const token = socket.handshake.query.token;

    if (!token) next(new Error('anonymous sessions are not allowed'));

    const session = await Session.findOne({token: socket.handshake.query.token}).populate('user');

    if (!session) next(new Error('wrong or expired session token'));

    socket.user = mapUser(session.user);
    next();
  });

  io.on('connection', socket => {
    socket.on('message', async (msg) => {
      const message = new Message({
        text: msg,
        date: Date.now(),
        chat: socket.user.id,
        user: socket.user.displayName,
      });

      await message.save();
    });

    socket.on('disconnect', ()=> {
      console.log('disconnect ' + socket.id)
    })
  });

  return io;
}

module.exports = socket;
