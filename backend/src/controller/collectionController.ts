import {NextFunction , Request , Response} from "express";
import {headerAuthVerify} from "../helper/Auth";
import {reqBodyValidator} from "../Handler/propType";
import CollectionDatabase from "../Database/collectionDatabase";
import responseHandler from "../Handler/responseHandler";
import UserDatabase from "../Database/userDatabase";
import PageDatabase from "../Database/pageDatabase";

class CollectionController {
    async addCollection (req: Request, res: Response , next: NextFunction){
        const [isBodyValid, request] = reqBodyValidator(req,["name"])
        if(!isBodyValid) return res.json(request)

        const user = await headerAuthVerify(req)
        if(!user)   return res.json(responseHandler.UNAUTHORISED("Not Authorised"))

        const { name , parent} = request.body
        const db = CollectionDatabase

        const userObj = await UserDatabase.findUser(user.email);
        if(!userObj) return res.json(responseHandler.NOT_FOUND_ERR("User not found"))

        const result = await db.addCollection(name,userObj.id,parent).catch(()=>null)
        if(!result) return res.json(responseHandler.CONFLICT("Collection not created"))

        return res.json(responseHandler.SUCCESS(result))

    }

    async getById (req: Request, res: Response , next: NextFunction){
        const [isBodyValid, request] = reqBodyValidator(req,["id"])
        if(!isBodyValid) return res.json(request)

        const user = await headerAuthVerify(req)
        if(!user)   return res.json(responseHandler.UNAUTHORISED("Not Authorised"))

        const { id} = request.body
        const db = CollectionDatabase

        const userObj = await UserDatabase.findUser(user.email);
        if(!userObj) return res.json(responseHandler.NOT_FOUND_ERR("User not found"))

        const result = await db.findCollectionById(Number(id)).catch(()=>null)
        if(!result) return res.json(responseHandler.CONFLICT("Collection not created"))

        return res.json(responseHandler.SUCCESS(result))

    }

    async getByParent (req: Request, res: Response , next: NextFunction){
        const [isBodyValid, request] = reqBodyValidator(req,["parent"])
        if(!isBodyValid) return res.json(request)

        const user = await headerAuthVerify(req)
        if(!user)   return res.json(responseHandler.UNAUTHORISED("Not Authorised"))

        const { parent} = req.body
        const db = CollectionDatabase

        const userObj = await UserDatabase.findUser(user.email);
        if(!userObj) return res.json(responseHandler.NOT_FOUND_ERR("User not found"))

        const result = await db.findCollectionByUserAndRoot(userObj.id,parent ? Number(parent) : null).catch(()=>null)
        if(!result) return res.json(responseHandler.CONFLICT("Collection not created"))
        return res.json(responseHandler.SUCCESS(result))
    }

    async getAllByParent (req: Request, res: Response , next: NextFunction){
        const [isBodyValid, request] = reqBodyValidator(req,["parent"])
        if(!isBodyValid) return res.json(request)

        const user = await headerAuthVerify(req)
        if(!user)   return res.json(responseHandler.UNAUTHORISED("Not Authorised"))

        const { parent} = req.body
        const db = CollectionDatabase

        const userObj = await UserDatabase.findUser(user.email);
        if(!userObj) return res.json(responseHandler.NOT_FOUND_ERR("User not found"))

        const ans = []
        const resultColl = await db.findCollectionByUserAndRoot(userObj.id,parent ? Number(parent) : null).catch(()=>null)
        if(resultColl) ans.push(resultColl.map((single)=>({
            ...single,
            type : "COLLECTION"
        })))

        const resultPage = await PageDatabase.findByCollectionId(Number(parent)).catch(()=>null)
        if(resultPage) ans.push(resultPage.map((single)=>({
            ...single,
            type : "PAGE"
        })))

        return res.json(responseHandler.SUCCESS(ans))
    }
}

export default new CollectionController();
