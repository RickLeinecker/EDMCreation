import React, { Component } from "react";
import { Typography, withStyles, Grid, Button } from "@material-ui/core";
import Songs from "./Songs";
import axios from "axios";
import qs from "query-string";
import { url } from "./URL";
import { Refresh } from '@material-ui/icons/';

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
	refreshBox: {
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
	buttonLink: {
		textDecoration: "none"
	}
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
		axios.get(url + "/api/compositions/random?page=" + this.state.page)
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
				<div className={classes.refreshBox}>
					<Grid container justify="center">
						<Grid item>
							<Button onClick={() => window.location.href = "/random"} className={classes.buttonBlock}>
								<Refresh /> &nbsp; Refresh
							</Button>
						</Grid>
					</Grid>
				</div>
			</div>
		)
	}
}

export default withStyles(styles)(Random);