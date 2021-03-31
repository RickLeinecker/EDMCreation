import React, { Component } from "react";
import { withStyles } from "@material-ui/core";
import LogIn from "./LogIn";
import Message from "./Message";
import axios from "axios";
import { url } from "./URL";
import qs from "query-string";

const styles = theme => ({
	root: {},
	message: {
		marginBottom: -20
	}
});

class SendVerification extends Component {
	constructor(props) {
		super(props);

		this.state = {
			showMessage: true,
		}
	}

	componentDidMount() {
		this.parameters = qs.parse(this.props.location.search);
		
		axios.get(url + "/api/users/sendverification?email=" + this.parameters.email);
	}

	render() {
		const { classes } = this.props;

		return (
			<div>
				<div className={classes.message}>
					<Message message="Verification link sent. Check your email for the link." />
				</div>
				<LogIn />
			</div>
		)
	}
}

export default withStyles(styles)(SendVerification);