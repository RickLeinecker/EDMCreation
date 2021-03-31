import React, { Component } from "react";
import { Paper, withStyles, Grid, TextField, Button, Typography } from "@material-ui/core";
import axios from "axios";
import { url } from "./URL";

const styles = theme => ({
    registerForm: {
        justifyContent: "center",
        marginTop: 75,
        marginBottom: 75,
        borderRadius: theme.shape.borderRadius,
    },
    buttonBlock: {
        backgroundColor: "#219653",
        color: "white",
        "&:hover": {
            backgroundColor: "#219653"
        },
        "&:disabled": {
            backgroundColor: "#BDBDBD"
        },
        paddingLeft: "25px",
        paddingRight: "25px",
    },
    registerBackground: {
        justifyContent: "center",
        minWidth: "55vh",
        paddingTop: "50px",
        paddingBottom: "90px",
        paddingLeft: "70px",
        paddingRight: "70px",
        backgroundColor: "#333333",
    },
    inputBox: {
        backgroundColor: "white",
        borderRadius: theme.shape.borderRadius,
        color: "black",
        "&.Mui-focused": {
            backgroundColor: "white",
            color: "black",
        },
        "&:hover": {
            backgroundColor: "white",
        },
    },
    inputBoxLabel: {
        color: "#828282",
        "&.Mui-focused": {
            color: "#828282",
        },
    },
    errorMessage: {
        color: "#EB5757",
    }
});

class Register extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            username: "",
            password: "",
            confirmationPassword: "",
            disableButton: true
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.changeButton = this.changeButton.bind(this);
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value }, function () { this.changeButton() });
    }

    changeButton() {
        if (this.state.email !== "" &&
            this.state.username !== "" &&
            this.state.password !== "" &&
            this.state.confirmationPassword !== "") {
            this.setState({ disableButton: false });
        }
        else {
            this.setState({ disableButton: true });
        }
    }

    handleSubmit(e) {
        e.preventDefault();

        const claims = {
            email: this.state.email,
            username: this.state.username,
            password: this.state.password,
            confirmationPassword: this.state.confirmationPassword
        };

        axios.post(url + "/api/users/signup", claims)
            .then(res => {
                window.location.href = "/registercompleted";
            })
            .catch(err => {
                if (err.response.data.errors !== undefined) {
                    var errMsg = "";

                    err.response.data.errors.map(validationErr => {
                        errMsg += (validationErr.msg + "<br />");
                    })

                    document.getElementById("errorMessage").innerHTML = errMsg;
                }
                else {
                    document.getElementById("errorMessage").innerHTML = err.response.data.msg;
                }
            });
    }

    render() {
        const { classes } = this.props;

        if (localStorage.getItem("access_token") !== null) {
            return (
                window.location.href = "/login"
            )
        }

        return (
            <div>
                <Grid container spacing={0} justify="center" direction="row">
                    <Grid item>
                        <Grid
                            container
                            direction="column"
                            justify="center"
                            spacing={2}
                            className={classes.registerForm}
                        >
                            <Paper elevation={0} className={classes.registerBackground}>
                                <Grid item align="center">
                                    <Typography component="h1" variant="h5">
                                        Make an account
                                    </Typography>
                                    <br />
                                </Grid>
                                <Grid item>
                                    <form onSubmit={this.handleSubmit}>
                                        <Grid container direction="column" spacing={2}>
                                            <Grid item>
                                                <TextField
                                                    type="email"
                                                    fullWidth
                                                    name="email"
                                                    variant="filled"
                                                    autoFocus
                                                    label="Email"
                                                    onChange={this.handleChange}
                                                    InputProps={{ className: classes.inputBox, disableUnderline: true }}
                                                    InputLabelProps={{ className: classes.inputBoxLabel }}
                                                />
                                            </Grid>
                                            <Grid item>
                                                <TextField
                                                    type="text"
                                                    fullWidth
                                                    name="username"
                                                    variant="filled"
                                                    label="Username"
                                                    onChange={this.handleChange}
                                                    InputProps={{ className: classes.inputBox, disableUnderline: true }}
                                                    InputLabelProps={{ className: classes.inputBoxLabel }}
                                                />
                                            </Grid>
                                            <Grid item>
                                                <TextField
                                                    type="password"
                                                    fullWidth
                                                    name="password"
                                                    variant="filled"
                                                    label="Password"
                                                    onChange={this.handleChange}
                                                    InputProps={{ className: classes.inputBox, disableUnderline: true }}
                                                    InputLabelProps={{ className: classes.inputBoxLabel }}
                                                />
                                            </Grid>
                                            <Grid item>
                                                <TextField
                                                    type="password"
                                                    fullWidth
                                                    name="confirmationPassword"
                                                    variant="filled"
                                                    label="Confirm password"
                                                    onChange={this.handleChange}
                                                    InputProps={{ className: classes.inputBox, disableUnderline: true }}
                                                    InputLabelProps={{ className: classes.inputBoxLabel }}
                                                />
                                            </Grid>
                                            <Grid item>
												<div id="errorMessage" className={classes.errorMessage}></div>
											</Grid>
                                            <Grid item>
                                                <Grid container justify="center">
                                                    <Grid item>
                                                        <Button disabled={this.state.disableButton} type="submit" className={classes.buttonBlock}>
                                                            Sign up
														</Button>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </form>
                                </Grid>
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default withStyles(styles)(Register);