import React, { Component } from "react";
import { Typography, withStyles, Link, IconButton, Menu, MenuItem } from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";
import { AccountCircle } from '@material-ui/icons/';
import axios from "axios";

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
            username: ""
        };

        this.handleClick = this.handleClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    componentDidMount() {
        axios.get("http://localhost:5000/api/testuser")
            .then(res => this.setState({ username: res.data.username }));
    }

    handleClick(e) {
        this.setState({ anchorEl: e.currentTarget });
    }

    handleClose() {
        this.setState({ anchorEl: null });
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
                    {this.state.username}
                    <IconButton
                        aria-controls="menu"
                        aria-haspopup="true"
                        onClick={this.handleClick}
                    >
                        <AccountCircle className={classes.mediumIcon} />
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