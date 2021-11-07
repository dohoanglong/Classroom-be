import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import indexRouter from './routes/index';
import customerRoute from './routes/customer.route';
import courseRoute from './routes/course.route'

var app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
app.use('/customers',customerRoute);
app.use('/courses',courseRoute);
app.use('/', indexRouter);

var port = process.env.PORT || 8080;

app.listen(port, function () {
  console.log('Example app listening on port ' + port + '!');
});

export default app;