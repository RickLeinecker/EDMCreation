import React from "react";
import { withRouter, Link as RouterLink } from "react-router-dom"; // To get current route
import {
	AppBar,
	Toolbar,
	Typography,
	InputBase,
	fade,
	makeStyles,
	Link,
	Menu,
	MenuItem
} from "@material-ui/core";
import { BarChart, StarBorder, Search } from "@material-ui/icons";
import ProfileIcon from "./ProfileIcon";

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
	},
	title: {
		flexGrow: 1,
		display: "none",
		[theme.breakpoints.up("sm")]: {
			display: "block",
		},
	},
	search: {
		position: "relative",
		borderRadius: theme.shape.borderRadius,
		backgroundColor: fade(theme.palette.common.white, 0.15),
		"&:hover": {
			backgroundColor: fade(theme.palette.common.white, 0.25),
		},
		marginRight: 20,
		width: "100%",
		[theme.breakpoints.up("sm")]: {
			marginLeft: theme.spacing(1),
			width: "auto",
		},
	},
	searchIcon: {
		padding: theme.spacing(0, 2),
		height: "100%",
		position: "absolute",
		pointerEvents: "none",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	},
	inputRoot: {
		color: "inherit",
	},
	inputInput: {
		padding: theme.spacing(1, 1, 1, 0),
		paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
		transition: theme.transitions.create("width"),
		width: "100%",
		[theme.breakpoints.up("sm")]: {
			width: "12ch",
			"&:focus": {
				width: "20ch",
			},
		},
	},
	menuItem: {
		display: "flex",
		alignItems: "center",
		color: "white",
		"&.Mui-selected": {
			backgroundColor: "#219653"
		},
		minHeight: 52,
	},
	menuItemIcon: {
		marginRight: theme.spacing(0.5),
	},
}));

function NavBar(props) {
	const classes = useStyles();
	const { location: { pathname } } = props;
	const [anchorEl, setAnchorEl] = React.useState(null);
	const [searchTerm, setSearchTerm] = React.useState(null);

	const handleClick = (e) => {
		setAnchorEl(e.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleKeyPress = (e) => {
		const enterKey = 13;

		if (e.keyCode === enterKey) {
			window.location.href = "/search?query=" + e.target.value;
		}
	};

	return (
		<div className={classes.root}>
			<div className={classes.root}>
				<AppBar color="primary" position="static" elevation={0}>
					<Toolbar>
						<Typography className={classes.title} variant="h6" noWrap>
							<Link href="/" color="inherit">
								Automated EDM Composition
							</Link>
						</Typography>
						<div className={classes.search}>
							<div className={classes.searchIcon}>
								<Search />
							</div>
							<InputBase
								placeholder="Search…"
								classes={{
									root: classes.inputRoot,
									input: classes.inputInput,
								}}
								inputProps={{ "aria-label": "search" }}
								onKeyDown={handleKeyPress}
							/>
						</div>
						<ProfileIcon />
					</Toolbar>
				</AppBar>
			</div>
			<div className={classes.root}>
				<AppBar color="secondary" position="static">
					<Toolbar>
						<MenuItem
							selected={pathname === "/popular" || pathname === "/"}
							component={Link}
							href="/popular"
							className={classes.menuItem}
						>
							<Typography color="inherit" variant="title" className={classes.menuItem}>
								<BarChart className={classes.menuItemIcon} /> Popular
							</Typography>
						</MenuItem>
						<MenuItem
							selected={pathname === "/topfavorites"}
							component={Link}
							href="/topfavorites"
							className={classes.menuItem}
						>
							<Typography color="inherit" variant="title" className={classes.menuItem}>
								<StarBorder className={classes.menuItemIcon} /> Top Favorites
							</Typography>
						</MenuItem>
						<MenuItem
							selected={pathname === "/browsegenres"}
							className={classes.menuItem}
							onClick={handleClick}
						>
							<Typography color="inherit" variant="title" className={classes.menuItem}> Browse Genres
							</Typography>
						</MenuItem>
						<MenuItem
							selected={pathname === "/random"}
							component={Link}
							href="/random"
							className={classes.menuItem}
						>
							<Typography color="inherit" variant="title" className={classes.menuItem}> Random
							</Typography>
						</MenuItem>
						<Menu
							id="menu"
							anchorEl={anchorEl}
							keepMounted
							open={Boolean(anchorEl)}
							onClose={handleClose}
							PaperProps={{
								style: {
									width: "18ch",
								},
							}}
							getContentAnchorEl={null}
							anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
							transformOrigin={{ vertical: "top", horizontal: "center" }}
						>
							<MenuItem component={RouterLink} to="#" onClick={handleClose}>
								Genre 1
                    		</MenuItem>
							<MenuItem component={RouterLink} to="#" onClick={handleClose}>
								Genre 2
                    		</MenuItem>
							<MenuItem component={RouterLink} to="#" onClick={handleClose}>
								Genre 3
                    		</MenuItem>
							<MenuItem component={RouterLink} to="#" onClick={handleClose}>
								Genre 4
                    		</MenuItem>
							<MenuItem component={RouterLink} to="#" onClick={handleClose}>
								Genre 5
                    		</MenuItem>
							<MenuItem component={RouterLink} to="#" onClick={handleClose}>
								Genre 6
                    		</MenuItem>
							<MenuItem component={RouterLink} to="#" onClick={handleClose}>
								Genre 7
                    		</MenuItem>
						</Menu>
					</Toolbar>
				</AppBar>
			</div>
		</div>
	);
}

export default withRouter(NavBar);