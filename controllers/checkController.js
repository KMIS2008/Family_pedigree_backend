const ctrlWrapper = require('../helpers/ctrlWrapper.js');
require('dotenv').config();

const {correctPassword} = process.env;


const check=async (req, res)=>{

    const { password } = req.body;

  if (password === correctPassword) {
    return res.json({ success: true });
  } else {
    return res.json({ success: false });
  }

} 

module.exports = {
    check: ctrlWrapper(check),
}