import React, { Component } from "react";
import { Typography, withStyles } from "@material-ui/core";
import Compositions from "./Compositions";
import axios from "axios";

const styles = theme => ({
	title: {
		margin: "auto",
		marginTop: 20,
		marginBottom: 20,
		maxWidth: 800,
	},
});

class Popular extends Component {
	constructor(props) {
		super(props);

		this.state = {
			compositions: {}
		}
	}

	componentDidMount() {
		axios.get("http://localhost:5000/api/testcompositions")
			.then(res => this.setState({ compositions: res.data }));
	}

	render() {
		const { classes } = this.props;

		return (
			<div>
				<Typography variant="h5" className={classes.title}>
					Popular
                </Typography>
				<Compositions compositions={this.state.compositions} />
			</div>
		)
	}
}

export default withStyles(styles)(Popular);