import { HttpException, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as ResponseMessage from './response.messages';
import { genPassword } from '../../utils/passwordGenerator';

@Injectable()
export class UserFirebase {
  async removeFirebaseUser(email: string): Promise<boolean> {
    try {
      const fbAuth = admin.auth();
      const fbUser = await fbAuth.getUserByEmail(email);
      await fbAuth.deleteUser(fbUser.uid);
      return true;
    } catch ({ message }) {
      const responseMessage = ResponseMessage.INTERNAL_SERVER_ERROR(message);
      throw new HttpException(responseMessage.message, responseMessage.status);
    }
  }

  async createFirebaseUser(firebaseUserData: { email: string; firstName: string }): Promise<any> {
    const { email, firstName } = firebaseUserData;
    const password: string = genPassword();
    const firebaseResponse: any = await admin
      .auth()
      .createUser({
        email,
        password,
        displayName: firstName,
      })
      .catch(({ message }) => {
        if (message.includes('already')) {
          throw new HttpException(
            ResponseMessage.USER_ALREADY_EXIST.message,
            ResponseMessage.USER_ALREADY_EXIST.status,
          );
        }
        const responseMessage = ResponseMessage.INTERNAL_SERVER_ERROR(message);
        throw new HttpException(responseMessage.message, responseMessage.status);
      });
    return { ...firebaseResponse, password };
  }
}
