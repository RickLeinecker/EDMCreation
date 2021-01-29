import React, { Component } from "react";
import { Typography, withStyles } from "@material-ui/core";
import Compositions from "./Compositions";
import dummyCompositions from "../dummy-data/dummy-compositions.json";

const styles = theme => ({
	title: {
		margin: "auto",
		marginTop: 20,
		marginBottom: 20,
		maxWidth: 800,
	},
});

class Random extends Component {
	render() {
		const { classes } = this.props;

		return (
			<div>
				<Typography variant="h5" className={classes.title}>
					Random
                </Typography>
			</div>
		)
	}
}

export default withStyles(styles)(Random);