import TaskStatusEnum from '../enums/TaskStatusEnum';

type TaskType = {
  id: number;
  name: string;
  description: string | null;
  status: TaskStatusEnum | null;
  ownerId: number;
  dueDate: number;
  isDeleted: 0 | 1;
};

export default TaskType;
