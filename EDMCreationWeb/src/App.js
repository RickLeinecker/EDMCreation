import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { createMuiTheme, ThemeProvider, CssBaseline } from "@material-ui/core";
import NavBar from "./components/NavBar";
import Popular from "./components/Popular";
import TopFavorites from "./components/TopFavorites";
import Genres from "./components/Genres";
import Random from "./components/Random";
import LogIn from "./components/LogIn";
import LogOut from "./components/LogOut";
import EditProfile from "./components/EditProfile";
import Register from "./components/Register";
import RegisterCompleted from "./components/RegisterCompleted";
import Search from "./components/Search";
import Profile from "./components/Profile";
import EditSong from "./components/EditSong";
import UploadSong from "./components/UploadSong";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import ResetRequested from "./components/ResetRequested";
import PasswordReset from "./components/PasswordReset";
import SongUpdated from "./components/SongUpdated";
import SongUploaded from "./components/SongUploaded";
import AccountUpdated from "./components/AccountUpdated";
import AccountEmailUpdated from "./components/AccountEmailUpdated";
import SongDeleted from "./components/SongDeleted";
import SendVerification from "./components/SendVerification";
import Verify from "./components/Verify";
import UpdateEmailVerified from "./components/UpdateEmailVerified";
import GettingStarted from "./components/GettingStarted";

const theme = createMuiTheme({
	palette: {
		type: "dark",
		primary: {
			main: "#333333"
		},
		secondary: {
			main: "#4f4f4f"
		},
		text: {
			primary: "#ffffff",
			secondary: "#000000"
		},
		background: {
			default: "#1e1e1e"
		}
	},
	fontFamily: "roboto",
});

class App extends Component {
	constructor(props) {
		super(props);

		this.setState({ access_token: localStorage.getItem("access_token") });
	}

	render() {
		return (
			<Router>
				<ThemeProvider theme={theme}>
					<CssBaseline /> {/* For background color */}
					<NavBar />
					<Route path="/" exact component={Popular} />
					<Route path="/popular" render={(props) => <Popular {...props} key={Date.now()} />} />
					<Route path="/topfavorites" render={(props) => <TopFavorites {...props} key={Date.now()} />} />
					<Route path="/genres" render={(props) => <Genres {...props} key={Date.now()} />} />
					<Route path="/random" render={(props) => <Random {...props} key={Date.now()} />} />
					<Route path="/login" component={LogIn} />
					<Route path="/logout" component={LogOut} />
					<Route path="/editprofile" component={EditProfile} />
					<Route path="/register" component={Register} />
					<Route path="/registercompleted" component={RegisterCompleted} />
					<Route path="/sendverification" component={SendVerification} />
					<Route path="/verify" component={Verify} />
					<Route path="/updateemailverified" component={UpdateEmailVerified} />
					<Route path="/search" render={(props) => <Search {...props} key={Date.now()} />} />
					<Route path="/profile" render={(props) => <Profile {...props} key={Date.now()} />} />
					<Route path="/editsong" component={EditSong} />
					<Route path="/uploadsong" component={UploadSong} />
					<Route path="/forgotpassword" component={ForgotPassword} />
					<Route path="/resetpassword" component={ResetPassword} />
					<Route path="/resetrequested" component={ResetRequested} />
					<Route path="/passwordreset" component={PasswordReset} />
					<Route path="/songupdated" component={SongUpdated} />
					<Route path="/songuploaded" component={SongUploaded} />
					<Route path="/accountupdated" component={AccountUpdated} />
					<Route path="/accountemailupdated" component={AccountEmailUpdated} />
					<Route path="/songdeleted" component={SongDeleted} />
					<Route path="/gettingstarted" component={GettingStarted} />
				</ThemeProvider>
			</Router>
		);
	}
}

export default App;