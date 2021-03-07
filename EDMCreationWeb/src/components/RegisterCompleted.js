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

class RegisterCompleted extends Component {
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
					<Message message="You are now registered. Check your email for a verification link." />
				</div>
				<LogIn />
			</div>
		)
	}
}

export default withStyles(styles)(RegisterCompleted);