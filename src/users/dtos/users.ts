
export enum Role {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER',
}
export interface Users {
    id: number;
    name: string;
    email: string;
    role: Role;
    createdAt: Date
    updatedAt: Date
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
}
