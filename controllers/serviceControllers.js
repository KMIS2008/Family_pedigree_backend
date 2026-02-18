const Service = require('../model/services.js');
const ctrlWrapper = require('../helpers/ctrlWrapper.js');
const HttpError = require('../helpers/HttpError.js');

const addService = async(req, res, next)=>{
  
    const newService = await Service.create(req.body);
   
    res.status(201).json(newService);
}

const getService = async (req, res, next) => {
    
    const allService = await Service.find();
    
    res.status(200).json(allService);  
};  


const deleteService = async (req, res) => {
    const {id} = req.params;
    const delService = await Service.findOneAndDelete({
        _id: id,
    });
   
    if (!delService){
        throw HttpError(404)
    } 
    res.status(200).json(delService);
};

module.exports = {
    addService: ctrlWrapper(addService),
    getService: ctrlWrapper(getService),
    deleteService:ctrlWrapper(deleteService),
}