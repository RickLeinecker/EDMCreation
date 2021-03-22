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
    MuiThemeProvider,
    createMuiTheme
} from "@material-ui/core";
import axios from "axios";
import { DropzoneArea } from "material-ui-dropzone";
import LogIn from "./LogIn";

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
    background: {
        justifyContent: "center",
        minWidth: 650,
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
});

const dropzoneTheme = createMuiTheme({
    overrides: {
        MuiChip: {
            label: {
                color: "#ffffff"
            },
            deleteIcon: {
                color: "#ffffff",
                "&:hover": {
                    color: "#ffffff"
                }
            }
        },
        MuiDropzoneArea: {
            root: {
                backgroundColor: "#333333",
                border: "1px dashed",
                borderColor: "#4f4f4f",
                marginBottom: 25
            },
            icon: {
                color: "#ffffff"
            }
        },
        MuiDropzonePreviewList: {
            image: {
                color: "#ffffff"
            },
        },
        MuiDropzoneSnackbar: {
            errorAlert: {
                backgroundColor: "#005ce6",
                color: "#ffffff"
            },
            successAlert: {
                backgroundColor: "#005ce6",
                color: "#ffffff"
            },
            message: {
                backgroundColor: "#005ce6",
                color: "#ffffff"
            },
            warningAlert: {
                backgroundColor: "#005ce6",
                color: "#ffffff"
            },
            infoAlert: {
                backgroundColor: "#005ce6",
                color: "#ffffff"
            },
        },
    }
});

class UploadSong extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title: "",
            genre: "",
            file: [],
            disableButton: true
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleFileUpload = this.handleFileUpload.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.changeButton = this.changeButton.bind(this);
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value }, function () { this.changeButton() });
    }

    handleFileUpload(file) {
        this.setState({ file: file }, function () { this.changeButton() });
    }

    changeButton() {
        if (this.state.title !== "" &&
            this.state.genre !== "" &&
            this.state.file.length !== 0) {
            this.setState({ disableButton: false });
        }
        else {
            this.setState({ disableButton: true });
        }
    }

    handleSubmit(e) {
        e.preventDefault();

        const claims = {
            email: this.state.email,
            username: this.state.username,
            password: this.state.password,
            confirmationPassword: this.state.confirmationPassword
        };

        window.location.href = "/songuploaded";
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
                    Upload song
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
                                        Upload a song
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
                                                <br />
                                                <InputLabel className={classes.label}>
                                                    Upload your song file:
                                                </InputLabel>
                                                <MuiThemeProvider theme={dropzoneTheme}>
                                                    <DropzoneArea
                                                        acceptedFiles={[".mid"]}
                                                        dropzoneText={"Drag and drop a MIDI file here or click"}
                                                        filesLimit={1}
                                                        onChange={this.handleFileUpload}
                                                        showPreviews={true}
                                                        showPreviewsInDropzone={false}
                                                        useChipsForPreview
                                                        previewGridProps={{ container: { spacing: 1, direction: "row" } }}
                                                        previewChipProps={{ classes: { root: classes.previewChip } }}
                                                        alertSnackbarProps={{ anchorOrigin: { horizontal: "center", vertical: "top" } }}
                                                        previewText="Selected file"
                                                    />
                                                </MuiThemeProvider>
                                            </Grid>
                                            <Grid item>
                                                <div id="errorMessage" className={classes.errorMessage}>*Error message goes here</div>
                                            </Grid>
                                            <Grid item>
                                                <Grid container justify="center">
                                                    <Grid item>
                                                        <Button disabled={this.state.disableButton} type="submit" className={classes.buttonBlock}>
                                                            Upload
														</Button>
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
            </div >
        );
    }
}

export default withStyles(styles)(UploadSong);