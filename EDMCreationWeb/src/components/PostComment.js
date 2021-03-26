import React, { Component } from "react";
import { withStyles, Grid, TextField, Button, Typography, Link, Snackbar, IconButton } from "@material-ui/core";
import axios from "axios";
import { url } from "./URL";
import { Close } from '@material-ui/icons';

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
	links: {
		color: "#219653",
		hover: {
			color: "#219653"
		},
	},
	snackbar: {
		background: "#005ce6",
		color: "white"
	}
});

class PostComment extends Component {
	constructor(props) {
		super(props);

		this.state = {
			comment: "",
			disableButton: true,
			open: false
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.changeButton = this.changeButton.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.handleClose = this.handleClose.bind(this);
	}

	handleChange(e) {
		this.setState({ [e.target.name]: e.target.value }, function () { this.changeButton() });
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

		const claims = {
			song_id: this.props.songId,
			comment: this.state.comment
		};

		const config = {
			headers: {
				'Authorization': ['Bearer ' + localStorage.getItem("access_token")]
			}
		};

		axios.post(url + "/api/compositions/postcomment", claims, config)
			.then(res => {
				this.setState({ open: true })
				document.getElementById("commentBox" + this.props.songNumber).value = "";
				this.setState({ disableButton: true });
				this.props.fetchSongs();
			});
	}

	handleClick() {
		this.setState({ open: true })
	}

	handleClose(e, reason) {
		if (reason === 'clickaway') {
			return;
		}

		this.setState({ open: false })
	}

	render() {
		const { classes } = this.props;

		if (localStorage.getItem("access_token") === null) {
			return (
				<div>
					<Typography>
						Post a comment
					</Typography>
					<br />
					<Typography variant="h5body2">
						<Link href="/login" className={classes.links}>Log in</Link> to post a comment
					</Typography>
				</div>
			)
		}

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
										id={"commentBox" + this.props.songNumber}
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
				<Snackbar
					anchorOrigin={{
						vertical: 'top',
						horizontal: 'center',
					}}
					open={this.state.open}
					autoHideDuration={6000}
					onClose={this.handleClose}
					message="Your comment has been posted."
					ContentProps={{
						classes: {
							root: classes.snackbar
						}
					}}
					action={
						<React.Fragment>
							<IconButton size="small" aria-label="close" color="inherit" onClick={this.handleClose}>
								<Close fontSize="small" />
							</IconButton>
						</React.Fragment>
					}
				/>
			</div>
		);
	}
}

export default withStyles(styles)(PostComment);