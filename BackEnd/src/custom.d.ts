export interface IUserReqParam {
  email: string;
  first_name: string;
  last_name: string;
  id: number;

}

declare global {
  namespace Express {
    export interface Request {
      user?: IUserReqParam;
    }
  }
}
