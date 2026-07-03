import { PasswordGeneratorServicePort, PasswordEvaluation } from "../../../domain/ports/PasswordGeneratorServicePort";

export class EvaluatePasswordUseCase {
  constructor(private passwordGeneratorService: PasswordGeneratorServicePort) {}

  execute(password: string): PasswordEvaluation {
    if (!password || password.length === 0) {
      throw new Error("La contraseña no puede estar vacía");
    }

    return this.passwordGeneratorService.evaluate(password);
  }
}