"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const user_model_1 = __importDefault(require("../models/user_model"));
const post_model_1 = __importDefault(require("../models/post_model"));
const mongoose_1 = __importDefault(require("mongoose"));
const ObjectId = mongoose_1.default.Types.ObjectId;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    console.log("the id: " + id);
    try {
        const user = yield user_model_1.default.aggregate([
            { $match: { _id: new ObjectId(id) } },
            {
                $lookup: {
                    from: post_model_1.default.collection.name,
                    localField: "posts",
                    foreignField: "_id",
                    as: "posts"
                },
            },
            {
                $project: {
                    "refresh_tokens": 0
                }
            }
        ]);
        if (user.length > 0) {
            //console.log("we found the user: " + user)
            //const data = JSON.stringify(user[0])
            console.log("we found the user: " + user[0]);
            res.status(200).send(user[0]);
        }
        else {
            res.status(404).send({ err: "Couldnt find this user id" });
        }
    }
    catch (err) {
        res.status(400).send({ err: err.message });
    }
});
/*const getUserDetails = async (req: Request, res: Response) => {
    const id = req.params.id;
    console.log("the id: "+ id)
    try{
        const user = await Users.findById(id)
        if(user){
            res.status(200).send( user );
        }
    }catch(err){
        res.status(400).send({ err: err.message })
    }
}*/
const editUserInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, imageUrl } = req.body;
    console.log('edit user infooooo' + id);
    try {
        const user = yield user_model_1.default.findByIdAndUpdate(id, {
            $set: {
                name: name,
                imgUrl: imageUrl
            }
        });
        yield user.save();
        res.status(200).send({ msg: "Update succes", status: 200 });
    }
    catch (err) {
        res.status(400).send({ err: err.message });
    }
});
module.exports = { editUserInfo, getUser };
//# sourceMappingURL=users.js.map