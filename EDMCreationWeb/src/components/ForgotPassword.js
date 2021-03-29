import React, { Component } from "react";
import { Paper, withStyles, Grid, TextField, Button, Typography } from "@material-ui/core";
import axios from "axios";
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
    }
});

class ForgotPassword extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
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
        if (this.state.email !== "") {
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
        };

        axios.get(url + "/api/users/resetpassword?email=" + this.state.email);

        window.location.href = "/resetrequested";
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
                                        Forgot password?
                                    </Typography>
                                    <br />
                                </Grid>
                                <Grid item align="center">
                                    <Typography>
                                        Enter your email to receive a password reset link.
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
                                                <div id="errorMessage" className={classes.errorMessage}></div>
                                            </Grid>
                                            <Grid item>
                                                <Grid container justify="center">
                                                    <Grid item>
                                                        <Button disabled={this.state.disableButton} type="submit" className={classes.buttonBlock}>
                                                            Send
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

export default withStyles(styles)(ForgotPassword);