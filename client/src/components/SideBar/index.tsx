import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CreateNewFolder from "@mui/icons-material/CreateNewFolder";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InsertDriveFile from "@mui/icons-material/InsertDriveFile";
import {
  AlertColor,
  Box,
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
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
  createFile,
  createWorkspace,
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
      {/* ref: https://stackoverflow.com/a/5836525 */}
      <div
        className="MuiTreeItem-contentBar"
        style={{ pointerEvents: "none" }}
      />
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
        middleButton: {
          borderRight: "0px solid",
        },
      },
    },
  },
});

interface SideBarProps {
  handleError: (message: string, severity?: AlertColor) => void;
}

export default function SideBar({
  handleError,
}: SideBarProps): React.ReactElement {
  const workspaces = useAppSelector(selectAllWorkspaces);
  const dispatch = useAppDispatch();
  const initState = useAppSelector(selectWorkbenchState);
  const activeWorkspaceId = useAppSelector(selectActiveWorkspaceId);
  const activeWorkspace = useAppSelector(selectActiveWorkspace);

  const [expanded, setExpanded] = React.useState<string[]>(
    activeWorkspaceId ? [activeWorkspaceId] : [],
  );

  const [selected, setSelected] = React.useState<string>("");

  const getCurrentDefaultFileName = () => {
    const filenameSet = new Set(
      Object.entries(activeWorkspace ? activeWorkspace.fileRefs : {}).map(
        ([, { name }]) => name,
      ),
    );
    let index = 0;
    while (true) {
      if (index === 0) {
        if (!filenameSet.has("Untitled.scm")) {
          return "Untitled.scm";
        }
      } else {
        if (!filenameSet.has(`Untitled-${index}.scm`)) {
          return `Untitled-${index}.scm`;
        }
      }
      index++;
    }
  };

  const getCurrentDefaultWorkspaceName = () => {
    const workspaceNameSet = new Set(workspaces.map(({ name }) => name));
    let index = 0;
    while (true) {
      if (index === 0) {
        if (!workspaceNameSet.has("Workspace")) {
          return "Workspace";
        }
      } else {
        if (!workspaceNameSet.has(`Workspace-${index}`)) {
          return `Workspace-${index}`;
        }
      }
      index++;
    }
  };

  const [newFileName, setNewFileName] = React.useState<string>(
    getCurrentDefaultFileName(),
  );
  const [workspaceName, setWorkspaceName] = React.useState<string>(
    getCurrentDefaultWorkspaceName(),
  );
  const [newFileDialogOpen, setNewFileDialogOpen] =
    React.useState<boolean>(false);
  const [newWorkspaceDialogOpen, setNewWorkspaceDialogOpen] =
    React.useState<boolean>(false);

  useEffect(() => {
    if (activeWorkspaceId) {
      if (activeWorkspace?.activeFile) {
        setSelected(activeWorkspace.activeFile);
      } else {
        setSelected(activeWorkspaceId);
      }
    }
  }, [activeWorkspaceId, activeWorkspace?.activeFile]);

  const handleWorkspaceClick = async (workspace_id: string) => {
    await dispatch(updateWorkspace({ workspace_id, active: true })).unwrap();
  };

  const handleFileClick = async (workspace_id: string, file_id: string) => {
    await dispatch(
      updateWorkspace({ workspace_id, active: true, active_file: file_id }),
    ).unwrap();
  };

  const handleNewFileDialogOpen = () => {
    setNewFileDialogOpen(true);
  };

  const handleNewFileDialogClose = () => {
    setNewFileDialogOpen(false);
    setNewFileName(getCurrentDefaultFileName());
  };

  const handleNewFile = (name: string) => {
    if (activeWorkspaceId) {
      dispatch(createFile({ workspace_id: activeWorkspaceId, name }))
        .unwrap()
        .catch((error) => {
          handleError(`${error}`, "error");
          console.log(error);
        });
    }
  };

  const handleNewWorkspaceDialogOpen = () => {
    setNewWorkspaceDialogOpen(true);
  };

  const handleNewWorkspaceDialogClose = () => {
    setNewWorkspaceDialogOpen(false);
  };

  const handleNewWorkspace = (name: string) => {
    dispatch(createWorkspace({ name }))
      .unwrap()
      .catch((error) => {
        handleError(`${error}`, "error");
        console.log(error);
      });
  };

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexFlow: "column",
      }}
    >
      <div style={{ flex: "0", height: "100%" }}>
        <ThemeProvider theme={theme}>
          <ButtonGroup variant="text" size="small" sx={{ padding: "12px" }}>
            <Button
              startIcon={<InsertDriveFile />}
              onClick={() => {
                setNewFileName(getCurrentDefaultFileName());
                handleNewFileDialogOpen();
              }}
              disabled={!activeWorkspaceId}
              color="inherit"
            >
              New File
            </Button>
            <Dialog
              open={newFileDialogOpen}
              onClose={handleNewFileDialogClose}
              fullWidth
              PaperProps={{
                component: "form",
                onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                  event.preventDefault();
                  handleNewFile(newFileName);
                  handleNewFileDialogClose();
                },
              }}
            >
              <DialogTitle>New File</DialogTitle>
              <DialogContent>
                <TextField
                  autoFocus
                  required
                  margin="dense"
                  label="File Name"
                  variant="standard"
                  value={newFileName}
                  fullWidth
                  onChange={(event) => {
                    setNewFileName(event.target.value);
                  }}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleNewFileDialogClose}>Cancel</Button>
                <Button type="submit">Create</Button>
              </DialogActions>
            </Dialog>
            <Button
              startIcon={<CreateNewFolder />}
              onClick={() => {
                setWorkspaceName(getCurrentDefaultWorkspaceName());
                handleNewWorkspaceDialogOpen();
              }}
              color="inherit"
            >
              New Workspace
            </Button>
            <Dialog
              open={newWorkspaceDialogOpen}
              onClose={handleNewWorkspaceDialogClose}
              fullWidth
              PaperProps={{
                component: "form",
                onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                  event.preventDefault();
                  handleNewWorkspace(workspaceName);
                  handleNewWorkspaceDialogClose();
                },
              }}
            >
              <DialogTitle>New Workspace</DialogTitle>
              <DialogContent>
                <TextField
                  autoFocus
                  required
                  margin="dense"
                  label="Workspace Name"
                  variant="standard"
                  value={workspaceName}
                  fullWidth
                  onChange={(event) => {
                    setWorkspaceName(event.target.value);
                  }}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleNewWorkspaceDialogClose}>Cancel</Button>
                <Button type="submit">Create</Button>
              </DialogActions>
            </Dialog>
          </ButtonGroup>
        </ThemeProvider>
      </div>
      <div style={{ flex: "auto", height: "100%" }}>
        <Box sx={{ height: "100%" }}>
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
            sx={{
              position: "relative",
              overflow: "auto",
            }}
          >
            {initState === "succeeded"
              ? workspaces.map((workspace) => {
                  return (
                    <CustomTreeItem
                      nodeId={workspace.id}
                      key={workspace.id}
                      label={workspace.name}
                      onClick={() => {
                        handleWorkspaceClick(workspace.id).catch((error) => {
                          handleError(`${error}`, "error");
                          console.log(error);
                        });
                      }}
                    >
                      {Object.entries(workspace.fileRefs).map(
                        ([, { id, name }]) => {
                          return (
                            <CustomTreeItem
                              nodeId={id}
                              key={id}
                              label={name}
                              onClick={() => {
                                handleFileClick(workspace.id, id).catch(
                                  (error) => {
                                    handleError(`${error}`, "error");
                                    console.log(error);
                                  },
                                );
                              }}
                            />
                          );
                        },
                      )}
                    </CustomTreeItem>
                  );
                })
              : null}
          </TreeView>
        </Box>
      </div>
    </div>
  );
}
