import 'dotenv/config'; // dotenv 설정
import createError from 'http-errors';
import express, {Request, Response, NextFunction} from 'express';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import indexRouter from './routes/index';
import usersRouter from './routes/users';

const app = express();

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

app.use(cors());

// 로깅 레벨 설정
const loggingLevel = process.env.LOGGING_LEVEL || 'dev'; // 기본값은 'dev'
app.use(logger(loggingLevel));

// 미들웨어 설정
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

// 라우터 설정
app.use('/', indexRouter);
app.use('/users', usersRouter);

// 404 처리 미들웨어
app.use(function (req: Request, res: Response, next: NextFunction) {
    next(createError(404));
});

// 에러 처리 미들웨어
app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
    // 로컬 변수 설정 (개발 환경에서만 상세 에러 제공)
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // 에러 페이지 렌더링
    res.status(err.status || 500);
    res.render('error');
});

export default app;
