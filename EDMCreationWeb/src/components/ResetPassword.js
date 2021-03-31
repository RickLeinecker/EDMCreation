import React, { Component } from "react";
import { Paper, withStyles, Grid, TextField, Button, Typography } from "@material-ui/core";
import axios from "axios";
import qs from "qs";
import { Redirect } from "react-router-dom";
import { url } from "./URL";

const styles = theme => ({
    form: {
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
    background: {
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
    },
    disabledInputBox: {
        backgroundColor: "white",
        borderRadius: theme.shape.borderRadius,
        color: "black",
    },
});

class ResetPassword extends Component {
    constructor(props) {
        super(props);

        this.parameters = qs.parse(this.props.location.search, { ignoreQueryPrefix: true });

        this.state = {
            email: this.parameters.email,
            newPassword: "",
            confirmationNewPassword: "",
            disableButton: true,
            token: this.parameters.token
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
            this.state.newPassword !== "" &&
            this.state.confirmationNewPassword !== "") {
            this.setState({ disableButton: false });
        }
        else {
            this.setState({ disableButton: true });
        }
    }

    handleSubmit(e) {
        e.preventDefault();

        const claims = {
            password: this.state.newPassword,
            confirmationPassword: this.state.confirmationNewPassword
        };

        axios.post(url + "/api/users/changepassword?token=" + this.state.token, claims)
            .then(res => {
                window.location.href = "/passwordreset";
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
                <Redirect to="/profile" />
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
                            className={classes.form}
                        >
                            <Paper elevation={0} className={classes.background}>
                                <Grid item align="center">
                                    <Typography component="h1" variant="h5">
                                        Reset your password
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
                                                    disabled
                                                    value={this.state.email}
                                                    onChange={this.handleChange}
                                                    InputProps={{ className: classes.disabledInputBox, disableUnderline: true }}
                                                    InputLabelProps={{ className: classes.inputBoxLabel }}
                                                />
                                            </Grid>
                                            <Grid item>
                                                <TextField
                                                    type="password"
                                                    fullWidth
                                                    name="newPassword"
                                                    variant="filled"
                                                    label="New password"
                                                    onChange={this.handleChange}
                                                    InputProps={{ className: classes.inputBox, disableUnderline: true }}
                                                    InputLabelProps={{ className: classes.inputBoxLabel }}
                                                />
                                            </Grid>
                                            <Grid item>
                                                <TextField
                                                    type="password"
                                                    fullWidth
                                                    name="confirmationNewPassword"
                                                    variant="filled"
                                                    label="Confirm new password"
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
                                                            Reset
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

export default withStyles(styles)(ResetPassword);