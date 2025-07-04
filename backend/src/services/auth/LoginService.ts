import UsersRepository from '../../repositories/UsersRepository';
import CredentialsInvalidException from '../../exceptions/CredentialsInvalidException';
import CheckIfPasswordIsValidService from './CheckIfPasswordIsValidService';
import GenerateAccessTokenService from './GenerateAccessTokenService';
import { Request } from 'express';

class LoginService {
  constructor(
    private readonly usersRepository = new UsersRepository(),
    private readonly checkIfPasswordIsValidService = new CheckIfPasswordIsValidService(),
    private readonly generateAccessTokenService = new GenerateAccessTokenService(),
  ) {}

  public async handle(req: Request): Promise<{ accessToken: string }> {
    const { email, password } = req.body;

    const user = await this.usersRepository.getOneByEmail(email);

    if (!user) {
      throw new CredentialsInvalidException();
    }

    const passwordIsValid = await this.checkIfPasswordIsValidService.handle(user, password);

    if (!passwordIsValid) {
      throw new CredentialsInvalidException();
    }

    const { id } = user;
    const accessToken = this.generateAccessTokenService.handle(id);

    return { accessToken };
  }
}

export default LoginService;
