import React, { Component } from "react";
import { withStyles } from "@material-ui/core";
import Profile from "./Profile";
import Message from "./Message";

const styles = theme => ({
	root: {},
});

class AccountUpdated extends Component {
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
				<Message message="Your account has been updated." />
				<Profile />
			</div>
		)
	}
}

export default withStyles(styles)(AccountUpdated);