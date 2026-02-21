import { UserResponseDto } from '../dto/user-response.dto';
import { UserEntity } from '../entities/user.entity';

export const mapUserEntityToResponseDto = (
  user: UserEntity,
): UserResponseDto => {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};
