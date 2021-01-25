import React, { Component } from "react";
import { Typography, withStyles, Link } from "@material-ui/core";

const styles = theme => ({
	loginLink: {
		[theme.breakpoints.up("sm")]: {
			marginLeft: theme.spacing(4),
			width: "auto",
		},
	},
});

class ProfileIcon extends Component {
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
                <Typography className={classes.loginLink} noWrap>
                    <Link href="/logout" color="inherit">
                        Log out
					</Link>
                </Typography>
            </div >
        )
    }
}

export default withStyles(styles)(ProfileIcon);