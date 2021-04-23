import React, { Component } from "react";
import {
    Grid,
    Typography,
    withStyles,
    Paper,
    Link
} from "@material-ui/core";
import {
    GetApp,
    AccountBox,
    Publish,
    Edit
} from '@material-ui/icons';

const styles = theme => ({
    root: {
        flexGrow: 1,
        margin: "auto",
        maxWidth: 800,
    },
    title: {
        margin: "auto",
        marginTop: 20,
        marginBottom: 30,
        maxWidth: 800,
    },
    paper: {
        paddingTop: 40,
        paddingBottom: 40,
        paddingLeft: 40,
        paddingRight: 40,
        margin: "auto",
        marginBottom: 20,
        backgroundColor: "#333333",
        borderRadius: theme.shape.borderRadius,
        minHeight: 200
    },
    largeIcon: {
        fontSize: "5em",
    },
    iconGrid: {
        marginLeft: 20
    },
    makeAccountLink: {
        color: "#219653",
        hover: {
            color: "#219653"
        },
    },
});

class Songs extends Component {
    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <Typography variant="h5" className={classes.title}>
                    Getting Started
                </Typography>
                <Paper className={classes.paper}>
                    <Grid container direction="row">
                        <Grid item xs={3}>
                            <Typography variant="h5">
                                Step 1
                            </Typography>
                        </Grid>
                        <Grid item xs>
                            <Typography variant="subtitle1">
                                Dowload the desktop application <Link href={"#"} className={classes.makeAccountLink}>here</Link> and follow the instructions to begin generating EDM music.
                            </Typography>
                        </Grid>
                        <Grid item xs={1} className={classes.iconGrid}>
                            <GetApp className={classes.largeIcon} />
                        </Grid>
                    </Grid>
                </Paper>
                <Paper className={classes.paper}>
                    <Grid container direction="row">
                        <Grid item xs={3}>
                            <Typography variant="h5">
                                Step 2
                            </Typography>
                        </Grid>
                        <Grid item xs>
                            <Typography variant="subtitle1">
                                Edit the music in a DAW.
                            </Typography>
                        </Grid>
                        <Grid item xs={1} className={classes.iconGrid}>
                            <Edit className={classes.largeIcon} />
                        </Grid>
                    </Grid>
                </Paper>
                <Paper className={classes.paper}>
                    <Grid container direction="row">
                        <Grid item xs={3}>
                            <Typography variant="h5">
                                Step 3
                            </Typography>
                        </Grid>
                        <Grid item xs>
                            <Typography variant="subtitle1">
                                Make an account for the site by clicking <Link href={"/register"} className={classes.makeAccountLink}>here</Link> and fill out your information.
                            </Typography>
                        </Grid>
                        <Grid item xs={1} className={classes.iconGrid}>
                            <AccountBox className={classes.largeIcon} />
                        </Grid>
                    </Grid>
                </Paper>
                <Paper className={classes.paper}>
                    <Grid container direction="row">
                        <Grid item xs={3}>
                            <Typography variant="h5">
                                Step 4
                            </Typography>
                        </Grid>
                        <Grid item xs>
                            <Typography variant="subtitle1">
                                Start uploading your creations through the upload tab under the profile menu at the top right of the page once you're signed in.
                            </Typography>
                        </Grid>
                        <Grid item xs={1} className={classes.iconGrid}>
                            <Publish className={classes.largeIcon} />
                        </Grid>
                    </Grid>
                </Paper>
            </div >
        );
    }
}

export default withStyles(styles)(Songs);