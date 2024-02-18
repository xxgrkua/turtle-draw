import {
  Alert,
  Avatar,
  Box,
  Button,
  Collapse,
  Container,
  Grid,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React from "react";
import { Link as RouteLink } from "react-router-dom";

import "./style.css";

interface LoginRegisterProps {
  type: "login" | "register";
}

const LoginRegisterAlt: React.FC<LoginRegisterProps> = ({ type }) => {};

class LoginRegister extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      msg: "",
      result: null,
      ok: false,
      alert: null,
      login_name: "",
      password: "",
      first_name: "",
      last_name: "",
      location: "",
      occupation: "",
      description: "",
      errorLoginName: false,
      errorMsgLoginName: "",
      errorPassword: false,
      errorMsgPassword: "",
      errorFirstName: false,
      errorMsgFirstName: "",
      errorLastName: false,
      errorMsgLastName: "",
    };
  }

  clearInput() {
    this.setState({
      login_name: "",
      password: "",
      first_name: "",
      last_name: "",
      location: "",
      occupation: "",
      description: "",
    });
  }

  validateLoginName() {
    if (!this.state.login_name) {
      this.setState({
        errorLoginName: true,
        errorMsgLoginName: "Login name is empty",
      });
      return false;
    } else {
      this.setState({
        errorLoginName: false,
        errorMsgLoginName: "",
      });
      return true;
    }
  }

  validatePassword() {
    if (!this.state.password) {
      this.setState({
        errorPassword: true,
        errorMsgPassword: "Password is empty",
      });
      return false;
    } else {
      this.setState({
        errorPassword: false,
        errorMsgPassword: "",
      });
      return true;
    }
  }

  validateFirstName() {
    if (!this.state.first_name) {
      this.setState({
        errorFirstName: true,
        errorMsgFirstName: "First name is empty",
      });
      return false;
    } else {
      this.setState({
        errorFirstName: false,
        errorMsgFirstName: "",
      });
      return true;
    }
  }

  validateLastName() {
    if (!this.state.last_name) {
      this.setState({
        errorLastName: true,
        errorMsgLastName: "Last name is empty",
      });
      return false;
    } else {
      this.setState({
        errorLastName: false,
        errorMsgLastName: "",
      });
      return true;
    }
  }

  validateRegister() {
    return (
      this.validateLoginName() &&
      this.validatePassword() &&
      this.validateFirstName() &&
      this.validateLastName()
    );
  }

  validateLogin() {
    return this.validateLoginName() && this.validatePassword();
  }

  setLoginName(event, callback) {
    this.setState({ login_name: event.currentTarget.value }, callback);
  }

  setPassword(event, callback) {
    this.setState({ password: event.currentTarget.value }, callback);
  }

  setFirstName(event, callback) {
    this.setState({ first_name: event.currentTarget.value }, callback);
  }

  setLastName(event, callback) {
    this.setState({ last_name: event.currentTarget.value }, callback);
  }

  setLocation(event) {
    this.setState({ location: event.currentTarget.value });
  }

  setOccupation(event) {
    this.setState({ occupation: event.currentTarget.value });
  }

  setDescription(event) {
    this.setState({ description: event.currentTarget.value });
  }

  handleRegister(event) {
    event.preventDefault();
    if (!this.validateRegister()) {
      return;
    }
    axios
      .post("/user", {
        login_name: this.state.login_name,
        password: this.state.password,
        first_name: this.state.first_name,
        last_name: this.state.last_name,
        location: this.state.location,
        occupation: this.state.occupation,
        description: this.state.description,
      })
      .then(() => {
        this.setState({
          msg: "Success! Redirecting to login...",
          result: "success",
          ok: true,
          alert: true,
        });
        setTimeout(() => {
          this.props.history.push("/login");
          this.setState({
            ok: false,
            alert: false,
            msg: "",
          });
          this.clearInput();
        }, 2000);
      })
      .catch((error) => {
        if (error.response) {
          const { data } = error.response;
          this.setState({
            msg: data.msg,
            result: data.res,
          });
        } else if (error.request) {
          console.log(error.request);
          this.setState({
            result: "error",
          });
        } else {
          console.log("Error", error.message);
        }
      });
  }

  handleLogin(event) {
    event.preventDefault();
    if (!this.validateLogin()) {
      return;
    }
    axios
      .post("/admin/login", {
        login_name: this.state.login_name,
        password: this.state.password,
      })
      .then(({ data }) => {
        this.setState({
          msg: "Success! Redirecting...",
          result: "success",
          ok: true,
          alert: true,
        });
        setTimeout(() => {
          this.props.callback(data._id, data.username);
        }, 2000);
      })
      .catch((error) => {
        if (error.response) {
          const { data } = error.response;
          this.setState({
            msg: data.msg,
            result: data.res,
          });
        } else if (error.request) {
          console.log(error.request);
          this.setState({
            result: "error",
          });
        } else {
          console.log("Error", error.message);
        }
      });
  }

  render() {
    if (this.props.register) {
      return (
        <Container component="main" maxWidth="xs">
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar></Avatar>
            <Typography component="h1" variant="h5">
              Register
            </Typography>
            <Box
              component="form"
              onSubmit={(event) => this.handleRegister(event)}
              noValidate
              sx={{ mt: 1 }}
            >
              <Collapse in={this.state.alert ?? Boolean(this.state.result)}>
                <Alert severity={this.state.result || "info"}>
                  {this.state.msg}
                </Alert>
              </Collapse>
              <TextField
                margin="normal"
                required
                fullWidth
                id="login_name"
                label="Username"
                name="login_name"
                autoComplete="username"
                autoFocus
                inputProps={{
                  readOnly: this.state.ok,
                }}
                value={this.state.login_name}
                onChange={(event) => {
                  this.setLoginName(event, this.validateLoginName);
                }}
                error={this.state.errorLoginName}
                helperText={this.state.errorMsgLoginName}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                inputProps={{
                  readOnly: this.state.ok,
                }}
                value={this.state.password}
                onChange={(event) => {
                  this.setPassword(event, this.validatePassword);
                }}
                error={this.state.errorPassword}
                helperText={this.state.errorMsgPassword}
              />
              {/* why useFlexGap: https://github.com/mui/material-ui/issues/33155 */}
              <Stack direction="row" spacing={1} useFlexGap>
                <TextField
                  margin="normal"
                  required
                  name="first_name"
                  label="First name"
                  id="first_name"
                  autoComplete="first_name"
                  inputProps={{
                    readOnly: this.state.ok,
                  }}
                  value={this.state.first_name}
                  onChange={(event) => {
                    this.setFirstName(event, this.validateFirstName);
                  }}
                  error={this.state.errorFirstName}
                  helperText={this.state.errorMsgFirstName}
                />
                <TextField
                  margin="normal"
                  required
                  name="last_name"
                  label="Last name"
                  id="last_name"
                  autoComplete="last_name"
                  inputProps={{
                    readOnly: this.state.ok,
                  }}
                  value={this.state.last_name}
                  onChange={(event) => {
                    this.setLastName(event, this.validateLastName);
                  }}
                  error={this.state.errorLastName}
                  helperText={this.state.errorMsgLastName}
                />
              </Stack>
              <TextField
                margin="normal"
                fullWidth
                name="location"
                label="Location"
                id="location"
                autoComplete="location"
                inputProps={{
                  readOnly: this.state.ok,
                }}
                value={this.state.location}
                onChange={(event) => this.setLocation(event)}
              />
              <TextField
                margin="normal"
                fullWidth
                name="occupation"
                label="Occupation"
                id="occupation"
                autoComplete="occupation"
                inputProps={{
                  readOnly: this.state.ok,
                }}
                value={this.state.occupation}
                onChange={(event) => this.setOccupation(event)}
              />
              <TextField
                margin="normal"
                fullWidth
                multiline
                rows={3}
                name="description"
                label="Description"
                id="description"
                autoComplete="description"
                inputProps={{
                  readOnly: this.state.ok,
                }}
                value={this.state.description}
                onChange={(event) => this.setDescription(event)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Register Me
              </Button>
              <Grid container>
                <Grid item xs>
                  {/* <Link href="#" variant="body2">
                    Forgot password?
                  </Link> */}
                </Grid>
                <Grid item>
                  <Link variant="body2" component={RouteLink} to="/login">
                    {"Already have an account? Login"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      );
    } else {
      return (
        <Container component="main" maxWidth="xs">
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar></Avatar>
            <Typography component="h1" variant="h5">
              Log in
            </Typography>
            <Box
              component="form"
              onSubmit={(event) => this.handleLogin(event)}
              noValidate
              sx={{ mt: 1 }}
            >
              <Collapse in={this.state.alert ?? Boolean(this.state.result)}>
                <Alert severity={this.state.result || "info"}>
                  {this.state.msg}
                </Alert>
              </Collapse>
              <TextField
                margin="normal"
                required
                fullWidth
                id="login_name"
                label="Username"
                name="login_name"
                autoComplete="username"
                autoFocus
                inputProps={{
                  readOnly: this.state.ok,
                }}
                value={this.state.login_name}
                onChange={(event) => {
                  this.setLoginName(event, this.validateLoginName);
                }}
                error={this.state.errorLoginName}
                helperText={this.state.errorMsgLoginName}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                inputProps={{
                  readOnly: this.state.ok,
                }}
                value={this.state.password}
                onChange={(event) => {
                  this.setPassword(event, this.validatePassword);
                }}
                error={this.state.errorPassword}
                helperText={this.state.errorMsgPassword}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Log In
              </Button>
              <Grid container>
                <Grid item xs>
                  {/* <Link href="#" variant="body2">
                    Forgot password?
                  </Link> */}
                </Grid>
                <Grid item>
                  <Link variant="body2" component={RouteLink} to="/register">
                    {"Don't have an account? Register"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      );
    }
  }
}

export default LoginRegister;
