import React, { Component } from "react";
import { Typography, withStyles } from "@material-ui/core";
import Songs from "./Songs";
import axios from "axios";
import { url } from "./URL";

const styles = theme => ({
	title: {
		margin: "auto",
		marginTop: 20,
		marginBottom: 20,
		maxWidth: 800,
	},
});

class TopFavorites extends Component {
	constructor(props) {
		super(props);

		this.state = {
			songs: []
		}

		this.fetchSongs = this.fetchSongs.bind(this);
	}

	componentDidMount() {
		this.fetchSongs();
	}

	fetchSongs() {
		axios.get(url + "/api/testsongs")
			.then(res => this.setState({ songs: res.data }));
	}

	render() {
		const { classes } = this.props;

		return (
			<div>
				<Typography variant="h5" className={classes.title}>
					Top Favorites
                </Typography>
				<Songs songs={this.state.songs} fetchSongs={this.fetchSongs} />
			</div>
		)
	}
}

export default withStyles(styles)(TopFavorites);