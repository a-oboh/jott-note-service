import { UserService } from "../userService";
import { User } from "../../entities/user";

interface EventUser {
  mainId: string;
  email: string;
  firstName: string;
  lastName: string;
  photoUrl: string | null;
  firebaseUuid: string | null;
  confirmationToken: string | null;
  resetCode: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export class AuthService {
  constructor(userSvc: UserService) {
    this.userService = userSvc;
  }
  private userService: UserService;

  async replicateUserEvent(userData: EventUser): Promise<User> {
    try {
      const newUser = new User();

      newUser.mainId = userData.mainId;
      newUser.email = userData.email;
      newUser.firstName = userData.firstName;
      newUser.lastName = userData.lastName;
      newUser.photoUrl = userData.photoUrl;
      newUser.firebaseUuid = userData.firebaseUuid;
      newUser.confirmationToken = userData.confirmationToken;
      newUser.resetCode = userData.resetCode;
      newUser.createdAt = userData.createdAt;
      newUser.updatedAt = userData.updatedAt;

      const user = await this.userService.createUser(newUser);

      return user;
    } catch (err) {
      throw err;
    }
  }
}
