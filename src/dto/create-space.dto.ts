import { IsString, IsNotEmpty, IsBoolean, IsInt, Min, Max } from "class-validator";
export class CreateSpaceDto{
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsBoolean()
    availability: boolean;

    @IsString()
    location: string;
    
    @IsInt()
    @Min(1)
    @Max(100)
    capacity: number;
}