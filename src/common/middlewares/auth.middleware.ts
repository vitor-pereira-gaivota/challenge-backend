import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { UsersRepository } from 'src/modules/users/user.repository';

interface TokenData {
  id: number;
  iat: number;
  exp: number;
  iss: string;
  sub: string;
}

const roles = ['basic', 'super'];

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly usersRepository: UsersRepository) {}

  async use(req: any, res: any, next: (error?: any) => void) {
    const authHeaders = req.headers.authorization;
    if (authHeaders && (authHeaders as string).split(' ')[1]) {
      const token = (authHeaders as string).split(' ')[1];
      const decoded = jwt.decode(token) as TokenData;

      const user = await this.usersRepository.findById(decoded.id);

      if (!user) {
        throw new HttpException('Not authorized.', HttpStatus.UNAUTHORIZED);
      }

      req.user = {
        id: user.id,
        role: roles[user.profile],
      };
      next();
    } else {
      throw new HttpException('Not authorized.', HttpStatus.UNAUTHORIZED);
    }
  }
}
