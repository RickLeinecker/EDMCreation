import React, { Component } from "react";
import { Typography, withStyles } from "@material-ui/core";
import Songs from "./Songs";
import qs from "query-string";
import axios from "axios";

const styles = theme => ({
    title: {
        margin: "auto",
        marginTop: 20,
        marginBottom: 20,
        maxWidth: 800,
    },
});

class Search extends Component {
    constructor(props) {
		super(props);

		this.state = {
			songs: {}
		}
	}

	componentDidMount() {
		axios.get("http://localhost:5000/api/testsongs")
			.then(res => this.setState({ songs: res.data }));
    }
    
    render() {
        const { classes } = this.props;
        const paramaters = qs.parse(this.props.location.search);

        return (
            <div>
                <Typography variant="h5" className={classes.title}>
                    Search results for "{paramaters.query}"
                </Typography>
                <Songs songs={this.state.songs} />
            </div>
        )
    }
}

export default withStyles(styles)(Search);