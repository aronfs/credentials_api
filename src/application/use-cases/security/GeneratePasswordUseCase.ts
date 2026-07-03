import {
  PasswordGeneratorServicePort,
  GeneratePasswordInput,
  GeneratedPassword,
} from "../../../domain/ports/PasswordGeneratorServicePort";

export class GeneratePasswordUseCase {
  constructor(private passwordGeneratorService: PasswordGeneratorServicePort) {}

  execute(input: GeneratePasswordInput): GeneratedPassword {
    if (input.length < 8 || input.length > 64) {
      throw new Error("La longitud debe estar entre 8 y 64 caracteres");
    }

    if (!input.includeUppercase && !input.includeLowercase && !input.includeNumbers && !input.includeSymbols) {
      throw new Error("Debe incluir al menos un tipo de caracter");
    }

    return this.passwordGeneratorService.generate(input);
  }
}