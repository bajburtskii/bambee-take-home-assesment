import TaskType from './TaskType';

type GeneratedTaskType = Pick<TaskType, 'name' | 'description'>;

export default GeneratedTaskType;
