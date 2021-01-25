import React, { Component } from "react";
import { withStyles, Grid, TextField, Button, Typography } from "@material-ui/core";

const styles = theme => ({
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
	inputBox: {
		backgroundColor: "white",
		color: "black",
		"&.Mui-focused": {
			backgroundColor: "white",
			color: "black",
		},
		"&.MuiOutlinedInput-root": {
			"& fieldset": {
				borderColor: "white",
			},
			"&:hover fieldset": {
				borderColor: "white",
			},
			"&.Mui-focused fieldset": {
				borderColor: "white",
				color: "black",
			},
		},
	},
	inputBoxLabel: {
		"&.Mui-focused": {
			color: "black"
		}
	},
});

class PostComment extends Component {
	constructor(props) {
		super(props);

		this.state = {
			comment: "",
			disableButton: true
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.changeButton = this.changeButton.bind(this);
	}

	handleChange(e) {
		this.setState({ [e.target.name]: e.target.value }, function() {this.changeButton()});
	}

	changeButton() {
		if (this.state.comment !== "") {
			this.setState({ disableButton: false });
		}
		else {
			this.setState({ disableButton: true });
		}
	}

	handleSubmit(e) {
		e.preventDefault();
	}

	render() {
		const { classes } = this.props;

		return (
			<div>
				<Typography>
					Post a comment
                </Typography>
				<br />
				<Grid container direction="column" spacing={2}>
					<Grid item>
						<form onSubmit={this.handleSubmit}>
							<Grid container direction="column" spacing={2}>
								<Grid item>
									<TextField
										type="text"
										placeholder="Comment"
										fullWidth
										multiline="true"
										rows="5"
										name="comment"
										variant="outlined"
										onChange={this.handleChange}
										InputProps={{ className: classes.inputBox }}
										InputLabelProps={{ className: classes.inputBoxLabel }}
									/>
								</Grid>
								<Grid item>
									<br />
									<Grid container direction="row" justify="space-between" alignItems="center">
										<Grid item>
											<Button disabled={this.state.disableButton} type="submit" className={classes.buttonBlock}>
												Post
											</Button>
										</Grid>
									</Grid>
								</Grid>
							</Grid>
						</form>
					</Grid>
				</Grid>
			</div>
		);
	}
}

export default withStyles(styles)(PostComment);