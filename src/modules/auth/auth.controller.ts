import { Body, Controller, Post, Request } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  async login(@Body() authCredentialsDto: any) {
    console.log({ authCredentialsDto });

    const token = await this.authService.signin(authCredentialsDto);

    return {
      data: { token },
      statusCode: 'USER_LOGGED_IN',
      message: 'User logged in successfully',
    };
  }
}
