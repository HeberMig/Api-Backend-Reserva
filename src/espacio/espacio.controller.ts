import { Body, Controller, Post, Get, Param, Put, Delete } from '@nestjs/common';
import { EspacioService } from './espacio.service';
import { CreateSpaceDto } from 'src/dto/create-space.dto';
import { Space } from 'src/schemas/space.schema';
import { UpdateSpaceDto } from 'src/dto/update-space.dto';

@Controller('espacio')
export class EspacioController {
    constructor(private readonly espacioService: EspacioService) {}

    @Post()
    create(@Body() createSpaceDto: CreateSpaceDto): Promise<{message: string, space: Space}>{
        return this.espacioService.create(createSpaceDto);
    }

    @Get()
    findAll(): Promise<Space[]>{
        return this.espacioService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string): Promise<Space> {
        return this.espacioService.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: string, 
    @Body() updateSpaceDto: UpdateSpaceDto,
    ): Promise<{ message: string, space: Space}>{
    return this.espacioService.update(id, updateSpaceDto, )
    }

    @Delete(':id')
    remove(@Param('id') id: string): Promise<{ message: string}>{
        return this.espacioService.remove(id);
    }
}

