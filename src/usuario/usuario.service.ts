import { Injectable, NotFoundException, UnauthorizedException, ConflictException, ForbiddenException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model} from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument} from '../schemas/user.schema';
import { CreateUserDto } from '../dto/create-user.dto';
import { LoginUserDto } from 'src/dto/login-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';


//Services se encarga de interacturar con la db
@Injectable()
export class UsuarioService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>,
private jwtService: JwtService,
) {}
//Registrar un nuevo usuario
async register(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userModel.findOne({ email: createUserDto.email });
    if (existingUser){
        throw new ConflictException('El usuario ya existe');
    }
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = new this.userModel({
        ...createUserDto,
        password: hashedPassword,
        rol: createUserDto.rol || 'user',
    });
    return newUser.save();
}
//login de usuario o iniciar sesión
  async login(loginUserDto: LoginUserDto): Promise<{ user: { 
    access_token: string; 
    id: string; 
    name: string; 
    email: string; 
    rol: string;
}}> {
    const user = await this.userModel.findOne({ email: loginUserDto.email})
    if (!user || !( await bcrypt.compare(loginUserDto.password, user.password))){
        throw new UnauthorizedException('Usuario o contraseña incorrecta');
    }
    const payload = { sub: user._id.toString(), email: user.email, rol: user.rol };
    //Firmar el token
    const accessToken = this.jwtService.sign(payload);

    return { 
        user: { 
            id: user._id.toString(), 
            name: user.name, 
            email: user.email, 
            rol: user.rol,
            access_token: accessToken,
        },
        };
    };

//Obtener todos los usuarios
async findAll(): Promise<User[]> {
    return this.userModel.find().select('-password');
}
//Obtener un usuario por id
async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).select('-password');
    if (!user){
        throw new NotFoundException('Usuario no encotrado');
    }
    return user;
}
//Actualizar un usuario
    async update(userId: string, updateUserDto: UpdateUserDto, requestingUserId: string): Promise<{ message: string; user?: User }> {
    try{
     //Valida que exista usuario antes de actualizar   
    const user = await this.userModel.findById(userId);
    if (!user){
        throw new NotFoundException('Usuario no encontrado');
    }
    const requestingUser = await this.userModel.findById(requestingUserId);
    //verificar si el rol esta siendo actualizado 
     if (updateUserDto.rol){
        if (user.rol === updateUserDto.rol){
            return {
               message: 'El rol ya está establecido como el mismo, no se realizarón cambios.',
               user: { ...user.toObject(), password: undefined}
        };
    }
    //Verificar que solo admin que puede asignar el rol admin
        if (updateUserDto.rol === 'admin' && requestingUser.rol !== 'admin'){
            throw new UnauthorizedException('No tienes permiso para asignar el rol de admin')
        }
    }
    //Valida si email ya existe, es decir si le pertence a otro usuario
    if(updateUserDto.email){
        const emailExist = await this.userModel.findOne({email:updateUserDto.email});
        if(emailExist && emailExist._id.toString() !== userId){
            throw new ConflictException('Correo electrónico ya existe');
        }
    }
    //hash a la contraeña modificada o nueva
    if(updateUserDto.password){
        const hashedPassword = await bcrypt.hash(updateUserDto.password, 10)
        updateUserDto.password = hashedPassword;
    }
    //Actualizar la inf user
        //object       
        Object.assign(user, updateUserDto);
        await user.save(); //guardar cambios
        return {
            message: 'Actualización completa',
            user: {...user.toObject(), password: undefined}
        };
    } catch (error){
      console.log('Error al actualizar el usuario:', error)
      throw new InternalServerErrorException('Error al actualizar el usuario');
    }       
}
//Eliminar usuario
async delete(id: string): Promise<{ message: string }>{
    const resultado = await this.userModel.findByIdAndDelete(id);
    if (!resultado){
        throw new NotFoundException('Usuario no encontrado');
    }
    return { message: 'El usuario ha sido eliminado'};
}

}
