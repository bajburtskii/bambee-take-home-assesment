import TaskType from '../../types/TaskType';
import JwtPayloadType from '../../types/JwtPayloadType';

class CheckIfTaskCanBeAccessedService {
  public handle(task: TaskType, user: JwtPayloadType): boolean {
    const { ownerId } = task;
    const { userId } = user;

    const canBeAccessed = ownerId === userId;

    return canBeAccessed;
  }
}

export default CheckIfTaskCanBeAccessedService;
