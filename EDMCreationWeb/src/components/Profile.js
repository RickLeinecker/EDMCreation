import React, { Component } from "react";
import { Typography, withStyles, Grid, Paper, Tabs, Tab, Box } from "@material-ui/core";
import PropTypes from "prop-types";
import { AccountBox, PlayArrow, MusicNote } from '@material-ui/icons/';
import Compositions from "./Songs";
import axios from "axios";

const styles = theme => ({
    profile: {
        margin: "auto",
        maxWidth: 800,
        marginTop: 50,
    },
    paper: {
        paddingTop: 15,
        paddingBottom: 0,
        paddingLeft: 40,
        paddingRight: 40,
        margin: "auto",
        marginBottom: 20,
        backgroundColor: "#333333",
        borderRadius: theme.shape.borderRadius,
    },
    largeIcon: {
        fontSize: "16em",
    },
    profileArea: {
        paddingTop: 15,
        paddingBottom: 32,
    },
    smallIcon: {
        fontSize: "1.1em",
        marginRight: theme.spacing(0.5),
    },
    statsSection: {
        display: "flex",
        marginBottom: 10,
    },
    statItem: {
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        marginRight: theme.spacing(2),
    },
    description: {
        fontStyle: "italic",
    },
    tabs: {
        background: "#4f4f4f",
    },
    tab: {
        "&:hover": {
            background: "rgba(255, 255, 255,  0.16)",
        },
    },
    activeTab: {
        backgroundColor: "#219653",
    },
    indicator: {
        backgroundColor: "#219653",
    },
    user: {
        marginBottom: 5
    }
});

class Profile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: 0,
            songs: {},
            user: {}
        }

        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        axios.get("http://localhost:5000/api/testsongs")
            .then(res => this.setState({ songs: res.data }));

        axios.get("http://localhost:5000/api/testuser")
            .then(res => this.setState({ user: res.data }));
    }

    handleChange(e, newValue) {
        this.setState({ value: newValue });
    }

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.profile}>
                <Grid container>
                    <Grid item align="center">
                        <AccountBox className={classes.largeIcon} />
                    </Grid>
                    <Grid container direction="column" xs justify="space-between" className={classes.profileArea}>
                        <Grid container direction="column">
                            <Grid item className={classes.user}>
                                <Typography variant="h4">
                                    {this.state.user.username}
                                </Typography>
                            </Grid>
                            <Grid item className={classes.description}>
                                <Typography variant="body1">
                                    {this.state.user.description}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid container direction="column">
                            <Grid item>
                                <Typography variant="body1" className={classes.statsSection}>
                                    <span className={classes.statItem}>
                                        <PlayArrow className={classes.smallIcon} /> Total Plays: {this.state.user.total_plays}
                                    </span>
                                    <span className={classes.statItem}>
                                        <MusicNote className={classes.smallIcon} /> Uploads: {this.state.user.uploads}
                                    </span>
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Paper square>
                                    <Tabs
                                        value={this.state.value}
                                        onChange={this.handleChange}
                                        aria-label="tabs"
                                        className={classes.tabs}
                                        TabIndicatorProps={{ className: classes.indicator }}
                                    >
                                        <Tab label="Uploads" {...a11yProps(0)} className={this.state.value === 0 ? classes.activeTab : classes.tab} />
                                        <Tab label="Favorites" {...a11yProps(1)} className={this.state.value === 1 ? classes.activeTab : classes.tab} />
                                        <Tab label="Following" {...a11yProps(2)} className={this.state.value === 2 ? classes.activeTab : classes.tab} />
                                    </Tabs>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <TabPanel value={this.state.value} index={0}>
                    <Compositions songs={this.state.songs} />
                </TabPanel>
                <TabPanel value={this.state.value} index={1}>
                    Favorites
                </TabPanel>
                <TabPanel value={this.state.value} index={2}>
                    Following
                </TabPanel>
            </div >
        )
    }
}

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `tab-${index}`,
        'aria-controls': `tabpanel-${index}`,
    };
}

export default withStyles(styles)(Profile);