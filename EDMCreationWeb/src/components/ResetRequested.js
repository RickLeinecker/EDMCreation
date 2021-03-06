import React, { Component } from "react";
import { Typography, withStyles } from "@material-ui/core";
import LogIn from "./LogIn";

const styles = theme => ({
	message: {
		margin: "auto",
		marginTop: 75,
		textAlign: "center"
	},
});

class ResetRequested extends Component {
	render() {
		const { classes } = this.props;

		return (
			<div>
				<Typography className={classes.message}>
					Password reset link sent. Check your email for the link.
                </Typography>
				<LogIn />
			</div>
		)
	}
}

export default withStyles(styles)(ResetRequested);