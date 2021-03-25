import React, { Component } from "react";
import { Paper, withStyles, Grid, TextField, Button, Typography, Link } from "@material-ui/core";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { url } from "./URL";

const styles = theme => ({
	loginForm: {
		justifyContent: "center",
		marginTop: 75,
		marginBottom: 75,
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
	loginBackground: {
		justifyContent: "center",
		minWidth: "50vh",
		paddingTop: "50px",
		paddingBottom: "90px",
		paddingLeft: "70px",
		paddingRight: "70px",
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
	makeAccountLink: {
		color: "#219653",
		hover: {
			color: "#219653"
		},
	},
	forgotPasswordLink: {
		color: "#BDBDBD",
		hover: {
			color: "#BDBDBD"
		},
	},
	errorMessage: {
		color: "#EB5757",
	},
});

class LogIn extends Component {
	constructor(props) {
		super(props);

		this.state = {
			username: "",
			password: "",
			disableButton: true
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.changeButton = this.changeButton.bind(this);
	}

	handleChange(e) {
		this.setState({ [e.target.name]: e.target.value }, function () { this.changeButton() });
	}

	changeButton() {
		if (this.state.username !== "" && this.state.password !== "") {
			this.setState({ disableButton: false });
		}
		else {
			this.setState({ disableButton: true });
		}
	}

	handleSubmit(e) {
		e.preventDefault();

		const claims = {
			username: this.state.username,
			password: this.state.password
		};

		axios.post(url + "/api/users/login", claims)
			.then(res => {
				localStorage.setItem("access_token", res.data.sJWT);
				localStorage.setItem("username", res.data.username);

				if (this.props.originPath) {
					window.location.href = this.props.originPath;
				}
				else {
					window.location.href = "/";
				}
			})
			.catch(err => {
				document.getElementById("errorMessage").innerHTML = err.response.data.msg;
			});
	}

	render() {
		const { classes } = this.props;

		if (localStorage.getItem("access_token") !== null) {
			return (
				<Redirect to="/" />
			)
		}

		return (
			<div>
				<Grid container spacing={0} justify="center" direction="row">
					<Grid item>
						<Grid
							container
							direction="column"
							justify="center"
							spacing={2}
							className={classes.loginForm}
						>
							<Paper elevation={0} className={classes.loginBackground}>
								<Grid item align="center">
									<Typography component="h1" variant="h5">
										Log in
                                    </Typography>
									<br />
								</Grid>
								<Grid item>
									<form onSubmit={this.handleSubmit}>
										<Grid container direction="column" spacing={2}>
											<Grid item>
												<TextField
													type="text"
													fullWidth
													name="username"
													variant="filled"
													autoFocus
													label="Username / Email"
													onChange={this.handleChange}
													InputProps={{ className: classes.inputBox, disableUnderline: true }}
													InputLabelProps={{ className: classes.inputBoxLabel }}
												/>
											</Grid>
											<Grid item>
												<TextField
													type="password"
													fullWidth
													name="password"
													variant="filled"
													label="Password"
													onChange={this.handleChange}
													InputProps={{ className: classes.inputBox, disableUnderline: true }}
													InputLabelProps={{ className: classes.inputBoxLabel }}
												/>
											</Grid>
											<Grid item>
												<div id="errorMessage" className={classes.errorMessage}></div>
											</Grid>
											<Grid item>
												<Grid container direction="row" justify="space-between" alignItems="center">
													<Grid item>
														<Button disabled={this.state.disableButton} type="submit" className={classes.buttonBlock}>
															Log in
														</Button>
													</Grid>
													<Grid item>
														<Link href="/register" className={classes.makeAccountLink}>
															Make an account
														</Link>
													</Grid>
												</Grid>
											</Grid>
										</Grid>
									</form>
								</Grid>
								<Grid item align="center">
									<br />
									<Link href="/forgotpassword" className={classes.forgotPasswordLink}>
										Forgot password?
                                    </Link>
								</Grid>
							</Paper>
						</Grid>
					</Grid>
				</Grid>
			</div>
		);
	}
}

export default withStyles(styles)(LogIn);