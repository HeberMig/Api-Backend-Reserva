import { IsString, IsOptional, IsNotEmpty, IsEmail, IsIn } from 'class-validator';
export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;
    
    @IsString()
    @IsNotEmpty()
    password: string;
    
    @IsString()
    @IsOptional()
    @IsIn(['user','admin'])
    rol?: string;

}