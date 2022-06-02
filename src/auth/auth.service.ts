import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthCredentionalsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  extendedRepository = this.userRepository.extend({
    async createUser(
      authCredentionalsDto: AuthCredentionalsDto,
    ): Promise<void> {
      const { username, password } = authCredentionalsDto;

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
      const user = this.create({ username, password: hashedPassword });

      try {
        await this.save(user);
      } catch (error) {
        if (error.code === '23505') {
          throw new ConflictException('Username already exist');
        } else {
          throw new InternalServerErrorException();
        }
      }
    },
  });

  async singUp(authCredentionalsDto: AuthCredentionalsDto): Promise<void> {
    return this.extendedRepository.createUser(authCredentionalsDto);
  }

  async signIn(
    authCredentialsDto: AuthCredentionalsDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = authCredentialsDto;
    const user = await this.extendedRepository.findOne({ where: { username } });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { username };
      const accessToken: string = await this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }
}
