import React, { Component } from "react";
import { Typography, withStyles, Link, IconButton, Menu, MenuItem, Avatar } from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";
import { AccountCircle } from '@material-ui/icons/';
import axios from "axios";
import { url } from "./URL";

const styles = theme => ({
    loginLink: {
        [theme.breakpoints.up("sm")]: {
            width: "auto",
        },
    },
    mediumIcon: {
        fontSize: "1.5em",
    },
    avatar: {
        width: 30,
        height: 30,
        backgroundColor: "rgba(255, 255, 255, 0.7)"
    },
});

class ProfileIcon extends Component {
    constructor(props) {
        super(props);

        this.state = {
            anchorEl: null,
            username: ""
        };

        this.handleClick = this.handleClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.getUserInfo = this.getUserInfo.bind(this);
    }

    componentDidMount() {
        this.setState(
            { username: [localStorage.getItem("username")] },
            // () => {
            //     this.getUserInfo();
            // }
        );
    }

    handleClick(e) {
        this.setState({ anchorEl: e.currentTarget });
    }

    handleClose() {
        this.setState({ anchorEl: null });
    }

    getUserInfo() {
        axios.get(url + "/api/users/info/" + this.state.username)
            .then(res => this.setState({ image_id: res.data.image_id }));
    }

    render() {
        const { classes } = this.props;

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
                <Typography>
                    <Link href="/profile" color="inherit">{this.state.username}</Link>
                    <IconButton
                        aria-controls="menu"
                        aria-haspopup="true"
                        onClick={this.handleClick}
                    >
                        {/* <AccountCircle className={classes.mediumIcon} /> */}
                        <Avatar alt={this.state.username.toString().toUpperCase()} src="#" className={classes.avatar} />
                    </IconButton>
                </Typography>
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
                    <MenuItem component={RouterLink} to="/uploadsong" onClick={this.handleClose}>
                        Upload song
                    </MenuItem>
                    <MenuItem component={RouterLink} to="/profile" onClick={this.handleClose}>
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