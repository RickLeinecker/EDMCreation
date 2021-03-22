import React, { Component } from "react";
import { withStyles } from "@material-ui/core";
import LogIn from "./LogIn";
import Message from "./Message";

const styles = theme => ({
	root: {},
	message: {
		marginBottom: -20
	}
});

class ResetRequested extends Component {
	constructor(props) {
		super(props);

		this.state = {
			showMessage: true,
		}
	}

	render() {
		const { classes } = this.props;

		return (
			<div>
				<div className={classes.message}>
					<Message message="A password reset link was sent. Check your email for the link." />
				</div>
				<LogIn />
			</div>
		)
	}
}

export default withStyles(styles)(ResetRequested);