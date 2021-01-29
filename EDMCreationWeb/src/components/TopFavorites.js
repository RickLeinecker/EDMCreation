import React, { Component } from "react";
import { Typography, withStyles } from "@material-ui/core";
import Compositions from "./Songs";

const styles = theme => ({
	title: {
		margin: "auto",
		marginTop: 20,
		marginBottom: 20,
		maxWidth: 800,
	},
});

class TopFavorites extends Component {
	render() {
		const { classes } = this.props;

		return (
			<div>
				<Typography variant="h5" className={classes.title}>
					Top Favorites
                </Typography>
			</div>
		)
	}
}

export default withStyles(styles)(TopFavorites);