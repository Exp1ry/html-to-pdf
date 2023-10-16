import logger from "winston";
import Transport from "winston-transport";

const Colors = {
  info: "\x1b[36m" as any,
  error: "\x1b[31m" as any,
  warn: "\x1b[33m" as any,
  verbose: "\x1b[43m" as any,
};

class ConsoleLogger extends Transport {
  constructor() {
    super();
  }
  log(info: any, callback: any) {
    const {
      level,
      message,
      stack,
    }: {
      level: any;
      message: string;
      stack: string;
    } = info;

    console.log(
      //@ts-ignore
      `${Colors[level]}${level}\t${message}\x1b[0m`,
      stack ? "\n" + stack : ""
    );
    if (callback) {
      callback();
    }
  }
}

logger.configure({
  transports: [new ConsoleLogger()],
});

export default logger;
