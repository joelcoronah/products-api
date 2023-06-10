export type CreateResponse = {
  data: any;
  emailSubject: string;
  emailTemplate: string;
};

export enum AuthProvider {
  apple = 'apple',
  email = 'email',
  facebook = 'facebook',
  google = 'google',
}

export type UserLoginResponse = {
  id: number;
  authId: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  lastLogin: Date;
  firstLogin: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
};
