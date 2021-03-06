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

class SongUpdated extends Component {
	render() {
		const { classes } = this.props;

		return (
			<div>
				<Typography className={classes.message}>
					Song has been updated.
                </Typography>
				<Profile />
			</div>
		)
	}
}

export default withStyles(styles)(SongUpdated);