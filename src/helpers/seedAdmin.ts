import { IUser } from '../app/modules/user/user.interface';
import { User } from '../app/modules/user/user.model';
import { USER_ROLES } from '../enums/user';

export const seedAdmin = async () => {
  const isExistAdmin = await User.findOne({ role: USER_ROLES.ADMIN });
  if (isExistAdmin) return;
  const admin: IUser = {
    name: 'Admin',
    email: 'hitekbd@gmail.com',
    password: 'password',
    phone: '+8801942374953',
    role: USER_ROLES.ADMIN,
    location: 'unknown',
    address: 'unknown',
    verified: true,
    status: 'active',
  };

  const createUser = await User.create(admin);
  if (createUser) {
    console.log('Problem creating admin');
    return;
  }
  return;
};
