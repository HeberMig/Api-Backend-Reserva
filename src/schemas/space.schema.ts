import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type SpaceDocument = Space & Document;

@Schema({
    timestamps: true,
})
export class Space {
    @Prop({
        required: true,
        trim: true
    })
    name: string;

    @Prop({
        required: true,
        trim: true
    })
    location: string;
    
    @Prop({
        required: true,
        min: 1
    })
    capacity: number;
}

export const SpaceSchema = SchemaFactory.createForClass(Space);