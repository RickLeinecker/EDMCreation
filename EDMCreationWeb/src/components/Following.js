import React, { Component } from "react";
import {
    Typography,
    withStyles,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Divider,
    Grid,
    Button,
    Link
} from "@material-ui/core";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { url } from "./URL";

const styles = theme => ({
    root: {
        flexGrow: 1,
        margin: "auto",
        marginTop: 30,
        marginBottom: 75,
        maxWidth: 800,
    },
    div: {
        paddingBottom: 0,
        paddingLeft: 40,
        paddingRight: 40,
        margin: "auto",
        marginBottom: 20,
        backgroundColor: "#1e1e1e",
        borderRadius: theme.shape.borderRadius,
    },
    buttonBlock: {
        paddingLeft: "25px",
        paddingRight: "25px",
    },
    avatar: {
        width: 65,
        height: 65,
    },
    listItemAvatar: {
        marginRight: 25
    },
    divider: {
        marginBottom: 20,
        marginTop: 20
    },
});

class Following extends Component {
    constructor(props) {
        super(props);

        this.state = {
            followedUsers: [],
            loggedInUser: [localStorage.getItem("username")],
            page: 1,
            hasMore: true,
            timeout: 0,
        }

        this.fetchData = this.fetchData.bind(this);
        this.toggleFollow = this.toggleFollow.bind(this);
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData() {
        setTimeout(() => {
            axios.get(url + "/api/users/following?page=" + this.state.page + "&username=" + this.props.username)
                .then(res => {
                    if (res.data.length === 0) {
                        this.setState({ hasMore: false });
                    }

                    if (this.state.page > 1) {
                        this.setState({ timeout: 1500 });
                    }

                    this.setState({ followedUsers: this.state.followedUsers.concat(res.data), page: [this.state.page + 1] },
                        () => {
                            for (var i = 0; i < this.state.followedUsers.length; i++) {
                                this.setState({ ["followed" + i]: true });
                            }
                        }
                    );
                });
        }, this.state.timeout);
    }

    toggleFollow(userId, i) {
        const config = {
            headers: {
                'Authorization': ['Bearer ' + localStorage.getItem("access_token")]
            }
        };

        const claims = {
            follow_id: userId
        }

        axios.post(url + "/api/users/followtoggle", claims, config)
            .then(res => {
                if (res.data.msg === "Followed") {
                    this.setState({ ["followed" + i]: true });
                }
                else {
                    this.setState({ ["followed" + i]: false });
                }
            });
    }

    render() {
        const { classes } = this.props;

        if (Object.keys(this.state.followedUsers).length === 0) {
            return (
                <div className={classes.root}>
                    <Typography variant="body2">
                        This user has not followed anyone.
					</Typography>
                </div>
            );
        }

        if (Object.keys(this.props.username).length === 0) {
            return (
                null
            );
        }

        if (Object.keys(this.state.loggedInUser) === "") {
            return (
                null
            );
        }

        return (
            <div className={classes.root}>
                <div className={classes.div}>
                    <List>
                        <InfiniteScroll
                            dataLength={this.state.followedUsers.length}
                            next={this.fetchData}
                            hasMore={this.state.hasMore}
                            loader={
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <h4>Loading...</h4>
                                </div>
                            }
                        >
                            {this.state.followedUsers.map((user, i, arr) => (
                                <div>
                                    <Grid item container alignItems="center">
                                        <Grid item xs={8}>
                                            <ListItem>
                                                <ListItemAvatar className={classes.listItemAvatar}>
                                                    <Avatar alt={user.username.toString().toUpperCase()} src="#" className={classes.avatar} />
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={
                                                        <React.Fragment>
                                                            <Typography
                                                                component="span"
                                                                variant="h6"
                                                                color="textPrimary"
                                                            >
                                                                <Link href={"/profile?username=" + user.username} color="inherit">{user.username}</Link>
                                                            </Typography>
                                                        </React.Fragment>
                                                    }
                                                    secondary={
                                                        <React.Fragment>
                                                            <Typography
                                                                component="span"
                                                                variant="body2"
                                                                color="textPrimary"
                                                            >
                                                                <i>{user.description}</i>
                                                            </Typography>
                                                        </React.Fragment>
                                                    } />
                                            </ListItem>
                                        </Grid>
                                        {this.state.loggedInUser.toString() === this.props.username.toString() &&
                                            <Grid item xs align="right">
                                                <Button onClick={() => this.toggleFollow(user.user_id, i)} className={classes.buttonBlock} variant="outlined">
                                                    {this.state["followed" + i] ? "Unfollow" : "Follow"}
                                                </Button>
                                            </Grid>
                                        }
                                    </Grid>
                                    {i + 1 !== arr.length ? (<Divider variant="inset" component="li" className={classes.divider} />) : <div />}
                                </div>
                            ))}
                        </InfiniteScroll>
                    </List>
                </div>
            </div >
        );
    }
}

export default withStyles(styles)(Following);