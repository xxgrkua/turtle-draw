import React, { useEffect } from "react";

import { Grid, Paper, ThemeProvider, createTheme } from "@mui/material";
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

  useEffect(() => {
    dispatch(initWorkbench()).catch((error) => {
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
            <SideBar />
          </Paper>
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
