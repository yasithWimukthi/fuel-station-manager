import mongoose from 'mongoose';

const {Schema} = mongoose;

const fuelQueueSchema = new Schema({
    fuelStation:{
        type:Schema.Types.ObjectId,
        ref:'FuelStation'
    },
    fuelTypeName:{
        type: String,
        trim: true,
        required: true
    },
    customerName:{
        type: String,
        trim: true,
        required: true
    },
    vehicleType:{
        type:String,
        trim:true,
        required: true,
    },
    arrivalTime:{
        type:Date,
        trim:true,
    },
    departTime:{
        type:Date,
        trim:true,
    },
    status:{
        type:String,
        trim:true,
        required: true,
    },
    date:{
        type:Date,
        trim:true,
        required: true,
    },

},{timestamps:true});

export default mongoose.model('FuelQueue',fuelQueueSchema);