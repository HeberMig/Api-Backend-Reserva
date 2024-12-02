import { IsString, IsBoolean, IsInt, Min, Max, IsOptional } from "class-validator";
export class UpdateSpaceDto{
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsBoolean()
    @IsOptional()
    availability?: boolean;

    @IsString()
    @IsOptional()
    location?: string;
    
    @IsInt()
    @Min(1)
    @Max(100)
    @IsOptional()
    capacity?: number;
}