import React, { Component } from "react";
import {
	Grid,
	Typography,
	withStyles,
	Paper,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	Link,
	Chip,
	Tooltip,
} from "@material-ui/core";
import {
	Image,
	ExpandMore,
	Favorite,
	FavoriteBorder,
	PlayArrow,
	ModeComment,
	Edit,
	HighlightOff
} from '@material-ui/icons';
import "../player.css";
// import "./html-midi-player/core";
// import "./html-midi-player/Tone";
import "./html-midi-player/midi-player";
import Comments from "./Comments";
import PostComment from "./PostComment";
import axios from "axios";
import { url } from "./URL";

const styles = theme => ({
	root: {
		flexGrow: 1,
		margin: "auto",
		marginTop: 30,
		maxWidth: 800,
	},
	paper: {
		paddingTop: 15,
		paddingBottom: 0,
		paddingLeft: 40,
		paddingRight: 40,
		margin: "auto",
		marginBottom: 20,
		backgroundColor: "#333333",
		borderRadius: theme.shape.borderRadius,
	},
	image: {
		width: 128,
		height: 128,
		margin: 20,
	},
	largeIcon: {
		fontSize: "4.5cm",
	},
	smallIcon: {
		fontSize: "0.4cm",
		marginRight: theme.spacing(0.5),
	},
	numPlaysIcon: {
		fontSize: "0.55cm",
		marginRight: 1,
		marginLeft: -5
	},
	img: {
		margin: 'auto',
		display: 'block',
		maxWidth: '100%',
		maxHeight: '100%',
	},
	composer: {
		color: "#BDBDBD",
	},
	date: {
		fontStyle: "italic",
		color: "#828282",
		marginTop: 3
	},
	genre: {
		borderRadius: theme.shape.borderRadius
	},
	commentsSection: {
		backgroundColor: "#333333",
		"&.MuiAccordion-root:before": {
			height: "0px",
		},
		marginBottom: 5,
	},
	innerCommentsSection: {
		marginBottom: 45,
	},
	songSection: {
		marginBottom: 5,
	},
	statsSection: {
		display: "flex",
	},
	statItem: {
		display: "flex",
		alignItems: "center",
		flexWrap: "wrap",
		marginLeft: theme.spacing(2),
	},
	numLikes: {
		display: "flex",
		alignItems: "center",
		flexWrap: "wrap",
	},
	editIcon: {
		"&:hover": {
			color: "#219653"
		}
	},
	deleteIcon: {
		"&:hover": {
			color: "#EB5757"
		}
	}
});

class Songs extends Component {
	constructor(props) {
		super(props);

		this.state = {
			editable: false,
			deletable: false,
			songs: []
		}

		this.fetchLiked = this.fetchLiked.bind(this);
		this.setSongsState = this.setSongsState.bind(this);
		this.toggleLike = this.toggleLike.bind(this);
	}

	componentDidMount() {
		if (this.props.editable !== undefined) {
			this.setState({ editable: this.props.editable });
		}

		if (this.props.deletable !== undefined) {
			this.setState({ deletable: this.props.deletable });
		}
	}

	async componentDidUpdate(prevProps) {
		if (this.props.songs !== prevProps.songs) {
			this.setSongsState();
		}
	}

	async setSongsState() {
		var songs = this.props.songs;

		if (localStorage.getItem("access_token")) {
			for (var x in songs) {
				songs[x].liked = await this.fetchLiked(songs[x].composition_id);
			}
		}

		this.setState({ songs: songs })
	}

	async fetchLiked(songId) {
		const config = {
			headers: {
				'Authorization': ['Bearer ' + localStorage.getItem("access_token")]
			}
		};

		const res = await axios.get(url + "/api/users/isliked?song_id=" + songId, config);

		return res.data.liked;
	}

	toggleLike(songId) {
		const config = {
			headers: {
				'Authorization': ['Bearer ' + localStorage.getItem("access_token")]
			}
		};

		const claims = {
			song_id: songId,
		};

		axios.post(url + "/api/users/liketoggle", claims, config)
			.then(res => this.props.fetchSongs());
	}

