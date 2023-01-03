"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
//const port = 3000 // port that we are working on 
const dotenv_1 = __importDefault(require("dotenv")); //load the dotenv module to the var
if (process.env.NODE_ENV == 'test') {
    dotenv_1.default.config({ path: './.testenv' });
}
else {
    dotenv_1.default.config();
}
//import express package, load module to var
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)(); //activate the constructor of exprees
const http_1 = __importDefault(require("http"));
const server = http_1.default.createServer(app);
const body_parser_1 = __importDefault(require("body-parser"));
//analyze the request
app.use(body_parser_1.default.urlencoded({ extended: true, limit: '1mb' }));
app.use(body_parser_1.default.json());
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.connect(process.env.DATABASE_URL); //,{useNewUrlParser:true})
const db = mongoose_1.default.connection;
db.on('error', error => { console.error(error); });
db.once('open', () => { console.log('connected to mongo DB'); });
app.use('/public', express_1.default.static('public'));
const auth_route_js_1 = __importDefault(require("./routes/auth_route.js"));
app.use('/auth', auth_route_js_1.default);
const post_route_js_1 = __importDefault(require("./routes/post_route.js"));
app.use('/post', post_route_js_1.default);
//swagger implemantation 
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
if (process.env.NODE_ENV == "development") {
    const options = {
        definition: {
            openapi: "3.0.0",
            info: {
                title: "Web Dev 2022 REST API",
                version: "1.0.0",
                description: "REST server including authentication using JWT",
            },
            servers: [{ url: "http://localhost:3000", },],
        },
        apis: ["./src/routes/*.ts"],
    };
    const specs = (0, swagger_jsdoc_1.default)(options);
    app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(specs));
}
module.exports = server;
//# sourceMappingURL=server.js.map