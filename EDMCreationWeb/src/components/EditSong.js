import React, { Component } from "react";
import {
	Paper,
	withStyles,
	Grid,
	TextField,
	Button,
	Typography,
	Select,
	MenuItem,
	InputLabel,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle
} from "@material-ui/core";
import Songs from "./Songs";
import axios from "axios";
import LogIn from "./LogIn";
import { url } from "./URL";
import qs from "query-string";

const styles = theme => ({
	title: {
		margin: "auto",
		marginTop: 20,
		marginBottom: 20,
		maxWidth: 800,
	},
	form: {
		justifyContent: "center",
		marginTop: 15,
		marginBottom: 10,
		borderRadius: theme.shape.borderRadius,
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
	background: {
		justifyContent: "center",
		minWidth: 800,
		paddingTop: "50px",
		paddingBottom: "90px",
		paddingLeft: "175px",
		paddingRight: "175px",
		backgroundColor: "#333333",
	},
	topBackground: {
		justifyContent: "center",
		minWidth: 650,
		backgroundColor: "#333333",
	},
	inputBox: {
		backgroundColor: "white",
		borderRadius: theme.shape.borderRadius,
		color: "black",
		"&.Mui-focused": {
			backgroundColor: "white",
			color: "black",
		},
		"&:hover": {
			backgroundColor: "white",
		},
	},
	inputBoxLabel: {
		color: "#828282",
		"&.Mui-focused": {
			color: "#828282",
		},
	},
	errorMessage: {
		color: "#EB5757",
	},
	select: {
		display: "flex",
	},
	label: {
		color: "#ffffff",
		paddingBottom: 15,
	},
	previewChip: {
		borderRadius: theme.shape.borderRadius,
		borderColor: "#ffffff",
		minWidth: 160,
		maxWidth: 210,
		marginTop: 5,
	},
	removeButton: {
		paddingLeft: "25px",
		paddingRight: "25px",
	},
});

class EditSong extends Component {
	constructor(props) {
		super(props);

		this.state = {
			songId: "",
			title: "",
			genre: "",
			currentTitle: "",
			currentGenre: "",
			song: [],
			disableButton: true,
			openDialog: false,
		};

		if (Object.keys(qs.parse(this.props.location.search)).length !== 0) {
			this.parameters = qs.parse(this.props.location.search);

			if (this.parameters.songid !== undefined) {
				this.state.songId = this.parameters.songid;
			}
			else {
				window.location.href = "/profile";
			}
		}
		else {
			window.location.href = "/profile";
		}


		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.changeButton = this.changeButton.bind(this);
		this.handleClickOpen = this.handleClickOpen.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
		this.handleDelete = this.handleDelete.bind(this);
		this.fetchSongs = this.fetchSongs.bind(this);
	}

	componentDidMount() {
		this.fetchSongs();
	}

	fetchSongs() {
		const config = {
			headers: {
				'Authorization': ['Bearer ' + localStorage.getItem("access_token")]
			}
		};

		axios.get(url + "/api/compositions/editinfo?song_id=" + this.state.songId, config)
			.then(res => this.setState({
				title: res.data[0].title,
				genre: res.data[0].genre,
				currentTitle: res.data[0].title,
				currentGenre: res.data[0].genre,
				song: res.data
			}));
	}

	handleChange(e) {
		this.setState({ [e.target.name]: e.target.value }, function () { this.changeButton() });
	}

	changeButton() {
		if (this.state.title !== "" &&
			this.state.genre !== "" &&
			(this.state.title !== this.state.currentTitle ||
				this.state.genre !== this.state.currentGenre)) {
			this.setState({ disableButton: false });
		}
		else {
			this.setState({ disableButton: true });
		}
	}

	handleSubmit(e) {
		e.preventDefault();

		const claims = {
			title: this.state.title,
			genre: this.state.genre,
			song_id: this.state.songId
		};

		const config = {
			headers: {
				'Authorization': ['Bearer ' + localStorage.getItem("access_token")]
			}
		};

		axios.post(url + "/api/compositions/editsave", claims, config)
			.then(res => {
				window.location.href = "/songupdated";
			})
			.catch(err => {
				document.getElementById("errorMessage").innerHTML = err.response.data.msg;
			});

	}

	handleClickOpen() {
		this.setState({ openDialog: true });
	}

	handleCancel() {
		this.setState({ openDialog: false });
	}

	handleDelete() {
		const claims = {
			song_id: this.state.songId
		};

		const config = {
			headers: {
				'Authorization': ['Bearer ' + localStorage.getItem("access_token")]
			}
		};

		axios.post(url + "/api/compositions/delete", claims, config)
			.then(res => {
				window.location.href = "/songdeleted";
			})
			.catch(err => {
				document.getElementById("errorMessage").innerHTML = err.response.data.msg;
			});
	}

	render() {
		const { classes } = this.props;

		if (localStorage.getItem("access_token") === null) {
			return (
				<LogIn originPath={window.location.pathname} />
			)
		}

		return (
			<div>
				<Typography variant="h5" className={classes.title}>
					{this.state.title}
				</Typography>
				<Grid container spacing={0} justify="center" direction="row">
					<Grid item>
						<Grid
							container
							direction="column"
							justify="center"
							spacing={2}
							className={classes.form}
						>
							<Paper elevation={0} className={classes.background}>
								<Grid item align="center">
									<Typography component="h1" variant="h5">
										Edit song information
                                    </Typography>
									<br />
									<br />
								</Grid>
								<Grid item>
									<form onSubmit={this.handleSubmit}>
										<Grid container direction="column" spacing={2}>
											<Grid item>
												<TextField
													type="text"
													fullWidth
													name="title"
													variant="filled"
													autoFocus
													label="Song title"
													onChange={this.handleChange}
													InputProps={{ className: classes.inputBox, disableUnderline: true }}
													InputLabelProps={{ className: classes.inputBoxLabel }}
													value={this.state.title}
												/>
											</Grid>
											<Grid item>
												<br />
												<InputLabel className={classes.label}>
													Choose a genre:
                                                </InputLabel>
												<Select
													name="genre"
													variant="outlined"
													onChange={this.handleChange}
													className={classes.select}
													value={this.state.genre}
												>
													<MenuItem value="">&nbsp;</MenuItem>
													<MenuItem value="Genre 1">Genre 1</MenuItem>
													<MenuItem value="Genre 2">Genre 2</MenuItem>
													<MenuItem value="Genre 3">Genre 3</MenuItem>
													<MenuItem value="Genre 4">Genre 4</MenuItem>
													<MenuItem value="Genre 5">Genre 5</MenuItem>
													<MenuItem value="Genre 6">Genre 6</MenuItem>
													<MenuItem value="Genre 7">Genre 7</MenuItem>
												</Select>
											</Grid>
											<Grid item>
												<div id="errorMessage" className={classes.errorMessage}></div>
											</Grid>
											<Grid item>
												<Grid container>
													<Grid xs item>
														<Button disabled={this.state.disableButton} type="submit" className={classes.buttonBlock}>
															Save changes
														</Button>
													</Grid>
													<Grid item xs align="right">
														<Button className={classes.removeButton} variant="outlined" onClick={this.handleClickOpen}>
															Delete song
                                                		</Button>
														<Dialog
															open={this.state.openDialog}
															onClose={this.handleClose}
															aria-labelledby="alert-dialog-title"
															aria-describedby="alert-dialog-description"
															PaperProps={{
																style: {
																	backgroundColor: "#4f4f4f",
																},
															}}
														>
															<DialogTitle id="alert-dialog-title" style={{ color: "#EB5757" }}>{"Delete song?"}</DialogTitle>
															<DialogContent>
																<DialogContentText id="alert-dialog-description" color="textPrimary">
																	Do you want to permanently delete the song from the site?
          														</DialogContentText>
															</DialogContent>
															<DialogActions>
																<Button onClick={this.handleCancel} color="textPrimary">
																	Cancel
          														</Button>
																<Button onClick={this.handleDelete} style={{ color: "#EB5757" }} autoFocus>
																	Yes, delete
          														</Button>
															</DialogActions>
														</Dialog>
													</Grid>
												</Grid>
											</Grid>
										</Grid>
									</form>
								</Grid>
							</Paper>
						</Grid>
					</Grid>
				</Grid>
				<Songs songs={this.state.song} fetchSongs={this.fetchSongs} />
			</div >
		);
	}
}

export default withStyles(styles)(EditSong);