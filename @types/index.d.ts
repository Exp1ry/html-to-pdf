export {};
declare global {
  namespace Express {
    export interface Request {
      appId: any;
    }
  }
}
