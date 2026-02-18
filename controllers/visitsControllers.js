const ctrlWrapper = require('../helpers/ctrlWrapper.js');
const Visit= require("../model/visits.js");

const getVisits = async (req, res, next) => {

    const allVisits = await Visit.find();
    
    res.status(200).json(allVisits);  
};  


const updateVisits = async (req, res) => {
        const visit = await Visit.findOne();
        visit.count += 1;
        await visit.save();
        res.status(201).json({count: visit.count});  
};



module.exports = {
    getVisits: ctrlWrapper(getVisits),
    updateVisits: ctrlWrapper(updateVisits)
}