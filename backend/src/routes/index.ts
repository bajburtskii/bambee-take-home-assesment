/// <reference path="../types/express/index.d.ts" />
import express, { Request, Response, Router } from 'express';
import GetUserTasksService from '../services/tasks/GetUserTasksService';
import CreateTaskService from '../services/tasks/CreateTaskService';
import { body, param } from 'express-validator';
import checkExpressValidationMiddleware from '../middlewares/checkExpressValidationMiddleware';
import UpdateTaskService from '../services/tasks/UpdateTaskService';
import LoginService from '../services/auth/LoginService';
import authenticateMiddleware from '../middlewares/authenticateMiddleware';
import TaskStatusEnum from '../enums/TaskStatusEnum';
import GetAIGeneratedUserTasksService from '../services/tasks/GetAIGeneratedUserTasksService';

const router = express.Router();

const auth = Router();
auth.post(
  '/login',
  [
    body('email')
      .isEmail()
      .withMessage('Valid email is required')
      .isLength({ max: 100 })
      .withMessage('Name must not exceed 100'),
    body('password')
      .isString()
      .trim()
      .notEmpty()
      .withMessage('Password is required')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long'),
  ],
  async (req: Request, res: Response) => {
    try {
      const token = await new LoginService().handle(req);
      res.json(token);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'Failed to login' });
    }
  },
);

const tasks = Router();
tasks.get('/', authenticateMiddleware, async (req, res) => {
  try {
    const { userId } = req.user!;
    const tasks = await new GetUserTasksService().handle(userId);
    res.json(tasks);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch user tasks' });
  }
});

tasks.get('/generated', authenticateMiddleware, async (req, res) => {
  try {
    // todo @team - in case you jus like me either
    //  hit OpenAI quota limits OR
    //  dont want to spend time searching for an API key
    //  use the commented service - it's generating tasks without OpenAI
    // const tasks = GetGeneratedUserTasksService.generateTasks();
    const tasks = await new GetAIGeneratedUserTasksService().handle();

    res.json(tasks);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch user tasks' });
  }
});

tasks.post(
  '/',
  [
    body('name')
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('Name is required')
      .isString()
      .withMessage('Name must be a string')
      .trim(),

    body('description').optional().isString().withMessage('Description must be a string').trim(),

    body('dueDate').optional().isInt({ min: 0 }).withMessage('Due date must be a valid UNIX timestamp'),

    body('status')
      .optional()
      .isIn([TaskStatusEnum.TODO, TaskStatusEnum.DONE])
      .withMessage('Status must be one of: todo, done'),
  ],
  checkExpressValidationMiddleware,
  authenticateMiddleware,
  async (req: Request, res: Response) => {
    try {
      const task = await new CreateTaskService().handle(req);
      res.status(201).json(task);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'Failed to create task' });
    }
  },
);

tasks.put(
  '/:id',
  [
    param('id').isInt().withMessage('Task ID must be an integer'),
    body('name').optional().isString().withMessage('Name must be a string').trim(),

    body('description').optional().isString().withMessage('Description must be a string').trim(),

    body('dueDate').optional().isInt({ min: 0 }).withMessage('Due date must be a valid UNIX timestamp'),

    body('status')
      .optional()
      .isIn([TaskStatusEnum.TODO, TaskStatusEnum.DONE])
      .withMessage('Status must be one of: todo, done'),

    body('isDeleted').optional().isBoolean().withMessage('isDeleted must be a boolean'),
  ],
  checkExpressValidationMiddleware,
  authenticateMiddleware,
  async (req: Request, res: Response) => {
    try {
      await new UpdateTaskService().handle(req);

      res.status(204).json({});
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'Failed to update task' });
    }
  },
);

router.use('/auth', auth);
router.use('/tasks', tasks);

export default router;
