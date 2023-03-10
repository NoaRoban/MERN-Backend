import { Request, Response } from 'express'
import Users from '../models/user_model';
import Posts from '../models/post_model';
import mongoose from 'mongoose';

const ObjectId = mongoose.Types.ObjectId;

const getUser = async (req: Request, res: Response) => {
    const id = req.params.id;
    console.log("the id: "+ id)
    try {
        const user = await Users.aggregate([
            { $match: { _id: new ObjectId(id) } },
            {
                $lookup: {
                    from: Posts.collection.name,
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
            console.log("we found the user[0]: " + user[0])
            res.status(200).send(user[0]);
        } else {
            res.status(404).send({ err: "Couldnt find this user id" });
        }

    } catch (err) {
        res.status(400).send({ err: err.message })
    }
}


const editUserInfo = async (req: Request, res: Response) => {
    const { id } = req.params;

    const { name, avatarUrl } = req.body;

    try {
        const user = await Users.findByIdAndUpdate(id, {
            $set: {
                name,
                avatarUrl,
            }
        });

        await user.save();
        res.status(200).send({ msg: "Update succes", status: 200 });
    } catch (err) {
        res.status(400).send({ err: err.message })
    }

}


export = { editUserInfo, getUser };