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

        
    });//end endpoint

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

        test("Status 400 - invalid token.", (done) => {
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
    });//end endpoint

    describe("POST: /api/users/signup", () => {
        var route = serverUrl + 'api/users/signup';

        test("Status 400 - username taken", (done) => {
            var result;
            const config = {
                headers: {
                    'Authorization': ['Bearer ' + token]
                }
            };

            const requestBody = {
                "username": "testuser",
                "email": "testuser1@test.test",
                "password": "test123",
                "confirmationPassword": "test123",
                "description": "this is a test"
            };

            axios.get(route, config,requestBody)
                .then(res => {

                    axios.post(serverUrl + "api/users/signup", requestBody, config)
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
        });

        test("Status 400 - email taken", (done) => {
            var result;
            const config = {
                headers: {
                    'Authorization': ['Bearer ' + token]
                }
            };

            const requestBody = {
                "username": "testuser1",
                "email": "testuser@test.test",
                "password": "test123",
                "confirmationPassword": "test123",
                "description": "this is a test"
            };

            axios.get(route, config,requestBody)
                .then(res => {

                    axios.post(serverUrl + "api/users/signup", requestBody, config)
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
        });
        
        test("Status 422 - password too short", (done) => {
            var result;
            const config = {
                headers: {
                    'Authorization': ['Bearer ' + token]
                }
            };

            const requestBody = {
                "username": "testuser1",
                "email": "testuser1@test.test",
                "password": "t",
                "confirmationPassword": "t",
                "description": "this is a test"
            };

            axios.get(route, config,requestBody)
                .then(res => {

                    axios.post(serverUrl + "api/users/signup", requestBody, config)
                        .then(res => {
                            result = res.status;
                        })
                        .catch(err => {
                            result = err.response.status;
                        })
                        .finally(() => {
                            expect(result).toBe(422);
                            done();
                        });
                });
        });


        test("Status 422 - passwords dont match", (done) => {
            var result;
            const config = {
                headers: {
                    'Authorization': ['Bearer ' + token]
                }
            };

            const requestBody = {
                "username": "testuser1",
                "email": "testuser1@test.test",
                "password": "test123",
                "confirmationPassword": "test1234",
                "description": "this is a test"
            };

            axios.get(route, config,requestBody)
                .then(res => {

                    axios.post(serverUrl + "api/users/signup", requestBody, config)
                        .then(res => {
                            result = res.status;
                        })
                        .catch(err => {
                            result = err.response.status;
                        })
                        .finally(() => {
                            expect(result).toBe(422);
                            done();
                        });
                });
        });

        test("Status 422 - invalid email", (done) => {
            var result;
            const config = {
                headers: {
                    'Authorization': ['Bearer ' + token]
                }
            };

            const requestBody = {
                "username": "testuser1",
                "email": "testuser1test.test",
                "password": "test123",
                "confirmationPassword": "test123",
                "description": "this is a test"
            };

            axios.get(route, config,requestBody)
                .then(res => {

                    axios.post(serverUrl + "api/users/signup", requestBody, config)
                        .then(res => {
                            result = res.status;
                        })
                        .catch(err => {
                            result = err.response.status;
                        })
                        .finally(() => {
                            expect(result).toBe(422);
                            done();
                        });
                });
        });

    });//end endpoint


    describe("POST: /api/users/login", () => {
        var route = serverUrl + 'api/users/login';

        test("Status 200 - successful username login", (done) => {
            var result;
            const config = {
                headers: {
                    'Authorization': ['Bearer ' + token]
                }
            };

            const requestBody = {
                "username": process.env['TEST_USERNAME'],
                "password": process.env['TEST_PASSWORD']
            };

            axios.get(route, config,requestBody)
                .then(res => {

                    axios.post(serverUrl + "api/users/login", requestBody, config)
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

        test("Status 200 - successful email login", (done) => {
            var result;
            const config = {
                headers: {
                    'Authorization': ['Bearer ' + token]
                }
            };

            const requestBody = {
                "username": process.env['TEST_EMAIL'],
                "password": process.env['TEST_PASSWORD']
            };

            axios.get(route, config,requestBody)
                .then(res => {

                    axios.post(serverUrl + "api/users/login", requestBody, config)
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
        

        test("Status 400 - bad password", (done) => {
            var result;
            const config = {
                headers: {
                    'Authorization': ['Bearer ' + token]
                }
            };

            const requestBody = {
                "username": process.env['TEST_USERNAME'],
                "password": "wrong"
            };

            axios.get(route, config,requestBody)
                .then(res => {

                    axios.post(serverUrl + "api/users/login", requestBody, config)
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
        });
        

        test("Status 400 - bad username", (done) => {
            var result;
            const config = {
                headers: {
                    'Authorization': ['Bearer ' + token]
                }
            };

            const requestBody = {
                "username": "wrongusername",
                "password": process.env['TEST_PASSWORD']
            };

            axios.get(route, config,requestBody)
                .then(res => {

                    axios.post(serverUrl + "api/users/login", requestBody, config)
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
        });


    });//end endpoint


    describe("POST: /api/users/liketoggle", () => {
        var route = serverUrl + 'api/users/liketoggle';

        test("Status 200 - successful liketoggle", (done) => {
            var result;
            const config = {
                headers: {
                    'Authorization': ['Bearer ' + token]
                }
            };

            const requestBody = {
                "song_id": "6065115bd1c23b8551942292"
            };

            axios.get(route, config,requestBody)
                .then(res => {

                    axios.post(serverUrl + "api/users/liketoggle", requestBody, config)
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

        test("Status 200 - successful un-liketoggle", (done) => {
            var result;
            const config = {
                headers: {
                    'Authorization': ['Bearer ' + token]
                }
            };

            const requestBody = {
                "song_id": "6065115bd1c23b8551942292"
            };

            axios.get(route, config,requestBody)
                .then(res => {

                    axios.post(serverUrl + "api/users/liketoggle", requestBody, config)
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

        test("Status 401 - invalid token", (done) => {
            var result;
            config = {
                headers: {
                    'Authorization': ['Bearer ' + invalidToken]
                }
            };

            const requestBody = {
                "song_id": "6065115bd1c23b8551942292"
            };

            axios.get(route, config,requestBody)
                .then(res => {

                    axios.post(serverUrl + "api/users/liketoggle", requestBody, config)
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
        
        
    });//end endpoint

    describe("POST: /api/users/followtoggle", () => {
        var route = serverUrl + 'api/users/followtoggle';

        test("Status 200 - successful followtoggle", (done) => {
            var result;
            const config = {
                headers: {
                    'Authorization': ['Bearer ' + token]
                }
            };

            const requestBody = {
                "follow_id": "6063ce691d4a0d202454f97c"
            };

            axios.get(route, config,requestBody)
                .then(res => {

                    axios.post(serverUrl + "api/users/followtoggle", requestBody, config)
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

        test("Status 200 - successful un-followtoggle", (done) => {
            var result;
            const config = {
                headers: {
                    'Authorization': ['Bearer ' + token]
                }
            };

            const requestBody = {
                "follow_id": "6063ce691d4a0d202454f97c"
            };

            axios.get(route, config,requestBody)
                .then(res => {

                    axios.post(serverUrl + "api/users/followtoggle", requestBody, config)
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
        
        test("Status 401 - invalid token ", (done) => {
            var result;
            config = {
                headers: {
                    'Authorization': ['Bearer ' + invalidToken]
                }
            };

            const requestBody = {
                "follow_id": "6063ce691d4a0d202454f97c"
            };

            axios.get(route, config,requestBody)
                .then(res => {

                    axios.post(serverUrl + "api/users/followtoggle", requestBody, config)
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

    });//end endpoint

    describe("GET: /api/users/isliked", () => {
        var route = serverUrl + 'api/users/isliked?song_id=6065115bd1c23b8551942292';

        test("Status 200 - is liked.", (done) => {
            var result;
            const config = {
                headers: {
                    'Authorization': ['Bearer ' + token]
                }
            };

            axios.get(route,config)
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

        test("Status 200 - is unliked.", (done) => {
            var result;
            const config = {
                headers: {
                    'Authorization': ['Bearer ' + token]
                }
            };

            axios.get(route,config)
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

        test("Status 401 - invalid token.", (done) => {
            var result;
            config = {
                headers: {
                    'Authorization': ['Bearer ' + invalidToken]
                }
            };

            axios.get(route,config)
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
        
    });//end endpoint

    describe("GET: /api/users/getfollow", () => {
        var route = serverUrl + 'api/users/getfollow?user_id=6063ce691d4a0d202454f97c';

        test("Status 200 - follow check.", (done) => {
            var result;
            const config = {
                headers: {
                    'Authorization': ['Bearer ' + token]
                }
            };

            axios.get(route,config)
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

        test("Status 401 - invalid token.", (done) => {
            var result;
            config = {
                headers: {
                    'Authorization': ['Bearer ' + invalidToken]
                }
            };

            axios.get(route,config)
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

    });//end endpoint

    describe("GET: /api/users/getfollow", () => {
        var route = serverUrl + 'api/users/getfollow?user_id=6063ce691d4a0d202454f97c';

        test("Status 200 - follow check.", (done) => {
            var result;
            const config = {
                headers: {
                    'Authorization': ['Bearer ' + token]
                }
            };

            axios.get(route,config)
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

        test("Status 401 - invalid token.", (done) => {
            var result;
            config = {
                headers: {
                    'Authorization': ['Bearer ' + invalidToken]
                }
            };

            axios.get(route,config)
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

    });//end endpoint

    describe("GET: /api/users/editinfo", () => {
        var route = serverUrl + 'api/users/editinfo';

        test("Status 200 - pull edit page info.", (done) => {
            var result;
            const config = {
                headers: {
                    'Authorization': ['Bearer ' + token]
                }
            };

            axios.get(route,config)
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

        test("Status 401 - invalid token.", (done) => {
            var result;
            config = {
                headers: {
                    'Authorization': ['Bearer ' + invalidToken]
                }
            };

            axios.get(route,config)
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

    });//end endpoint

    describe("GET: /api/users/following", () => {
        var route = serverUrl + 'api/users/following?username=6063ce691d4a0d202454f97c';

        test("Status 200 - follow list.", (done) => {
            var result;
            const config = {
                headers: {
                    'Authorization': ['Bearer ' + token]
                }
            };

            axios.get(route,config)
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

});