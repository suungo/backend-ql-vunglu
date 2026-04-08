import { Injectable } from '@nestjs/common';
import { RoleSeederService } from './role.seeder';

@Injectable()
export class SeederRunner {
  constructor(private readonly roleSeeder: RoleSeederService) {}

  async runAllSeeders() {
    await this.roleSeeder.seedRoles();
  }
}
