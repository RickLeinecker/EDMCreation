import React from "react";
import { withRouter } from "react-router-dom"; // To get current route
import {
	AppBar,
	Toolbar,
	Typography,
	InputBase,
	fade,
	makeStyles,
	Link,
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
		marginLeft: 0,
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
		// Vertical padding + font size from searchIcon
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
		flexWrap: "wrap",
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
	const open = Boolean(anchorEl);

	const handleClick = (e) => {
		setAnchorEl(e.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
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
							component={Link}
							href="/browsegenres"
							className={classes.menuItem}
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
					</Toolbar>
				</AppBar>
			</div>
		</div>
	);
}

export default withRouter(NavBar);