import React, { Component } from "react";
import { withStyles, IconButton, Collapse } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { Close } from "@material-ui/icons";

const styles = theme => ({
	message: {
		flexGrow: 1,
		margin: "auto",
		marginTop: 50,
		maxWidth: 400,
		"&.MuiAlert-filledSuccess": {
			backgroundColor: "#005ce6"
		}
	},
});

class Message extends Component {
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
				<Collapse in={this.state.showMessage}>
					<Alert
						severity="success"
						variant="filled"
						className={classes.message}
						action={
							<IconButton
								aria-label="close"
								color="inherit"
								size="small"
								onClick={() => {
									this.setState({ showMessage: false });
								}}
							>
								<Close fontSize="inherit" />
							</IconButton>
						}
					>
						{this.props.message}
        			</Alert>
				</Collapse>
			</div>
		)
	}
}

export default withStyles(styles)(Message);