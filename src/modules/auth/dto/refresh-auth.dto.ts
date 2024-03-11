import { IsNotEmpty, IsString } from "class-validator";

export class RefreshAuthDto {
  refreshToken: string;
}
