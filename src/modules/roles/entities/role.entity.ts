import { BaseEntity } from 'src/common/entities/base.entity';
import { RoleCode } from 'src/common/enums/role-code.enum';
import { Column, Entity, OneToMany } from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';

@Entity('roles')
export class Role extends BaseEntity {
  @Column({ unique: true })
  roleName: string;

  @Column({ type: 'enum', enum: RoleCode, unique: true })
  roleCode: RoleCode;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
