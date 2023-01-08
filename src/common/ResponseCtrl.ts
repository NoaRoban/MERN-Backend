import { Response } from "express";
class ResCtrl {
    body = {};
    userId = null;
    err = null;

    constructor(body: any, userId: any, err: any) {
        this.body = body;
        this.userId = userId;
        this.err = err;
    }

    sendRestResponse(res: Response) {
        if (this.err == null) {
        res.status(200).send({
            status: "ok",
            post: this.body
        });
        } else {
        res.status(this.err.code).send({
            status: "failed",
            message: this.err.message
        });
        }
    }
}

export = ResCtrl;