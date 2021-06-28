import { getRepository, Repository } from "typeorm";
import { User } from "../entities/user";
import { HttpError } from "../util/httpError";

export class UserService {
  constructor() {
    // this.userRepository = getRepository(User);
  }

  // private userRepository: Repository<User>;

  getUserById = (id: string) => {
    const userRepository = getRepository(User);

    const user = userRepository.findOne(id);

    if (!user) {
      throw new HttpError(`User with id: ${id} not found`, 404);
    }

    return user;
  };

  getUserByEmail = async (email: string) => {
    const userRepository = getRepository(User);

    const user = await userRepository.findOne({ email });

    if (user) {
      return user;
    }

    throw new HttpError(`User with email: ${email} not found`, 404);
  };

  createUser = async (data: User) => {
    const userRepository = getRepository(User);

    try {
      const user = userRepository.create(data);

      const savedUser = await userRepository.save(user);

      return (savedUser as unknown) as User;
    } catch (err) {
      throw new HttpError(err.message, 500);
    }
  };
}
