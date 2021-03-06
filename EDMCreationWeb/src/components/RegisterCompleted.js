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

class RegisterCompleted extends Component {
	render() {
		const { classes } = this.props;

		return (
			<div>
				<Typography className={classes.message}>
					You are now registered! Check your email for a verification link.
                </Typography>
				<LogIn />
			</div>
		)
	}
}

export default withStyles(styles)(RegisterCompleted);