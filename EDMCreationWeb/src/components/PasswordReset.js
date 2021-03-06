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

class PasswordReset extends Component {
	render() {
		const { classes } = this.props;

		return (
			<div>
				<Typography className={classes.message}>
					Your password has been reset successfully.
                </Typography>
				<LogIn />
			</div>
		)
	}
}

export default withStyles(styles)(PasswordReset);