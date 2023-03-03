import request from 'supertest'
import app from '../server'
import mongoose from 'mongoose'
import fs from 'mz/fs';


beforeAll(async () => {
    console.log('beforeAll')
})

afterAll(async () => {
    console.log('afterAll')
    mongoose.connection.close()
})

jest.setTimeout(30000)

describe("File Tests", () => {
    test("upload file", async () => {
        const filePath = `${__dirname}/avatar.png`;
        const rs = await fs.exists(filePath)
        if (rs) {
            const response = await request(app)
                .post("/file/file?file=123.jpeg").attach('file', filePath)
            expect(response.statusCode).toEqual(200);
        }
    })
})