	render() {
		const { classes } = this.props;

		if (Object.keys(this.state.songs).length === 0) {
			return (
				<div className={classes.root}>
					<Typography variant="body2">
						No results
					</Typography>
				</div>
			);
		}

		return (
			<div className={classes.root}>
				{
					this.state.songs.map((song, i) => (
						<Paper className={classes.paper}>
							<Grid item xs container direction="column" className={classes.songSection}>
								<Grid container>
									<Grid item xs>
										<Typography variant="subtitle1">
											{song.title}
										</Typography>
									</Grid>
									{this.state.editable === true &&
										<Grid item xs align="right">
											<Link href={"/editsong?songid=" + song.composition_id} color="inherit">
												<Tooltip title="Edit" placement="right">
													<Edit className={classes.editIcon} />
												</Tooltip>
											</Link>
										</Grid>
									}
									{this.state.deletable === true &&
										<Grid item xs align="right">
											<Link href="#" color="inherit">
												<Tooltip title="Delete" placement="right">
													<HighlightOff className={classes.deleteIcon} />
												</Tooltip>
											</Link>
										</Grid>
									}
								</Grid>
								<Grid container spacing={2}>
									<Grid item xs container direction="column">
										<Grid item xs>
											<Typography variant="body2" className={classes.composer}>
												by <Link href={"/profile?username=" + song.username} color="inherit"> {song.username} </Link>
											</Typography>
										</Grid>
										<Grid item align="center">
											<Image className={classes.largeIcon} />
										</Grid>
										<Grid item xs>
											<Typography variant="body2" className={classes.date}>
												Uploaded on {(new Date(song.date)).toDateString().substr(3)}
											</Typography>
										</Grid>
									</Grid>
									<Grid item xs={12} sm container direction="column" spacing={2}>
										<Grid item xs>
											<section className="player" id={"section" + i}>
												<midi-visualizer src={song.path} />
												<midi-player src={song.path}
													visualizer={"#section" + i + " midi-visualizer"}
													sound-font="https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus"
													song-id={song.composition_id} />
											</section>
										</Grid>
										<Grid item container xs style={{ paddingRight: 29 }} >
											<Grid item xs>
												<Chip size="small" label={song.genre} className={classes.genre} onClick={() => window.location.replace("#")} />
											</Grid>
											<Grid item xs container justify="flex-end">
												<Typography variant="body2" className={classes.statsSection}>
													{song.liked ?
														<div onClick={() => this.toggleLike(song.composition_id)}
															color="inherit" className={classes.statItem}>
															<Tooltip title="Unlike" placement="top">
																{<Favorite className={classes.smallIcon} style={{ cursor: "pointer" }} />}
															</Tooltip>
														</div> :
														<div onMouseEnter={() => this.setState({ ["favorite" + i]: true })}
															onMouseLeave={() => this.setState({ ["favorite" + i]: false })}
															color="inherit" className={classes.statItem}
															onClick={() => this.toggleLike(song.composition_id)}>
															<Tooltip title="Like" placement="top">
																{this.state["favorite" + i] ?
																	(<Favorite className={classes.smallIcon} style={{ cursor: "pointer" }} />) :
																	(<FavoriteBorder className={classes.smallIcon} style={{ cursor: "pointer" }} />)}
															</Tooltip>
														</div>
													}
													<span className={classes.numLikes}>
														{song.likes}
													</span>
													<span className={classes.statItem}>
														<PlayArrow className={classes.numPlaysIcon} /> {song.listens}
													</span>
													<span className={classes.statItem}>
														<ModeComment className={classes.smallIcon} /> {song.num_comments}
													</span>
												</Typography>
											</Grid>
										</Grid>
									</Grid>
								</Grid>
								<Accordion elevation={0} className={classes.commentsSection}>
									<AccordionSummary expandIcon={<ExpandMore />}>
									</AccordionSummary>
									<AccordionDetails className={classes.innerCommentsSection}>
										<Grid container spacing={10}>
											<Grid item xs={6}>
												<Comments comments={song.comments} />
											</Grid>
											<Grid item xs={6}>
												<PostComment songId={song.composition_id} fetchSongs={this.props.fetchSongs} songNumber={i} />
											</Grid>
										</Grid>
									</AccordionDetails>
								</Accordion>
							</Grid>
						</Paper>
					))
				}
			</div >
		);
	}
}

export default withStyles(styles)(Songs);