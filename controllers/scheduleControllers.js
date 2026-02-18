const Schedule = require('../model/schedule.js');
const ctrlWrapper = require('../helpers/ctrlWrapper.js');
const HttpError = require('../helpers/HttpError.js');

const addSchedule = async(req, res, next)=>{
  
    const newSchedule = await Schedule.create(req.body);
   
    res.status(201).json(newSchedule);
}

const getSchedule = async (req, res, next) => {
    
    const allSchedule = await Schedule.find();
    
    res.status(200).json(allSchedule);  
};  


const deleteSchedule = async (req, res) => {
    const {id} = req.params;
    const delSchedule = await Schedule.findOneAndDelete({
        _id: id,
    });
   
    if (!delSchedule){
        throw HttpError(404)
    } 
    res.status(200).json(delSchedule);
};

module.exports = {
    addSchedule: ctrlWrapper(addSchedule),
    getSchedule: ctrlWrapper(getSchedule),
    deleteSchedule:ctrlWrapper(deleteSchedule),
}