class ErrCtrl{
    code = 0;
    message = null;
    constructor(code: any, message: any) {
      this.code = code;
      this.message = message;
    }
}

module.exports = ErrCtrl