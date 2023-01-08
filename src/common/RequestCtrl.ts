import { Request } from "express";

class ReqCtrl {
    body: any = {};
    userId = null
    postId = null

    constructor(body: any, userId: any,postId: any) {
        this.body = body;
        this.userId = userId;
        this.postId = postId;
    }

    static fromRestRequest(req: Request) {
        return new ReqCtrl(
        req.body,
        req.body.userId,
        req.params.id
        );
    }
}

export = ReqCtrl;