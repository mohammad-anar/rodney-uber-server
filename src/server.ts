/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-undef */
/* eslint-disable no-console */
import colors from 'colors';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import app from './app';
import config from './config';
import { seedSuperAdmin } from './DB/seedAdmin';
import { socketHelper } from './helpers/socketHelper';
import { errorLogger, logger } from './shared/logger';
import cron from 'node-cron';
import axios from 'axios';

//uncaught exception
process.on('uncaughtException', error => {
  errorLogger.error('UnhandledException Detected', error);
  process.exit(1);
});
console.log(process.env.SUPER_ADMIN_EMAIL);
let server: any;
async function main() {
  try {
    mongoose.connect(config.database_url as string);
    logger.info(colors.green('🚀 Database connected successfully'));

    //Seed Super Admin after database connection is successful
    await seedSuperAdmin();

    const port =
      typeof config.port === 'number' ? config.port : Number(config.port);

    const host = config.ip_address || '0.0.0.0';

    server = app.listen(port, host, () => {
      logger.info(
        colors.yellow(`♻️  Application listening on ${host}:${port}`),
      );
    });

    const LIVE_URL =
      process.env.RENDER_URL || 'https://rodney-uber-server-crj2.onrender.com';

    cron.schedule('*/5 * * * *', async () => {
      try {
        const res = await axios.get(`${LIVE_URL}/`);
        console.log('Cron ping:', res.data);
      } catch (err) {
        console.error('Cron error:', err);
      }
    });

    //socket
    const io = new Server(server, {
      pingTimeout: 60000,
      cors: {
        origin: '*',
      },
    });
    socketHelper.socket(io);
    //@ts-ignore
    global.io = io;
  } catch (error) {
    console.log(error);
    errorLogger.error(colors.red('🤢 Failed to connect Database'));
  }

  //handle UnhandledRejection
  process.on('unhandledRejection', error => {
    if (server) {
      server.close(() => {
        errorLogger.error('UnhandledRejection Detected', error);
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });
}

main();

//SIGTERM
process.on('SIGTERM', () => {
  logger.info('SIGTERM IS RECEIVE');
  if (server) {
    server.close();
  }
});
