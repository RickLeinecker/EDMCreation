import React, { Component } from "react";
import { Paper, withStyles, Grid, TextField, Button, Typography } from "@material-ui/core";
import { AccountBox } from '@material-ui/icons/';
import axios from "axios";
import LogIn from "./LogIn";
import { withRouter } from "react-router-dom";
import { url } from "./URL";

const styles = theme => ({
    title: {
        margin: "auto",
        marginTop: 20,
        marginBottom: 20,
        maxWidth: 800,
    },
    form: {
        justifyContent: "center",
        marginTop: 15,
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
        minWidth: 800,
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
    disabledInputBox: {
        backgroundColor: "white",
        borderRadius: theme.shape.borderRadius,
        color: "black",
    },
    largeIcon: {
        fontSize: "16em",
    },
    username: {
        marginLeft: 25
    },
    errorMessage: {
        color: "#EB5757",
    }
});

class EditProfile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            username: "",
            description: "",
            password: "",
            newPassword: "",
            confirmationNewPassword: "",
            currentEmail: "",
            currentDescription: "",
            disableButton: true
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.changeButton = this.changeButton.bind(this);
        this.getInfo = this.getInfo.bind(this);
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value }, function () { this.changeButton() });
    }

    changeButton() {
        if (this.state.email !== "" &&
            this.state.username !== "" &&
            (this.state.email !== this.state.currentEmail ||
                this.state.description !== this.state.currentDescription ||
                (this.state.currentPassword !== "" &&
                    this.state.newPassword !== "" &&
                    this.state.confirmationNewPassword !== ""))) {
            this.setState({ disableButton: false });
        }
        else {
            this.setState({ disableButton: true });
        }
    }

    handleSubmit(e) {
        e.preventDefault();

        const config = {
            headers: {
                'Authorization': ['Bearer ' + localStorage.getItem("access_token")]
            }
        };

        const claims = {
            email: this.state.email,
            username: this.state.username,
            password: this.state.password,
            newPassword: this.state.newPassword,
            confirmationNewPassword: this.state.confirmationNewPassword,
            description: this.state.description,
        };

        axios.post(url + "/api/users/editsave", claims, config)
            .then(res => {
                if (this.state.email === this.state.currentEmail) {
                    window.location.href = "/accountupdated";
                }
                else {
                    window.location.href = "/accountemailupdated";
                }
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

    componentDidMount() {
        this.getInfo();
    }

    getInfo() {
        const config = {
            headers: {
                'Authorization': ['Bearer ' + localStorage.getItem("access_token")]
            }
        };

        axios.get(url + "/api/users/editinfo", config)
            .then(res => this.setState({
                email: res.data.email,
                username: res.data.username,
                description: res.data.description,
                currentEmail: res.data.email,
                currentDescription: res.data.description,
            }));
    }

    render() {
        const { classes } = this.props;

        if (localStorage.getItem("access_token") === null) {
            return (
                <LogIn originPath={window.location.pathname} />
            )
        }

        return (
            <div>
                <Typography variant="h5" className={classes.title}>
                    Your account
                </Typography>
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
                                        Edit your profile
                                    </Typography>
                                    <br />
                                    <br />
                                </Grid>
                                <Grid container>
                                    <Grid item xs container direction="column">
                                        <Grid item>
                                            <AccountBox className={classes.largeIcon} />
                                        </Grid>
                                    </Grid>
                                    <Grid item container xs={12} sm direction="column">
                                        <Grid item>
                                            <form onSubmit={this.handleSubmit}>
                                                <Grid container direction="column" spacing={2}>
                                                    <Grid item>
                                                        <Typography>
                                                            User information
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item>
                                                        <TextField
                                                            type="text"
                                                            fullWidth
                                                            name="username"
                                                            variant="filled"
                                                            autoFocus
                                                            label="Username"
                                                            InputProps={{ className: classes.disabledInputBox, disableUnderline: true }}
                                                            InputLabelProps={{ className: classes.inputBoxLabel }}
                                                            value={this.state.username}
                                                            disabled={true}
                                                        />
                                                    </Grid>
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
                                                            value={this.state.email}
                                                        />
                                                    </Grid>
                                                    <Grid item>
                                                        <TextField
                                                            type="text"
                                                            fullWidth
                                                            name="description"
                                                            variant="filled"
                                                            label="User description"
                                                            multiline="true"
                                                            rows="6"
                                                            onChange={this.handleChange}
                                                            InputProps={{ className: classes.inputBox, disableUnderline: true }}
                                                            InputLabelProps={{ className: classes.inputBoxLabel }}
                                                            value={this.state.description}
                                                        />
                                                    </Grid>
                                                    <Grid item>
                                                        <br />
                                                        <Typography>
                                                            Change password
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item>
                                                        <TextField
                                                            type="password"
                                                            fullWidth
                                                            name="password"
                                                            variant="filled"
                                                            label="Current password"
                                                            onChange={this.handleChange}
                                                            InputProps={{ className: classes.inputBox, disableUnderline: true }}
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
                                                                    Save changes
														        </Button>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </form>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default withStyles(styles)(withRouter(EditProfile));