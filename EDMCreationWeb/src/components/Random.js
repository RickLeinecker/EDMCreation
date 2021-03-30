import React, { Component } from "react";
import { Typography, withStyles } from "@material-ui/core";
import Songs from "./Songs";
import axios from "axios";
import qs from "query-string";
import PageButtons from "./PageButtons";
import { url } from "./URL";

const styles = theme => ({
	title: {
		margin: "auto",
		marginTop: 20,
		marginBottom: 20,
		maxWidth: 800,
	},
	buttonBlock: {
		backgroundColor: "#219653",
		color: "white",
		"&:hover": {
			backgroundColor: "#219653"
		},
		"&:disabled": {
			backgroundColor: "#BDBDBD"
		},
		paddingLeft: "25px",
		paddingRight: "25px",
	},
});

class Random extends Component {
	constructor(props) {
		super(props);

		this.parameters = qs.parse(this.props.location.search);

		this.state = {
			songs: [],
			page: [this.parameters.page !== undefined ? this.parameters.page : 1]
		}

		this.fetchSongs = this.fetchSongs.bind(this);
	}

	componentDidMount() {
		this.fetchSongs();
	}

	fetchSongs() {
		axios.get(url + "/api/compositions/popular?page=" + this.state.page)
			.then(res => this.setState({ songs: res.data }));
	}

	render() {
		const { classes } = this.props;

		return (
			<div>
				<Typography variant="h5" className={classes.title}>
					Random
                </Typography>
				<Songs songs={this.state.songs} fetchSongs={this.fetchSongs} />
				<PageButtons path={"/random?"} page={this.state.page} />
			</div>
		)
	}
}

export default withStyles(styles)(Random);