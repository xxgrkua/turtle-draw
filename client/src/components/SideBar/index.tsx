import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CreateNewFolder from "@mui/icons-material/CreateNewFolder";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InsertDriveFile from "@mui/icons-material/InsertDriveFile";
import {
  Button,
  ButtonGroup,
  ThemeProvider,
  Typography,
  alpha,
  createTheme,
  styled,
} from "@mui/material";
import {
  TreeItem,
  TreeItemContentProps,
  TreeItemProps,
  useTreeItem,
} from "@mui/x-tree-view/TreeItem";
import { TreeView } from "@mui/x-tree-view/TreeView";
import clsx from "clsx";
import React, { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  selectActiveWorkspace,
  selectActiveWorkspaceId,
  selectAllWorkspaces,
  selectWorkbenchState,
  updateWorkspace,
} from "../../features/workbench";
import "./style.css";

const CustomContentRoot = styled("div")(({ theme }) => ({
  WebkitTapHighlightColor: "transparent",
  "&&:hover, &&.Mui-disabled, &&.Mui-focused, &&.Mui-selected, &&.Mui-selected.Mui-focused, &&.Mui-selected:hover":
    {
      backgroundColor: "transparent",
    },
  ".MuiTreeItem-contentBar": {
    position: "absolute",
    width: "100%",
    height: 24,
    left: 0,
  },
  "&:hover .MuiTreeItem-contentBar": {
    backgroundColor: theme.palette.action.hover,
    // Reset on touch devices, it doesn't add specificity
    "@media (hover: none)": {
      backgroundColor: "transparent",
    },
  },
  "&.Mui-disabled .MuiTreeItem-contentBar": {
    opacity: theme.palette.action.disabledOpacity,
    backgroundColor: "transparent",
  },
  "&.Mui-focused .MuiTreeItem-contentBar": {
    backgroundColor: theme.palette.action.focus,
  },
  "&.Mui-selected .MuiTreeItem-contentBar": {
    backgroundColor: alpha(
      theme.palette.primary.main,
      theme.palette.action.selectedOpacity,
    ),
  },
  "&.Mui-selected:hover .MuiTreeItem-contentBar": {
    backgroundColor: alpha(
      theme.palette.primary.main,
      theme.palette.action.selectedOpacity + theme.palette.action.hoverOpacity,
    ),
    // Reset on touch devices, it doesn't add specificity
    "@media (hover: none)": {
      backgroundColor: alpha(
        theme.palette.primary.main,
        theme.palette.action.selectedOpacity,
      ),
    },
  },
  "&.Mui-selected.Mui-focused .MuiTreeItem-contentBar": {
    backgroundColor: alpha(
      theme.palette.primary.main,
      theme.palette.action.selectedOpacity + theme.palette.action.focusOpacity,
    ),
  },
}));

const CustomContent = React.forwardRef(function CustomContent(
  props: TreeItemContentProps,
  ref,
) {
  const {
    classes,
    className,
    label,
    nodeId,
    icon: iconProp,
    expansionIcon,
    displayIcon,
    onClick,
  } = props;

  const {
    disabled,
    expanded,
    selected,
    focused,
    handleExpansion,
    handleSelection,
    preventSelection,
  } = useTreeItem(nodeId);

  const icon = iconProp || expansionIcon || displayIcon;

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    preventSelection(event);
  };

  const handleExpansionClick = (event: React.MouseEvent<HTMLDivElement>) => {
    handleExpansion(event);
  };

  const handleSelectionClick = (event: React.MouseEvent<HTMLDivElement>) => {
    handleSelection(event);
    onClick?.(event);
  };

  return (
    <CustomContentRoot
      className={clsx(className, classes.root, {
        "Mui-expanded": expanded,
        "Mui-selected": selected,
        "Mui-focused": focused,
        "Mui-disabled": disabled,
      })}
      onMouseDown={handleMouseDown}
      ref={ref as React.Ref<HTMLDivElement>}
    >
      <div className="MuiTreeItem-contentBar" />
      <div onClick={handleExpansionClick} className={classes.iconContainer}>
        {icon}
      </div>
      <Typography
        onClick={handleSelectionClick}
        component="div"
        className={classes.label}
      >
        {label}
      </Typography>
    </CustomContentRoot>
  );
});

const CustomTreeItem = React.forwardRef(function CustomTreeItem(
  props: TreeItemProps,
  ref: React.Ref<HTMLLIElement>,
) {
  return <TreeItem ContentComponent={CustomContent} {...props} ref={ref} />;
});

const theme = createTheme({
  palette: {
    primary: {
      main: "rgb(0,0,0,0.54)",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
    MuiButtonGroup: {
      styleOverrides: {
        firstButton: {
          borderRight: "0px solid",
        },
      },
    },
  },
});

function SideBar(): React.ReactElement {
  const workspaces = useAppSelector(selectAllWorkspaces);
  const dispatch = useAppDispatch();
  const initState = useAppSelector(selectWorkbenchState);
  const activeWorkspaceId = useAppSelector(selectActiveWorkspaceId);
  const activeWorkspace = useAppSelector(selectActiveWorkspace);

  const [expanded, setExpanded] = React.useState<string[]>(
    activeWorkspaceId ? [activeWorkspaceId] : [],
  );

  const [selected, setSelected] = React.useState<string>("");

  useEffect(() => {
    if (activeWorkspaceId) {
      if (activeWorkspace?.activeFile) {
        setSelected(activeWorkspace.activeFile);
      } else {
        setSelected(activeWorkspaceId);
      }
    }
  }, [activeWorkspaceId, activeWorkspace?.activeFile]);

  const handleClick = async (workspace_id: string, file_id: string) => {
    await dispatch(
      updateWorkspace({ workspace_id, active: true, active_file: file_id }),
    );
  };

  return (
    <React.Fragment>
      <ThemeProvider theme={theme}>
        <ButtonGroup variant="text" size="small" sx={{ padding: "12px" }}>
          <Button startIcon={<InsertDriveFile />}>New File</Button>
          <Button startIcon={<CreateNewFolder />}>New Workspace</Button>
        </ButtonGroup>
      </ThemeProvider>
      <TreeView
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        expanded={expanded}
        selected={selected}
        onNodeToggle={(event, nodes) => {
          setExpanded(nodes);
        }}
        onNodeSelect={(event, nodeId) => {
          setSelected(nodeId);
        }}
        sx={{ position: "relative" }}
      >
        {initState === "succeeded"
          ? workspaces.map((workspace) => {
              return (
                <CustomTreeItem
                  nodeId={workspace.id}
                  key={workspace.id}
                  label={workspace.name}
                >
                  {workspace.fileRefs.map(({ id, name }) => {
                    return (
                      <CustomTreeItem
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
                </CustomTreeItem>
              );
            })
          : null}
      </TreeView>
    </React.Fragment>
  );
}

export default SideBar;
