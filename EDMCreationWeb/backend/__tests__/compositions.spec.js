const axios = require('axios');
require('dotenv').config();
const serverUrl = process.env['SERVER_URL'];

describe("Compositions Tests", () => {
    var token;

    beforeAll((done) => {
        const requestBody = {
            'username': process.env['TEST_USERNAME'],
            'password': process.env['TEST_PASSWORD']
        };

        axios.post(serverUrl + 'api/users/login', requestBody)
            .then(response => {
                token = response.data['sJWT'];
                done();
            })
            .catch(error => {
                result = error.response.status;
                done();
            });
    });

    describe("GET: /api/compositions/popular", () => {
        var result;
        var route = serverUrl + 'api/compositions/popular';

        test("Status 200 - Popular works.", (done) => {
            axios.get(route)
                .then(res => {
                    result = res.status;
                })
                .catch(err => {
                    result = err.response.status;
                })
                .finally(() => {
                    expect(result).toBe(200);
                    done();
                });
        });
    });//end endpoint

    describe("GET: /api/compositions/user/tony", () => {
        var result;
        var route = serverUrl + 'api/compositions/user/tony';

        test("Status 200 - users works.", (done) => {
            axios.get(route)
                .then(res => {
                    result = res.status;
                })
                .catch(err => {
                    result = err.response.status;
                })
                .finally(() => {
                    expect(result).toBe(200);
                    done();
                });
        });

        test("Status 400 - wrong username.", (done) => {
            var route = serverUrl + 'api/compositions/user/tonywrong';
            axios.get(route)
                .then(res => {
                    result = res.status;
                })
                .catch(err => {
                    result = err.response.status;
                })
                .finally(() => {
                    expect(result).toBe(400);
                    done();
                });
        });

    });//end endpoint

});