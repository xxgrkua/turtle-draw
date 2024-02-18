import React, { useEffect } from "react";

import { Grid, Paper } from "@mui/material";
import { useSelector } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  createFile,
  createWorkspace,
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

  useEffect(() => {
    if (initState === "idle") {
      dispatch(initWorkbench()).catch((error) => {
        console.log(error);
      });
    }
  }, [initState, dispatch]);

  useEffect(() => {
    if (workspaces.length === 0) {
      dispatch(createWorkspace({ name: "Workspace 1" })).catch((error) => {
        console.log(error);
      });
    }
  }, [workspaces, dispatch]);

  useEffect(() => {
    if (activeWorkspace && activeWorkspace.fileIds.length === 0) {
      dispatch(
        createFile({
          workspace_id: activeWorkspace.id,
          name: "Untitled.scm",
        }),
      ).catch((error) => {
        console.log(error);
      });
    }
  }, [activeWorkspace, dispatch]);

  return (
    <Grid container>
      <Grid item xs={12}>
        <TopBar />
      </Grid>
      <Grid item xs={2}>
        <Paper elevation={1} className="side-bar">
          <SideBar />
        </Paper>
      </Grid>
      <Grid item xs={10}>
        <Paper elevation={0} className="editor-tabs">
          <EditorTabs />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Main;
