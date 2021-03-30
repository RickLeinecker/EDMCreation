import { Component } from "react";
import { withRouter } from "react-router-dom";

class LogOut extends Component {
    render() {
        localStorage.removeItem("access_token");
        localStorage.removeItem("username");
        localStorage.removeItem("user_id");
        window.location.href = "/login";

        return null;
    }
}

export default withRouter(LogOut);