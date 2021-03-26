import React, { Component } from "react";
import { Typography, withStyles, Grid, Paper, Tabs, Tab, Box, Button } from "@material-ui/core";
import PropTypes from "prop-types";
import { AccountBox, PlayArrow, MusicNote } from '@material-ui/icons/';
import Songs from "./Songs";
import Following from "./Following";
import axios from "axios";
import qs from "query-string";
import { url } from "./URL";
import PageButtons from "./PageButtons";

const styles = theme => ({
    profile: {
        margin: "auto",
        maxWidth: 800,
        marginTop: 30,
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
    },
    statItem: {
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        marginRight: theme.spacing(2),
    },
    statsLine: {
        marginBottom: 10,
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

class Profile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: 0,
            songs: [],
            user: [],
            page: 1,
            currentUser: [localStorage.getItem("username")]
        }

        if (Object.keys(qs.parse(this.props.location.search)).length !== 0) {
            this.parameters = qs.parse(this.props.location.search);

            if (this.parameters.username !== undefined) {
                this.state.username = this.parameters.username;
            }
            else {
                this.state.username = localStorage.getItem("username");
            }

            if (this.parameters.tab !== undefined) {
                this.state.value = parseInt(this.parameters.tab);
            }

            if (this.parameters.page !== undefined) {
                this.state.page = this.parameters.page;
            }
        }
        else {
            this.state.username = localStorage.getItem("username");
        }

        this.handleChange = this.handleChange.bind(this);
        this.fetchSongs = this.fetchSongs.bind(this);
    }

    componentDidMount() {
        axios.get(url + "/api/users/info/" + this.state.username)
            .then(res => this.setState({ user: res.data }));

        this.fetchSongs();
    }

    fetchSongs(page) {
        axios.get(url + "/api/compositions/user/" + this.state.username + "?page=" + this.state.page)
            .then(res => this.setState({ songs: res.data }));
    }

    handleChange(e, newValue) {
        this.setState({ value: newValue });
        // window.location.href = "/profile?username=" + this.state.username + "&tab=" + newValue;
    }

    render() {
        const { classes } = this.props;

        if (Object.keys(this.state.user).length === 0) {
            return (
                null
            );
        }

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
                            <Grid container className={classes.statsLine} alignItems="center">
                                <Grid item style={{ flexGrow: 1 }}>
                                    <Typography variant="body1" className={classes.statsSection}>
                                        <span className={classes.statItem}>
                                            <PlayArrow className={classes.smallIcon} /> Total plays: {this.state.user.listens_count}
                                        </span>
                                        <span className={classes.statItem}>
                                            <MusicNote className={classes.smallIcon} /> Uploads: {this.state.user.upload_count}
                                        </span>
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Button className={classes.buttonBlock}>
                                        Follow
									</Button>
                                </Grid>
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
                    <Songs songs={this.state.songs} fetchSongs={this.fetchSongs} editable={this.state.currentUser.toString() === this.state.user.username.toString()} />
                    <PageButtons path={"/profile?username=" + this.state.username + "&tab=0&"} page={this.state.page} />
                </TabPanel>
                <TabPanel value={this.state.value} index={1}>
                    <Songs songs={this.state.songs} fetchSongs={this.fetchSongs} deletable={this.state.currentUser.toString() === this.state.user.username.toString()} />
                    <PageButtons path={"/profile?username=" + this.state.username + "&tab=1&"} page={this.state.page} />
                </TabPanel>
                <TabPanel value={this.state.value} index={2}>
                    <Following user={this.state.user} />
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