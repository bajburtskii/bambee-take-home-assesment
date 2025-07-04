import UpdateTaskService from '../../src/services/tasks/UpdateTaskService';
import DbException from '../../src/exceptions/DbException';
import TaskNotFoundException from '../../src/exceptions/TaskNotFoundException';
import UserExistsException from '../../src/exceptions/UserExistsException';
import TasksRepository from '../../src/repositories/TasksRepository';
import CheckIfTaskCanBeAccessedService from '../../src/services/tasks/CheckIfTaskCanBeAccessedService';
import TaskStatusEnum from '../../src/enums/TaskStatusEnum';
import { Request } from 'express';
import AccessForbiddenException from '../../src/exceptions/AccessForbiddenException';

describe(UpdateTaskService.name, () => {
  const id = 1;
  const name = 'name';
  const description = 'description';
  const dueDate = 1;
  const status = TaskStatusEnum.TODO;
  const isDeleted = 0;
  const task = { id };
  const user = {};

  const req = {
    params: { id },
    body: { name, description, dueDate, status, isDeleted },
    user,
  } as unknown as Request;

  const tasksRepository = new TasksRepository();
  const checkIfTaskCanBeAccessedService = new CheckIfTaskCanBeAccessedService();
  const updateTaskService = new UpdateTaskService(tasksRepository, checkIfTaskCanBeAccessedService);

  describe('handle', () => {
    describe('when tasksRepository.getOneById fails', () => {
      it('should throw DbException', async () => {
        tasksRepository.getOneById = jest.fn().mockImplementation(() => {
          throw new DbException('');
        });
        checkIfTaskCanBeAccessedService.handle = jest.fn().mockResolvedValue('');
        tasksRepository.update = jest.fn().mockResolvedValue('');

        await expect(updateTaskService.handle(req)).rejects.toBeInstanceOf(DbException);

        expect(jest.spyOn(tasksRepository, 'getOneById')).toHaveBeenCalledWith(id);
        expect(jest.spyOn(checkIfTaskCanBeAccessedService, 'handle')).toHaveBeenCalledTimes(0);
        expect(jest.spyOn(tasksRepository, 'update')).toHaveBeenCalledTimes(0);
      });
    });

    describe('when task is not found', () => {
      it('should throw TaskNotFoundException', async () => {
        tasksRepository.getOneById = jest.fn().mockResolvedValue(null);
        checkIfTaskCanBeAccessedService.handle = jest.fn().mockResolvedValue('');
        tasksRepository.update = jest.fn().mockResolvedValue('');

        await expect(updateTaskService.handle(req)).rejects.toBeInstanceOf(TaskNotFoundException);

        expect(jest.spyOn(tasksRepository, 'getOneById')).toHaveBeenCalledWith(id);
        expect(jest.spyOn(checkIfTaskCanBeAccessedService, 'handle')).toHaveBeenCalledTimes(0);
        expect(jest.spyOn(tasksRepository, 'update')).toHaveBeenCalledTimes(0);
      });
    });

    describe('when task cant be accessed', () => {
      it('should throw AccessForbiddenException', async () => {
        tasksRepository.getOneById = jest.fn().mockResolvedValue(task);
        checkIfTaskCanBeAccessedService.handle = jest.fn().mockReturnValue(false);
        tasksRepository.update = jest.fn().mockResolvedValue('');

        await expect(updateTaskService.handle(req)).rejects.toBeInstanceOf(AccessForbiddenException);

        expect(jest.spyOn(tasksRepository, 'getOneById')).toHaveBeenCalledWith(id);
        expect(jest.spyOn(checkIfTaskCanBeAccessedService, 'handle')).toHaveBeenCalledWith(task, user);
        expect(jest.spyOn(tasksRepository, 'update')).toHaveBeenCalledTimes(0);
      });
    });

    it('handles', async () => {
      tasksRepository.getOneById = jest.fn().mockResolvedValue(task);
      checkIfTaskCanBeAccessedService.handle = jest.fn().mockReturnValue(true);
      tasksRepository.update = jest.fn().mockResolvedValue('');

      await expect(updateTaskService.handle(req)).resolves.toBeUndefined();

      expect(jest.spyOn(tasksRepository, 'getOneById')).toHaveBeenCalledWith(id);
      expect(jest.spyOn(checkIfTaskCanBeAccessedService, 'handle')).toHaveBeenCalledWith(task, user);
      expect(jest.spyOn(tasksRepository, 'update')).toHaveBeenCalledWith(id, {
        name,
        description,
        dueDate,
        status,
        isDeleted,
      });
    });
  });
});
