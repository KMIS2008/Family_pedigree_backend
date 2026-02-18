const FeedBack = require('../model/feedback.js');
const ctrlWrapper = require('../helpers/ctrlWrapper.js');


const addFeedback = async(req, res, next)=>{
  
    const newFeedback = await FeedBack.create(req.body);
   
    res.status(201).json(newFeedback);
}

const getFeedback = async (req, res, next) => {
    
    const allFeedback = await FeedBack.find();
    
    res.status(200).json(allFeedback);  
};  


const deleteFeedback = async (req, res) => {
    const {id} = req.params;
    const delFeedback = await FeedBack.findOneAndDelete({
        _id: id,
    });
   
    if (!delFeedback){
        throw HttpError(404)
    } 
    res.status(200).json(delFeedback);
};

module.exports = {
    addFeedback: ctrlWrapper(addFeedback),
    getFeedback: ctrlWrapper(getFeedback),
    deleteFeedback:ctrlWrapper(deleteFeedback),
}