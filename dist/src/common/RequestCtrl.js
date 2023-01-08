"use strict";
class ReqCtrl {
    constructor(body, userId, postId) {
        this.body = {};
        this.userId = null;
        this.postId = null;
        this.body = body;
        this.userId = userId;
        this.postId = postId;
    }
    static fromRestRequest(req) {
        return new ReqCtrl(req.body, req.body.userId, req.params.id);
    }
}
module.exports = ReqCtrl;
//# sourceMappingURL=RequestCtrl.js.map