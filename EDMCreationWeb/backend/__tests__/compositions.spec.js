const axios = require('axios');
require('dotenv').config();
const serverUrl = process.env['SERVER_URL'];

describe("Compositions Tests", () => {
    var result;
    var token;

    beforeAll(() => {
        const requestBody = {
            'username': process.env['TEST_USERNAME'],
            'password': process.env['TEST_PASSWORD']
        };

        axios.post(serverUrl + 'api/users/login', requestBody)
            .then(response => {
                token = response.data['sJWT'];
            })
            .catch(error => {
                result = error.response.status;
            });
    });

    describe("GET: /api/users/info", () => {
        var route = serverUrl + 'api/users/info/testuser';

        test("Status 200 - Using existing username.", () => {
            axios.get(route)
                .then(res => {
                    result = res.status;
                })
                .catch(err => {
                    result = err.res.status;
                })
                .finally(() => {
                    expect(result).toBe(200);
                });
        });
    });
});