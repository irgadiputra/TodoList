export interface IUserReqParam {
  email: string;
  name: string;
  id: number;

}

declare global {
  namespace Express {
    export interface Request {
      user?: IUserReqParam;
    }
  }
}
