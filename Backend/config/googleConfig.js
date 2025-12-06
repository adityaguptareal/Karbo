const {OAuth2Client}=require("google-auth-library")
const dotenv=require("dotenv")
dotenv.config()
const googleClient=new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
module.exports=googleClient