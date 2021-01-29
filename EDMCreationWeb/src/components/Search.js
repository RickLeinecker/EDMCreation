import React, { Component } from "react";
import { Typography, withStyles } from "@material-ui/core";
import Compositions from "./Compositions";
import dummyCompositions from "../dummy-data/dummy-compositions.json";
import qs from "query-string";

const styles = theme => ({
    title: {
        margin: "auto",
        marginTop: 20,
        marginBottom: 20,
        maxWidth: 800,
    },
});

class Search extends Component {
    render() {
        const { classes } = this.props;
        const paramaters = qs.parse(this.props.location.search);

        return (
            <div>
                <Typography variant="h5" className={classes.title}>
                    Search results for "{paramaters.query}"
                </Typography>
                <Compositions compositions={dummyCompositions} />
            </div>
        )
    }
}

export default withStyles(styles)(Search);