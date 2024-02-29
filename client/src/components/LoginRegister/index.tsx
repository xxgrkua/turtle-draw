import CheckIcon from "@mui/icons-material/Check";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Alert,
  AlertColor,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Collapse,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import React, { FormEvent, useEffect } from "react";
import { Link as RouteLink, useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  login,
  register,
  resetState,
  selectUserError,
  selectUserState,
  setUserInfo,
} from "../../features/user";
import TopBar from "../TopBar";
import "./style.css";

interface LoginRegisterProps {
  type: "login" | "register";
}

const SeverityMapping: { [key: string]: AlertColor } = {
  idle: "info",
  loading: "info",
  succeeded: "success",
  failed: "error",
};

function checkForm(vars: unknown[]) {
  return vars.every((v) => Boolean(v));
}

const LoginRegister: React.FC<LoginRegisterProps> = ({ type }) => {
  const dispatch = useAppDispatch();

  const [username, setUsername] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [nickname, setNickname] = React.useState<string>("");

  const state = useAppSelector(selectUserState);
  const error = useAppSelector(selectUserError);

  const [startCheck, setStartCheck] = React.useState<boolean>(false);

  const [severity, setSeverity] = React.useState<AlertColor>("info");

  const [showPassword, setShowPassword] = React.useState<boolean>(false);

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(resetState());
  }, [dispatch, type]);

  useEffect(() => {
    if (severity === "success" || severity === "error") {
      setTimeout(() => {
        setSeverity(SeverityMapping[state]);
      }, 200);
    } else {
      setSeverity(SeverityMapping[state]);
    }
  }, [state, severity]);

  useEffect(() => {
    setNickname("");
    setPassword("");
    setUsername("");
    setStartCheck(false);
  }, [type]);

  const verify = (variable: string) => {
    if (startCheck) {
      return variable === "";
    } else {
      return false;
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLElement>) => {
    event.preventDefault();
    setStartCheck(true);
    if (!checkForm([username, password])) {
      return;
    }
    if (type === "register") {
      try {
        await dispatch(
          register({
            username: username || "",
            password: password || "",
            nickname: nickname || "",
            init: true,
          }),
        ).unwrap();
        setStartCheck(false);
        setTimeout(() => {
          setUsername("");
          setPassword("");
          setNickname("");
          navigate("/login");
        }, 2000);
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const data = await dispatch(
          login({ username: username || "", password: password || "" }),
        ).unwrap();
        setStartCheck(false);
        setTimeout(() => {
          setUsername("");
          setPassword("");
          dispatch(setUserInfo(data));
        }, 2000);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        <TopBar />
      </Grid>
      <Grid item xs={12}>
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
            {type === "register" ? (
              <Typography component="h1" variant="h5">
                Register
              </Typography>
            ) : (
              <Typography component="h1" variant="h5">
                Login
              </Typography>
            )}
            <Box
              component="form"
              onSubmit={(event) => {
                handleSubmit(event).catch((error) => {
                  console.log(error);
                });
              }}
              noValidate
              sx={{ mt: 1 }}
            >
              <Collapse
                in={Boolean(state === "succeeded" || state === "failed")}
              >
                <Alert severity={severity}>
                  {state === "succeeded"
                    ? type === "register"
                      ? "Registration successful! Redirecting to login page..."
                      : "Login successful! Redirecting to home page..."
                    : error}
                </Alert>
              </Collapse>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                inputProps={{
                  readOnly: state === "loading" || state === "succeeded",
                }}
                value={username}
                onChange={(event) => {
                  setStartCheck(false);
                  setUsername(event.currentTarget.value);
                }}
                error={verify(username)}
                helperText={verify(username) ? "username is required" : ""}
              />
              {type === "register" ? (
                <TextField
                  margin="normal"
                  fullWidth
                  name="nickname"
                  label="Nickname"
                  id="nickname"
                  autoComplete="nickname"
                  inputProps={{
                    readOnly: state === "loading" || state === "succeeded",
                  }}
                  value={nickname}
                  onChange={(event) => {
                    setNickname(event.currentTarget.value);
                  }}
                />
              ) : null}
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="password"
                inputProps={{
                  readOnly: state === "loading" || state === "succeeded",
                }}
                value={password}
                onChange={(event) => {
                  setStartCheck(false);
                  setPassword(event.currentTarget.value);
                }}
                error={verify(password)}
                helperText={verify(password) ? "password is required" : ""}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {type === "register" ? (
                <React.Fragment>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    disabled={state === "loading" || state === "succeeded"}
                  >
                    {state === "loading" ? (
                      <CircularProgress
                        color="inherit"
                        size={16}
                        sx={{ mr: 1 }}
                      />
                    ) : null}
                    {state === "succeeded" ? (
                      <CheckIcon color="inherit" />
                    ) : null}
                    Register
                  </Button>
                  <Grid container>
                    <Grid item xs></Grid>
                    <Grid item>
                      <Link variant="body2" component={RouteLink} to="/login">
                        {"Already have an account? Login"}
                      </Link>
                    </Grid>
                  </Grid>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    disabled={state === "loading" || state === "succeeded"}
                  >
                    {state === "loading" ? (
                      <CircularProgress
                        color="inherit"
                        size={16}
                        sx={{ mr: 1 }}
                      />
                    ) : null}
                    {state === "succeeded" ? (
                      <CheckIcon color="inherit" />
                    ) : null}
                    Log In
                  </Button>
                  <Grid container>
                    <Grid item xs></Grid>
                    <Grid item>
                      <Link
                        variant="body2"
                        component={RouteLink}
                        to="/register"
                      >
                        {"Don't have an account? Register"}
                      </Link>
                    </Grid>
                  </Grid>
                </React.Fragment>
              )}
            </Box>
          </Box>
        </Container>
      </Grid>
    </Grid>
  );
};

export default LoginRegister;
