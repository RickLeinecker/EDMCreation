import React, { Component } from "react";
import { Typography, withStyles, Grid, Button } from "@material-ui/core";
import { Link } from "react-router-dom";

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
    constructor(props) {
        super(props);
    }

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <Grid container direction="row" justify="space-between">
                    <Grid item>
                        {this.props.page <= 1 ?
                            <Button disabled="true" className={classes.buttonBlock}>
                                Previous
                            </Button> :
                            <Button className={classes.buttonBlock} onClick={() => this.props.fetchSongs(parseInt(this.props.page) - 1)}>
                                Previous
						    </Button>
                        }
                    </Grid>
                    <Grid item>
                        <Button className={classes.buttonBlock} onClick={() => this.props.fetchSongs(parseInt(this.props.page) + 1)}>
                            Next
						</Button>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default withStyles(styles)(PageButtons);