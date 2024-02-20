import React, { useEffect } from "react";

import { Grid, Paper, ThemeProvider, createTheme } from "@mui/material";
import { useSelector } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectUserInfo } from "../../features/user";
import {
  initWorkbench,
  selectActiveWorkspace,
  selectAllWorkspaces,
  selectWorkbenchState,
} from "../../features/workbench";
import EditorTabs from "../EditorTabs";
import SideBar from "../SideBar";
import TopBar from "../TopBar";
import "./style.css";

const Main: React.FC = function () {
  const initState = useAppSelector(selectWorkbenchState);
  const dispatch = useAppDispatch();
  const workspaces = useAppSelector(selectAllWorkspaces);
  const activeWorkspace = useSelector(selectActiveWorkspace);
  const userInfo = useAppSelector(selectUserInfo);

  useEffect(() => {
    dispatch(initWorkbench()).catch((error) => {
      console.log(error);
    });
  }, [dispatch]);

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
            <SideBar />
          </Paper>
          <Paper elevation={1}>a</Paper>
          <Paper elevation={2}>a</Paper>
          <Paper elevation={24}>a</Paper>
        </ThemeProvider>
      </Grid>
      <Grid item xs={10}>
        <Paper elevation={0} square className="editor-tabs">
          <EditorTabs />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Main;
