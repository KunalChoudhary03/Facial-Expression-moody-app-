const mongoose= require("mongoose");
function connectDb(){
    mongoose.connect(process.env.MONGODB_URL)
    .then(()=>{
        console.log('Connected to MongoDB');
    })
    .catch((err)=>{
        console.log('Error connecting to MongoDb',err);
        
    })
}
module.exports = connectDb;