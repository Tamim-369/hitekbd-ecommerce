import { IUser } from '../app/modules/user/user.interface';
import { User } from '../app/modules/user/user.model';
import { USER_ROLES } from '../enums/user';

export const seedAdmin = async () => {
  const isExistAdmin = await User.findOne({ role: USER_ROLES.ADMIN });
  if (!isExistAdmin) {
    const admin: IUser = {
      name: 'Admin',
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: USER_ROLES.ADMIN,
      address: 'unknown',
      verified: true,
      status: 'active',
    };

    try {
      const createUser = await User.create(admin);
      if (!createUser) {
        console.log('Problem creating admin');
      } else {
        console.log('Admin created successfully');
      }
    } catch (error) {
      console.log('Error creating admin:', error);
    }
  } else {
    console.log('Admin already created');
  }
};
