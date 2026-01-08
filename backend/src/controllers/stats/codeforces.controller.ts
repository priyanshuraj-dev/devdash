import {Request,Response} from "express";
import axios from "axios"
import { cache } from "../../utils/cache.js";

const CACHE_TTL = 5*60*1000

export const getCodeforcesStats = async(req:Request,res:Response) => {
    try {
        const {handle} = req.params;
        if(!handle){
            return res.status(400).json({
                message: "Codeforces handle is required"
            })
        }
        const cacheKey = `codeforces:${handle}`;
        const cachedData = cache.get(cacheKey);
        if(cachedData){
            return res.status(200).json({
                ...cachedData,cached:true
            })
        }

        const response = await axios.get(`https://codeforces.com/api/user.info?handles=${handle}`);
        if(response.data.status !=="OK"){
            return res.status(404).json({
                message: "Invalid Codeforces handle"
            })
        }
        const user = response.data.result[0];
        const result = {
            handle: user.handle,
            rating: user.rating?? null,
            maxRating: user.maxRating?? null,
            rank: user.rank?? null
        }

        cache.set(cacheKey,result,CACHE_TTL);
        return res.status(200).json({
            ...result,cached:false
        })

    } catch (error) {
        return res.status(500).json({
            message: "Failed to fetch Codeforces stats"
        })
    }
}