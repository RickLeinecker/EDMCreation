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
			type: ""
		}
	}

	componentDidMount() {
		this.parameters = qs.parse(this.props.location.search);

		axios.get(url + "/api/users/verify?token=" + this.parameters.token)
			.then(res => {
				if (res.data.type === "Update") {
					if (localStorage.getItem("access_token")) {
						window.location.href = "/updateemailverified";
					}
					else {
						this.setState({ type: "Register" });
					}
				}
				else {
					this.setState({ type: "Register" });
				}
			}
			)
			.catch(err => {
				this.setState({ type: "" });
			});
	}

	render() {
		const { classes } = this.props;

		if (this.state.type === "") {
			return (
				<div>
					<LogIn />
				</div>
			)
		}
		else if (this.state.type === "Register") {
			return (
				<div>
					<div className={classes.message}>
						<Message message="Your email has been verified. Thank you." />
					</div>
					<LogIn />
				</div>
			)
		}
	}
}

export default withStyles(styles)(SendVerification);