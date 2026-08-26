import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';

const userSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  image: true,
  role: true,
} as const;

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    private prisma: PrismaService,
  ) {}
  async register(dto: RegisterDto) {
    const exists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (exists) throw new ConflictException('Email already registered');

    const { password, ...rest } = dto;
    const user = await this.prisma.user.create({
      data: { ...rest, password: await bcrypt.hash(password, 10) },
      select: userSelect,
    });
    return this.signToken(user);
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user?.password || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.signToken(user);
  }

  async getProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: userSelect,
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateProfile(userId: number, dto: UpdateProfileDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) throw new NotFoundException('User not found');

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: dto,
      select: userSelect,
    });
    return updated;
  }

  signToken(user: { id: number; email: string; role: string }) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return { accessToken: this.jwt.sign(payload) };
  }
}
