import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import dotenv from 'dotenv';
import cors from 'cors';
import indexRouter from './routes/index';
import courseRoute from './routes/course.route';
import userRoute from './routes/user.route';
import sequelize from './models/db';

dotenv.config();
sequelize.sync();
var app = express();

const corsOption = {
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  exposedHeaders: ['x-auth-token'],
};
app.use(cors(corsOption));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
app.use('/courses', courseRoute);
app.use('/user', userRoute);
app.use('/', indexRouter);

var port = process.env.PORT || 8080;

app.listen(port, function () {
  console.log('Example app listening on port ' + port + '!');
});

export default app;
