import React, { Component } from "react";
import {
	Grid,
	Typography,
	withStyles,
	Paper,
	IconButton,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	Link
} from "@material-ui/core";
import { Image, ExpandMore, Favorite, Visibility, ModeComment } from '@material-ui/icons';
import "html-midi-player";
import sample from "../dummy-data/Sample.mid";
import "../player.css";
import Comments from "./Comments.js";
import PostComment from "./PostComment.js";

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
		fontSize: "10.6em",
	},
	smallIcon: {
		fontSize: "1.1em",
		marginRight: theme.spacing(0.5),
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
		marginTop: 15
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
	compositionSection: {
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
});

class Compositions extends Component {
	render() {
		const { classes } = this.props;

		if (Object.keys(this.props.compositions).length === 0) {
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
					this.props.compositions.map((composition, i) => (
						<Paper className={classes.paper}>
							<Grid item xs container direction="column" className={classes.compositionSection}>
								<Grid item>
									<Typography variant="subtitle1">
										{composition.title}
									</Typography>
								</Grid>
								<Grid container spacing={2}>
									<Grid item>
										<Grid item xs container direction="column">
											<Grid item xs>
												<Typography variant="body2" className={classes.composer}>
													by <Link href="/profile" color="inherit"> {composition.username} </Link>
												</Typography>
											</Grid>
											<Grid item align="center">
													<Image className={classes.largeIcon} />
											</Grid>
											<Grid item xs>
												<Typography variant="body2" className={classes.date}>
													Uploaded on {composition.date}
												</Typography>
											</Grid>
										</Grid>
									</Grid>
									<Grid item xs={12} sm container>
										<Grid item xs container direction="column" spacing={2}>
											<Grid item xs>
												<section className="player" id={"section" + i}>
													<midi-visualizer src={sample} />
													<midi-player src={sample}
														visualizer={"#section" + i + " midi-visualizer"}
														sound-font="https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus" />
												</section>
											</Grid>
											<Grid item container justify="flex-end">
												<Typography variant="body2" className={classes.statsSection}>
													<span className={classes.statItem}>
														<Favorite className={classes.smallIcon} /> {composition.likes}
													</span>
													<span className={classes.statItem}>
														<Visibility className={classes.smallIcon} /> {composition.listens}
													</span>
													<span className={classes.statItem}>
														<ModeComment className={classes.smallIcon} /> {composition.num_comments}
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
												<Comments comments={composition.comments} />
											</Grid>
											<Grid item xs={6}>
												<PostComment />
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

export default withStyles(styles)(Compositions);