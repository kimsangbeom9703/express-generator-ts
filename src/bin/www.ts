#!/usr/bin/env node

import dotenv from 'dotenv';
import debug from 'debug';
import http from 'http';
import app from '../app';

const env: string = process.env.NODE_ENV || 'development';
dotenv.config({ path: `./.env.${env}` });
console.log(`Running in ${env} mode`);

// 포트 설정
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// HTTP 서버 생성
const server = http.createServer(app);

// 서버 실행
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

// 포트를 정상화하는 함수
function normalizePort(val: string): number | string | boolean {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

// HTTP 서버 에러 처리
function onError(error: any): void {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
      ? `Pipe ${port}`
      : `Port ${port}`;

  // 특정 listen 에러 처리
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

// HTTP 서버가 리스닝 중일 때
function onListening() {
  const addr = server.address();
  if (addr) {
    const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    debug('Listening on ' + bind);
  }
}
