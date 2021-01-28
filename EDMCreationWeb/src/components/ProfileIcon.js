import React, { Component } from "react";
import { Typography, withStyles, Link, IconButton, Menu, MenuItem } from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";
import { AccountCircle } from '@material-ui/icons/';
import LogOut from "./LogOut";

const styles = theme => ({
    loginLink: {
        [theme.breakpoints.up("sm")]: {
            width: "auto",
        },
    },
    mediumIcon: {
        fontSize: "1.5em",
    },
});

class ProfileIcon extends Component {
    constructor(props) {
        super(props);

        this.state = {
            anchorEl: null,
        };

        this.handleClick = this.handleClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleClick(e) {
        this.setState({ anchorEl: e.currentTarget });
    }

    handleClose() {
        this.setState({ anchorEl: null });
    }

    render() {
        const { classes } = this.props;
        const options = [
            "Upload song",
            "View profile",
            "Edi profile",
            "Log out"
        ];

        if (localStorage.getItem("access_token") === null) {
            return (
                <div>
                    <Typography className={classes.loginLink} noWrap>
                        <Link href="/login" color="inherit">
                            Log in
						</Link>
                    </Typography>
                </div>
            )
        }

        return (
            <div>
                <IconButton
                    aria-controls="menu"
                    aria-haspopup="true"
                    onClick={this.handleClick}
                >
                    <AccountCircle className={classes.mediumIcon} />
                </IconButton>
                <Menu
                    id="menu"
                    anchorEl={this.state.anchorEl}
                    keepMounted
                    open={Boolean(this.state.anchorEl)}
                    onClose={this.handleClose}
                    PaperProps={{
                        style: {
                            width: "20ch",
                        },
                    }}
                    getContentAnchorEl={null}
                    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                    transformOrigin={{ vertical: "top", horizontal: "center" }}
                >
                    <MenuItem component={RouterLink} to="#" onClick={this.handleClose}>
                        Upload song
                    </MenuItem>
                    <MenuItem component={RouterLink} to="#" onClick={this.handleClose}>
                        View profile
                    </MenuItem>
                    <MenuItem component={RouterLink} to="/editprofile" onClick={this.handleClose}>
                        Edit profile
                    </MenuItem>
                    <MenuItem component={RouterLink} to="/logout" onClick={this.handleClose}>
                        Log out
                    </MenuItem>
                </Menu>
            </div>
        )
    }
}

export default withStyles(styles)(ProfileIcon);