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
                        {this.props.page == 1 ?
                            <Button disabled="true" className={classes.buttonBlock}>
                                Previous
                            </Button> :
                            <Link to={"/popular?page=" + (parseInt(this.props.page) - 1)} className={classes.buttonLink}>
                                <Button className={classes.buttonBlock}>
                                    Previous
						        </Button>
                            </Link>}
                    </Grid>
                    <Grid item>
                        <Link to={"/popular?page=" + (parseInt(this.props.page) + 1)} className={classes.buttonLink}>
                            <Button className={classes.buttonBlock}>
                                Next
						    </Button>
                        </Link>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default withStyles(styles)(PageButtons);