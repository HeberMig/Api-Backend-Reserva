import { Controller, Body, Get, Post, Delete, Param, Put, UseGuards, Request, UnauthorizedException, ConflictException, InternalServerErrorException, ForbiddenException } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { LoginUserDto } from 'src/dto/login-user.dto';
import { UpdateUserDto } from 'src/dto/update-user.dto';
import { Roles } from './guards/roles.decorador';
import { RolesGuard } from './guards/roles.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';


@Controller('usuario')//vamos a consumir el service
export class UsuarioController {
    constructor(private usuarioService: UsuarioService) {}

        //Registrar usuario 
        @Post('register')
        async register(@Body() createUserDto: CreateUserDto){
            try{
                return await this.usuarioService.register(createUserDto)
            }
            catch(error){
                if(error.code === 11000){
                throw new ConflictException('El usuario ya está en uso');
                }
                throw new InternalServerErrorException('Error al crear el usario');
            }
        }
        //Iniciar sesión o hacer login
        @Post('login')
        async login(@Body() loginUserDto : LoginUserDto){
            const user = await this.usuarioService.login(loginUserDto);
            if (!user){
                throw new UnauthorizedException('Usuario o contraseña incorrecta');
            }
            return user;
        }

        //Ver todos los usuarios, solo admin puede verlo
        @Get()
        //@UseGuards(new JwtAuthGuard('jwt'),RolesGuard)
        @UseGuards(JwtAuthGuard, RolesGuard)
        @Roles('admin')//tipo de rol al enpoint
        async findAll() {
            return await this.usuarioService.findAll();
        }
        //Ver solo un usario en especifico, solo admin puede verlo
        @Get(':id')
        @UseGuards(JwtAuthGuard, RolesGuard)
        @Roles('admin')
        async findById(@Param('id') id: string){
            return await this.usuarioService.findById(id);
        }
        //Actualizar los datos
        @Put(':id')
        @UseGuards(JwtAuthGuard)
        async update(
        @Param('id') userId: string, 
        @Body() updateUserDto : UpdateUserDto,
        //@Request() req: any
        @Request() req//añadido
        ): Promise<{ message : string; user?: any}>{
            const requestingUserId = req.user.id;//añadido
            const authenticatedUserId =  req.user._id.toString();
            console.log('ID del usuario autenticado:', authenticatedUserId);
            console.log('ID del usuario a actualizar:', userId);
            console.log('Datos que se envían para actualizar:', updateUserDto);
            if (authenticatedUserId !== userId){
                throw new UnauthorizedException('No tienes permiso para actualizar este usuario')
            }
            const updatedUser = await this.usuarioService.update(userId, updateUserDto,requestingUserId );
            return { 
                message: 'Usuario actualizado exitosamente',
                user: updatedUser 
        }
    }
        //Solo admin puede actualizar el rol
        @Put('rol/:id')
        @UseGuards(JwtAuthGuard, RolesGuard)
        async updateUserRole(
            @Param('id') userId: string, 
            @Body() updateUserDto: UpdateUserDto,
            @Request() req
            ){
                const requestingUserId = req.user.id;
                const requestingUser = await this.usuarioService.findById(requestingUserId);
                if (requestingUser.rol !== 'admin'){
                    throw new UnauthorizedException('Solo un administrador puede actualizar el rol de un usuario')
                }
                return await this.usuarioService.update(userId, updateUserDto, requestingUserId)
            }
            
        //Eliminar usuario
        @Delete(':id')
        @UseGuards(JwtAuthGuard,RolesGuard)
        @Roles('admin')
        async delete(@Param('id') id: string){
        return await this.usuarioService.delete(id);
         }
}


