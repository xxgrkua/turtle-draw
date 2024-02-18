import { List, ListItem, ListItemText } from "@mui/material";
import React from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectAllWorkspaces } from "../../features/workbench";
import "./style.css";

function SideBar(): React.ReactElement {
  const workspaces = useAppSelector(selectAllWorkspaces);
  const dispatch = useAppDispatch();

  return (
    <List>
      {workspaces.map((workspace) => (
        <ListItem key={workspace.id}>
          <ListItemText primary={workspace.name} />
        </ListItem>
      ))}
    </List>
  );
}

export default SideBar;
