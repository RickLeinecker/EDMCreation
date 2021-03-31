import React, { Component } from "react";
import { Typography, withStyles } from "@material-ui/core";
import Songs from "./Songs";
import qs from "query-string";
import axios from "axios";
import { url } from "./URL";
import PageButtons from "./PageButtons";

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

        this.parameters = qs.parse(this.props.location.search);

        this.state = {
            songs: [],
            page: [this.parameters.page !== undefined ? this.parameters.page : 1],
            uploadsLastPage: true,
        }

        if (this.props.location !== undefined &&
            Object.keys(qs.parse(this.props.location.search)).length !== 0) {

            if (this.parameters.query !== undefined) {
                this.state.query = this.parameters.query;
            }
            else {
                window.location.href = "/";
            }
        }
        else {
            window.location.href = "/";
        }

        this.fetchSongs = this.fetchSongs.bind(this);
    }

    componentDidMount() {
        this.fetchSongs();
    }

    fetchSongs() {
        axios.get(url + "/api/compositions/search?page=" + this.state.page + "&search=" + this.state.query)
            .then(res => this.setState({ songs: res.data.songs, lastPage: res.data.lastPage }));
    }

    render() {
        const { classes } = this.props;

        return (
            <div>
                <Typography variant="h5" className={classes.title}>
                    Search results for "{this.state.query}"
                </Typography>
                <Songs songs={this.state.songs} fetchSongs={this.fetchSongs} />
                <PageButtons path={"/search?query=" + this.state.query + "&"} page={this.state.page} lastPage={this.state.lastPage} />
            </div>
        )
    }
}

export default withStyles(styles)(Search);