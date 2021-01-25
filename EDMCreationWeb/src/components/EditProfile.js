import React, { Component } from "react";
import { Typography, withStyles } from "@material-ui/core";
import LogIn from "./LogIn";
import { withRouter } from "react-router-dom";

const styles = theme => ({
    title: {
        margin: "auto",
        marginTop: 20,
        marginBottom: 20,
        maxWidth: 800,
    },
});

class EditProfile extends Component {
    render() {
        const { classes } = this.props;

        if (localStorage.getItem("access_token") === null) {
            return (
                <LogIn originPath="/EditProfile"/>
            )
        }

        return (
            <div>
                <Typography variant="h5" className={classes.title}>
                    Edit Profile
                </Typography>
            </div>
        )
    }
}

export default withStyles(styles)(withRouter(EditProfile));