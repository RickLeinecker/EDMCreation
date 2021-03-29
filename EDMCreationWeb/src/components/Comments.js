import React, { Component } from "react";
import { Typography, Grid, withStyles, Paper, Link } from "@material-ui/core";
import { AccountCircle } from "@material-ui/icons";
import Moment from 'react-moment';

const styles = theme => ({
    username: {
        marginRight: 5,
        color: "#219653",
        display: "inline-block",
    },
    date: {
        color: "#828282",
        fontSize: "9pt",
        display: "inline-block",
    },
    mediumIcon: {
        fontSize: "3em",
    },
    userSection: {
        marginBottom: 10,
    },
    comment: {
        marginBottom: 13,
    },
    commentsBox: {
        backgroundColor: "#333333",
        maxHeight: 250,
        overflow: "auto",
        "&::-webkit-scrollbar": {
            display: "none"
        }
    },
    profilePicture: {
        marginRight: 5
    }
});

class Comments extends Component {
    render() {
        const { classes } = this.props;

        if (this.props.comments === undefined) {
            return (
                <div>
                    <Typography>
                        Comments
                    </Typography>
                    <br />
                    <Typography variant="body2">
                        No comments
                    </Typography>
                </div>
            )
        }

        return (
            <div>
                <Typography>
                    Comments
                </Typography>
                <br />
                <Paper elevation={0} className={classes.commentsBox}>
                    {this.props.comments.map(comment => (
                        <Grid container className={classes.comment}>
                            <Grid item className={classes.profilePicture}>
                                <Typography variant="body2">
                                    <AccountCircle className={classes.mediumIcon} />
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm>
                                <Grid item container>
                                    <Grid item className={classes.userSection}>
                                        <Typography variant="body2" className={classes.username}>
                                            <Link href={"/profile?username=" + comment.username} color="inherit">{comment.username}</Link>
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="body2" className={classes.date}>
                                            <Moment fromNow ago>{(new Date(comment.created_on))}</Moment> ago
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Typography variant="body2">
                                    {comment.comment}
                                </Typography>
                            </Grid>
                        </Grid>
                    ))}
                </Paper>
            </div>
        )
    }
}

export default withStyles(styles)(Comments);