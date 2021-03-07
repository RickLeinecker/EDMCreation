import React, { Component } from "react";
import { withStyles } from "@material-ui/core";
import Profile from "./Profile";
import Message from "./Message";

const styles = theme => ({
	root: {},
});

class AccountEmailUpdated extends Component {
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
				<Message message="Your account has been updated. Check your email for a verification link." />
				<Profile />
			</div>
		)
	}
}

export default withStyles(styles)(AccountEmailUpdated);