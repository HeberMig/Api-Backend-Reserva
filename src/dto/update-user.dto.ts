import { IsString, IsOptional, IsEmail } from "class-validator";
export class UpdateUserDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsEmail()
    @IsOptional()
    email?: string;
    
    @IsString()
    @IsOptional()
    password?: string;
    
    @IsString()
    @IsOptional()
    rol?: string;

}