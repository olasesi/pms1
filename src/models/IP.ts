import mongoose, { Document }  from "mongoose";

interface IIPblacklist extends Document{
    ipaddress: string;
    value: string | null;
}

interface IIPwhitelist extends Document{
    ipaddress: string;
    value: string | null;
}


const IPBlacklistSchema = new mongoose.Schema({
    ipaddress: {
        type: String,
        unique: true,
        required: true,
      },
      value: {
        type: String,
        default: null,
      },  
}, { timestamps: true });

const IPWhitelistSchema = new mongoose.Schema({
    ipaddress: {
        type: String,
        unique: true,
        required: true,
      },
      value: {
        type: String,
        default: null,
      },  
},  { timestamps: true });


export const BlacklistedIP = mongoose.model<IIPblacklist>("IPAddressBlacklist", IPBlacklistSchema);

export const WhitelistedIP = mongoose.model<IIPwhitelist>("IPAddressWhitelist", IPWhitelistSchema);