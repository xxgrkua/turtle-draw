import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { TreeView } from "@mui/x-tree-view/TreeView";
import React from "react";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectAllWorkspaces, updateWorkspace } from "../../features/workbench";
import "./style.css";

function SideBar(): React.ReactElement {
  const workspaces = useAppSelector(selectAllWorkspaces);
  const dispatch = useAppDispatch();

  const handleClick = async (workspace_id: string, file_id: string) => {
    await dispatch(
      updateWorkspace({ workspace_id, active: true, active_file: file_id }),
    );
  };

  return (
    <TreeView
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
    >
      {workspaces.map((workspace) => {
        return (
          <TreeItem
            nodeId={workspace.id}
            key={workspace.id}
            label={workspace.name}
          >
            {workspace.fileRefs.map(({ id, name }) => {
              return (
                <TreeItem
                  nodeId={id}
                  key={id}
                  label={name}
                  onClick={() => {
                    handleClick(workspace.id, id).catch((error) => {
                      console.log(error);
                    });
                  }}
                />
              );
            })}
          </TreeItem>
        );
      })}
    </TreeView>
  );
}

export default SideBar;
