import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import jwt from 'jsonwebtoken';
import debugLib from 'debug';
import routes from './routes/index';

const debug = debugLib('todo-api:express:app');
const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser());
app.use(cookieParser());
app.use(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  debug(authHeader);
  if (!authHeader || authHeader.split(' ')[0] !== 'Bearer') {
    return res.status(401).json({
      status: 401,
      message: 'unauthorized',
    });
  }
  const token = authHeader.split(' ')[1];
  debug(token);
  try {
    const decoded = await jwt.verify(token, process.env.SUPER_SECRET);
    debug(`decoded${decoded}`);
    req.username = decoded.username;
  } catch (e) {
    debug('decoding error');
    return res.status(500).json({
      status: 500,
      message: 'decode error',
    });
  }
  return next();
});

app.use('/', routes);

export default app;
