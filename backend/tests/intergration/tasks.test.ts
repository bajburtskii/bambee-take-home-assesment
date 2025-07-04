import { NextFunction, Request, Response } from 'express';
jest.mock('../../src/middlewares/authenticateMiddleware', () => (req: Request, res: Response, next: NextFunction) => {
  req.user = { userId: 123 };
  next();
});

import GetUserTasksService from '../../src/services/tasks/GetUserTasksService';
import TaskType from '../../src/types/TaskType';

import request from 'supertest';
import app from '../../src/app';

describe('GET /tasks', () => {
  it('should return a list of tasks', async () => {
    const users = [{}, {}] as TaskType[];

    jest.spyOn(GetUserTasksService.prototype, 'handle').mockResolvedValueOnce(users);

    const response = await request(app).get('/tasks');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toStrictEqual(users);
  });

  it('should return error', async () => {
    jest.spyOn(GetUserTasksService.prototype, 'handle').mockImplementationOnce(() => {
      throw new Error();
    });

    const response = await request(app).get('/tasks');

    expect(response.status).toBe(500);
  });
});
