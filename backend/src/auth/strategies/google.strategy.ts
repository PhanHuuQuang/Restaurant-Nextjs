import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth2';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class GoogleOauthStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      clientID: config.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: config.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: '/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: {
      id: string;
      emails: { value: string }[];
      displayName: string;
      photos: { value: string }[];
    },
  ) {
    const { id, emails, displayName, photos } = profile;
    const email = emails[0].value;

    const user = await this.prisma.user.upsert({
      where: { email },
      update: {
        name: displayName,
        image: photos[0]?.value,
        provider: 'google',
      },
      create: {
        email,
        name: displayName,
        image: photos[0]?.value,
        provider: 'google',
      },
      select: { id: true, name: true, email: true, role: true },
    });

    return user;
  }
}
