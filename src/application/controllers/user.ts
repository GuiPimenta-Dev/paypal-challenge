import { CreateUser } from "../../usecases/create-user";
import { Created } from "../../utils/http/created";
import { HttpInput } from "../../ports/http/http-client";
import { config } from "../../config";

export class UserController {
  static async create(input: HttpInput): Promise<Created> {
    const { body } = input;
    const usecase = new CreateUser(config.usersRepository);
    const response = await usecase.execute(body);
    return new Created(response);
  }
}
