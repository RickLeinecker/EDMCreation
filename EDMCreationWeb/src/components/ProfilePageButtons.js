import React, { Component } from "react";
import { withStyles, Grid, Button } from "@material-ui/core";

const styles = theme => ({
    root: {
        margin: "auto",
        marginTop: 20,
        marginBottom: 20,
        maxWidth: 800,
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
    buttonLink: {
        textDecoration: "none"
    }
});

class PageButtons extends Component {
    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <Grid container direction="row" justify="space-between">
                    <Grid item>
                        {parseInt(this.props.page) <= 1 ?
                            <Button disabled="true" className={classes.buttonBlock}>
                                Previous
                            </Button> :
                            <Button className={classes.buttonBlock} onClick={() => this.props.fetchSongs(parseInt(this.props.page) - 1)}>
                                Previous
						    </Button>
                        }
                    </Grid>
                    <Grid item>
                        {this.props.lastPage ?
                            <Button disabled="true" className={classes.buttonBlock}>
                                Next
                            </Button> :
                            <Button disabled={this.props.lastPage} className={classes.buttonBlock} onClick={() => this.props.fetchSongs(parseInt(this.props.page) + 1)}>
                                Next
						    </Button>}
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default withStyles(styles)(PageButtons);