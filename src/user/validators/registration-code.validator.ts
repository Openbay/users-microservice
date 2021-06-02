import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';
import { getManager } from 'typeorm';

import { Injectable } from '@nestjs/common';

import { UsersService } from '../services/users.service';

@ValidatorConstraint({ name: 'isRegistrationCode', async: true })
@Injectable()
export class RegistrationCodeValidator implements ValidatorConstraintInterface {
  constructor(protected readonly usersService: UsersService) {}
  async validate(activationCode: string) {
    const user = await getManager().transaction(
      async (manager) => await this.usersService.findBy(manager, { activationCode })
    );
    return !!user;
  }

  defaultMessage() {
    return 'Activation code not valid.';
  }
}

export function IsRegistrationCode(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsRegistrationCode',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: RegistrationCodeValidator
    });
  };
}
