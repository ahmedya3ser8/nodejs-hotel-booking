import { NextFunction, Request, Response } from "express"

const globalError = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV === 'development') {
    errorDevelopment(err, res);
  } else {
    errorProduction(err, res);
  }
}

const errorDevelopment = (err: any, res: Response) => {
  res.status(400).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  })
}

const errorProduction = (err: any, res: Response) => {
  res.status(400).json({
    status: err.status,
    message: err.message
  })
}

export default globalError;
