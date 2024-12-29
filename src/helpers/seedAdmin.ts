import { IUser } from '../app/modules/user/user.interface';
import { User } from '../app/modules/user/user.model';
import { USER_ROLES } from '../enums/user';

export const seedAdmin = async () => {
  const isExistAdmin = await User.find({ role: USER_ROLES.ADMIN });
  if (!isExistAdmin.length) {
    const admin: IUser = {
      name: 'Admin',
      email: 'hitekbd@gmail.com',
      password: 'password',
      phone: '+8801942374953',
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
