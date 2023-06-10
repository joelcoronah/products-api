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

      if (!fbUser) {
        return true;
      }
      await fbAuth.deleteUser(fbUser.uid);
      return true;
    } catch ({ message }) {
      console.error('Error deleting user in firebase:', message);
      const responseMessage = ResponseMessage.INTERNAL_SERVER_ERROR(message);
      throw new HttpException(responseMessage.message, responseMessage.status);
    }
  }

  async createFirebaseUser(firebaseUserData: {
    email: string;
    firstName: string;
    password: string;
  }): Promise<any> {
    const { email, firstName, password } = firebaseUserData;

    const generatedPassword = password ?? genPassword();

    const firebaseResponse: any = await admin
      .auth()
      .createUser({
        email,
        password: generatedPassword,
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
