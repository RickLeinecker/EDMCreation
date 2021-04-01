import React, { Component } from "react";
import { Typography, withStyles } from "@material-ui/core";
import Songs from "./Songs";
import axios from "axios";
import { url } from "./URL";
import qs from "query-string";
import PageButtons from "./PageButtons";

const styles = theme => ({
	title: {
		margin: "auto",
		marginTop: 20,
		marginBottom: 20,
		maxWidth: 800,
	},
});

class Genres extends Component {
	constructor(props) {
		super(props);

		this.parameters = qs.parse(this.props.location.search);

		this.state = {
			songs: [],
			page: [this.parameters.page !== undefined ? this.parameters.page : 1],
			genre: [this.parameters.genre !== undefined ? this.parameters.genre : "Other"],
			lastPage: true
		}

		this.fetchSongs = this.fetchSongs.bind(this);
	}

	componentDidMount() {
		this.fetchSongs();
	}

	fetchSongs() {
		axios.get(url + "/api/compositions/genre?genre=" + this.state.genre + "&page=" + this.state.page)
			.then(res => {
				const lastPage = (parseInt(this.state.page) === parseInt(res.data.lastPage));

				this.setState({ songs: res.data.songs, lastPage: lastPage })
			});
	}

	render() {
		const { classes } = this.props;

		return (
			<div>
				<Typography variant="h5" className={classes.title}>
					{this.state.genre}
				</Typography>
				<Songs songs={this.state.songs} fetchSongs={this.fetchSongs} />
				<PageButtons path={"/genres?genre=" + this.state.genre + "&"} page={this.state.page} lastPage={this.state.lastPage} />
			</div>
		)
	}
}

export default withStyles(styles)(Genres);