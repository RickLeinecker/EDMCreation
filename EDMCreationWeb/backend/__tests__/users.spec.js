const axios = require('axios');
require('dotenv').config();
const serverUrl = process.env['SERVER_URL'];

describe("Users Tests", () => {
    var token;
    var invalidToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"

    beforeAll((done) => {
        var result;

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

    describe("GET: /api/users/info", () => {
        var result;
        var route = serverUrl + 'api/users/info/testuser';

        test("Status 200 - Using existing username.", (done) => {
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
    });

    describe("POST: /api/users/editsave", () => {
        var route = serverUrl + 'api/users/editinfo';

        test("Status 200 - Change description using valid token.", (done) => {
            var result;
            const config = {
                headers: {
                    'Authorization': ['Bearer ' + token]
                }
            };

            // const requestBody = {
            //     'description': 'Test description',
            // };

            axios.get(route, config)
                .then(res => {
                    var data = {
                        email: res.data.email,
                        username: res.data.username,
                        description: res.data.description,
                        currentEmail: res.data.email,
                        currentDescription: res.data.description,
                        image_id: res.data.image_id,
                    }

                    const formData = new FormData();
                    formData.append("email", data.email);
                    formData.append("username", data.username);
                    formData.append("password", data.password);
                    formData.append("newPassword", "");
                    formData.append("confirmationNewPassword", "");
                    formData.append("description", "Test description");
                    formData.append("removeImage", false);

                    axios.post(serverUrl + "api/users/editsave", formData, config)
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
        });

        test("Status 400 - Change description using invalid token.", (done) => {
            var result;
            var config = {
                headers: {
                    'Authorization': ['Bearer ' + token]
                }
            };

            axios.get(route, config)
                .then(res => {
                    config = {
                        headers: {
                            'Authorization': ['Bearer ' + invalidToken]
                        }
                    };

                    var data = {
                        email: res.data.email,
                        username: res.data.username,
                        description: res.data.description,
                        currentEmail: res.data.email,
                        currentDescription: res.data.description,
                        image_id: res.data.image_id,
                    }

                    const formData = new FormData();
                    formData.append("email", data.email);
                    formData.append("username", data.username);
                    formData.append("password", data.password);
                    formData.append("newPassword", "");
                    formData.append("confirmationNewPassword", "");
                    formData.append("description", "Test description");
                    formData.append("removeImage", false);

                    axios.post(serverUrl + "api/users/editsave", formData, config)
                        .then(res => {
                            result = res.status;
                        })
                        .catch(err => {
                            result = err.response.status;
                        })
                        .finally(() => {
                            expect(result).toBe(401);
                            done();
                        });
                });
        });
    });
});