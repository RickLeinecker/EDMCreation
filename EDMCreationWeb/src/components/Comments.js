import React, { Component } from "react";
import { Typography, Grid, withStyles, Paper } from "@material-ui/core";
import { AccountCircle } from "@material-ui/icons";

const styles = theme => ({
    username: {
        marginRight: 5,
        color: "#219653"
    },
    date: {
        color: "#828282"
    },
    mediumIcon: {
        fontSize: "3em",
    },
    userSection: {
        marginBottom: 10,
    },
    comment: {
        marginBottom: 13
    },
    commentsBox: {
        backgroundColor: "#333333",
        maxHeight: 250,
        overflow: "auto"
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
                        <Grid container spacing={2} className={classes.comment}>
                            <Grid item>
                                <Typography variant="body2">
                                    <AccountCircle className={classes.mediumIcon} />
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm>
                                <Grid item container>
                                    <Grid item className={classes.userSection}>
                                        <Typography variant="body2" className={classes.username}>
                                            {comment.username}
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="body2" className={classes.date}>
                                            {comment.date}
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