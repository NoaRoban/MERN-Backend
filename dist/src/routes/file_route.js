"use strict";
/**
* @swagger
* tags:
*   name: File
*   description: Files upload
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const multer_1 = __importDefault(require("multer"));
const base = "http://172.20.10.3:3000/";
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        console.log('multer storage callback');
        const date = `${new Date().getFullYear()}_${new Date().getMonth() + 1}_${new Date().getDate()}_${new Date().getHours()}_${new Date().getMinutes()}_${new Date().getSeconds()}`;
        cb(null, date + '.jpg'); //Appending .jpg
    }
});
const upload = (0, multer_1.default)({ storage: storage });
router.post('/file', upload.single("file"), function (req, res) {
    console.log("router.post(/file: " + base + req.file.path);
    res.status(200).send({ url: base + req.file.path });
});
module.exports = router;
//# sourceMappingURL=file_route.js.map