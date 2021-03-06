import React, { Component } from "react";
import { Typography, withStyles } from "@material-ui/core";
import Profile from "./Profile";

const styles = theme => ({
	message: {
		margin: "auto",
		marginTop: 75,
		textAlign: "center"
	},
});

class SongUploaded extends Component {
	render() {
		const { classes } = this.props;

		return (
			<div>
				<Typography className={classes.message}>
					Your song has been uploaded.
                </Typography>
				<Profile />
			</div>
		)
	}
}

export default withStyles(styles)(SongUploaded);