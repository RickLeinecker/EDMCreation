import React, { Component } from "react";
import { withRouter } from "react-router-dom";

class LogOut extends Component {
    render() {
        localStorage.removeItem("access_token");
        window.location.href = "/login";

        return null;
    }
}

export default withRouter(LogOut);