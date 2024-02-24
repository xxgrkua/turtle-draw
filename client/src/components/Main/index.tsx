import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import {
  Alert,
  AlertColor,
  Grid,
  Paper,
  Snackbar,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { nanoid } from "@reduxjs/toolkit";
import React, { useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectUserInfo } from "../../features/user";
import { initWorkbench } from "../../features/workbench";
import EditorTabs from "../EditorTabs";
import SideBar from "../SideBar";
import TopBar from "../TopBar";
import "./style.css";

const Main: React.FC = function () {
  const dispatch = useAppDispatch();
  const userInfo = useAppSelector(selectUserInfo);

  const [message, setMessage] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [severity, setSeverity] = useState<AlertColor>("error");
  const [key, setKey] = useState<string>("");

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleError = (message: string, severity?: AlertColor) => {
    setKey(nanoid());
    setMessage(message);
    setSeverity(severity ?? "error");
    setOpen(true);
  };

  useEffect(() => {
    dispatch(initWorkbench())
      .unwrap()
      .catch((error) => {
        handleError("Failed to initialize workbench", "error");
        console.log(error);
      });
  }, [dispatch, userInfo]);

  const theme = createTheme({
    palette: {
      background: {
        paper: "#F3F3F3",
      },
    },
  });

  return (
    <Grid container>
      <Grid item xs={12}>
        <TopBar />
      </Grid>
      <Grid item xs={2}>
        <ThemeProvider theme={theme}>
          <Paper elevation={0} square className="side-bar">
            <SideBar handleError={handleError} />
          </Paper>
        </ThemeProvider>
      </Grid>
      <Grid item xs={10}>
        <Paper elevation={0} square className="editor-tabs">
          <EditorTabs handleError={handleError} />
        </Paper>
      </Grid>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        key={key}
      >
        <Alert
          onClose={handleClose}
          sx={{ width: "100%" }}
          severity={severity}
          iconMapping={{
            error: <CloseIcon />,
            success: <CheckIcon />,
          }}
        >
          {message}
        </Alert>
      </Snackbar>
    </Grid>
  );
};

export default Main;
