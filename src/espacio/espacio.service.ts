import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Space, SpaceDocument } from '../schemas/space.schema';
import { CreateSpaceDto } from 'src/dto/create-space.dto';
import { UpdateSpaceDto } from 'src/dto/update-space.dto';

@Injectable()
export class EspacioService {
    constructor(@InjectModel(Space.name) private spaceModel: Model<SpaceDocument>
    ) {}
    //Crear espacio
    async create(createSpaceDto: CreateSpaceDto): Promise<{ message: string, space: Space}>{
        const existingSpace = await this.spaceModel.findOne({ name: createSpaceDto.name}).exec();
        if (existingSpace) {
            throw new ConflictException(`Ya existe un espacio con el nombre de ${createSpaceDto.name}`);
        }
        const createdSpace = await this.spaceModel.create(createSpaceDto);
        return { 
            message: `Espacio '${createSpaceDto.name}' ha sido creado exitosamente`,
            space: createdSpace
        };
    }
    //Obtener todos los espacios
    async findAll(): Promise<Space[]>{
        return this.spaceModel.find().exec();
    }
    //Obtener un id es especficio
    async findOne(id: string): Promise<Space> {
        const space = await this.spaceModel.findById(id).exec();
        if (!space){
            throw new NotFoundException(`El espacio buscado con id ${id} no encontrado`);
        }
        return space;
    }

    //Actualizar un espacio
    async update(id: string, updateSpaceDto: UpdateSpaceDto): Promise<{ message: string, space: Space }> {
        if (updateSpaceDto.name){
            const existingSpace = await this.spaceModel.findOne({ name: updateSpaceDto.name }).exec();
            //if (existingSpace && existingSpace._id.toString() !== id)
            if (existingSpace && existingSpace._id !== id) {
                throw new ConflictException(`Ya existe un espacio con el nonmbre de ${updateSpaceDto.name}`)
        }
    }
        const updateSpace = await this.spaceModel.findByIdAndUpdate(id, updateSpaceDto, { new: true}).exec()
        if (!updateSpace){
            throw new NotFoundException(`Espacio con id ${id} no encontrado`);
        }
        return {
            message: `Espacio con id ${id} ha sido actualizado correctamente.`,
            space: updateSpace,
        };
    }
    //Eliminar espacio
    async remove(id: string): Promise<{ message: string}> {
        const deleteSpace = await this.spaceModel.findByIdAndDelete(id).exec();
        if (!deleteSpace){
            throw new NotFoundException(`Espacio con id ${id} no encontrado`);
        }
        return {
            message: `Espacio con id ${id} ha sido eliminado exitosamente`,
        };
    }
}
