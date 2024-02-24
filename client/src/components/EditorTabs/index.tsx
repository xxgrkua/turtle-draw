import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import PublishIcon from "@mui/icons-material/Publish";
import SaveIcon from "@mui/icons-material/Save";
import ShortcutIcon from "@mui/icons-material/Shortcut";
import {
  AlertColor,
  Box,
  ButtonGroup,
  Grid,
  IconButton,
  Paper,
  Popover,
  Stack,
  Tab,
  Tabs,
  TextField,
  ThemeProvider,
  Tooltip,
  createTheme,
} from "@mui/material";
import React, { useEffect } from "react";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-scheme";
import { getInterpreter } from "rust-scheme";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  closeFile,
  createFile,
  createWorkspace,
  initFile,
  selectActiveWorkspace,
  selectAllWorkspaces,
  selectWorkbenchInitState,
  selectWorkspaceById,
  updateWorkspace,
} from "../../features/workbench";
import "./style.css";

const theme = createTheme({
  components: {
    MuiTabs: {
      styleOverrides: {
        root: {
          height: "24px",
          minHeight: "24px",
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          height: "24px",
          minHeight: "24px",
          textTransform: "none",
          fontFamily: [
            "-apple-system",
            "BlinkMacSystemFont",
            '"Segoe UI"',
            "Roboto",
            '"Helvetica Neue"',
            "Arial",
            "sans-serif",
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
          ].join(","),
          "&.Mui-selected": {
            backgroundColor: "white",
          },
        },
      },
    },
    MuiIconButton: {
      defaultProps: {
        size: "small",
      },
      styleOverrides: {
        sizeSmall: {
          "& svg": {
            fontSize: "1em",
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        sizeSmall: {
          fontSize: "0.75rem",
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        sizeSmall: {
          fontSize: "0.75rem",
        },
      },
    },
  },
});
interface FileProps {
  workspaceId: string;
  fileId: string;
  value: string | boolean;
  handleError: (message: string, severity?: AlertColor) => void;
}

function File(props: FileProps) {
  const { value, fileId, workspaceId, handleError } = props;
  const workspace = useAppSelector((state) => {
    return selectWorkspaceById(state, workspaceId);
  });
  const workspaces = useAppSelector(selectAllWorkspaces);

  const dispatch = useAppDispatch();

  const [code, setCode] = React.useState("");
  const [line, setLine] = React.useState("");

  const [history, setHistory] = React.useState<string[]>([]);

  const [newFileAnchorEl, setNewFileAnchorEl] =
    React.useState<null | HTMLButtonElement>(null);
  const [newWorkspaceAnchorEl, setNewWorkspaceAnchorEl] =
    React.useState<null | HTMLButtonElement>(null);

  const interpreter = getInterpreter();

  useEffect(() => {
    if (value === fileId) {
      dispatch(initFile({ workspace_id: workspaceId, file_id: fileId }));
    }
  });

  const handleLineChange = (line: string) => {
    if (line.endsWith("\n")) {
      const result = interpreter(line);
      const newHistory = [...history, result];
      setHistory(newHistory);
      setLine("");
    } else {
      setLine(line);
    }
  };

  const getCurrentDefaultFileName = () => {
    const filenameSet = new Set(workspace.fileRefs.map(({ name }) => name));
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

  const [newFileName, setNewFileName] = React.useState(
    getCurrentDefaultFileName(),
  );

  const handleNewFile = (name: string) => {
    dispatch(createFile({ workspace_id: workspaceId, name }))
      .unwrap()
      .catch((error) => {
        handleError(`${error}`, "error");
        console.log(error);
      });
  };

  const handleNewFilePopover = (event: React.MouseEvent<HTMLButtonElement>) => {
    setNewFileAnchorEl(event.currentTarget);
  };

  const handleNewFilePopoverClose = () => {
    setNewFileAnchorEl(null);
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

  const [newWorkspaceName, setNewWorkspaceName] = React.useState(
    getCurrentDefaultWorkspaceName(),
  );

  const handleNewWorkspace = (name: string) => {
    dispatch(createWorkspace({ name }))
      .unwrap()
      .catch((error) => {
        handleError(`${error}`, "error");
        console.log(error);
      });
  };

  const handleNewWorkspacePopover = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    setNewWorkspaceAnchorEl(event.currentTarget);
  };

  const handleNewWorkspacePopoverClose = () => {
    setNewWorkspaceAnchorEl(null);
  };

  return (
    <div role="tabpanel" hidden={value !== fileId}>
      {value === fileId && (
        <React.Fragment>
          <Box
            sx={{
              borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
            }}
          >
            <ButtonGroup variant="text">
              <Tooltip title="New File">
                <IconButton
                  onClick={(event) => {
                    setNewFileName(getCurrentDefaultFileName());
                    handleNewFilePopover(event);
                  }}
                >
                  <InsertDriveFileIcon />
                </IconButton>
              </Tooltip>
              <Popover
                open={Boolean(newFileAnchorEl)}
                anchorEl={newFileAnchorEl}
                onClose={handleNewFilePopoverClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
              >
                <Stack direction="row">
                  <TextField
                    required
                    label="filename"
                    variant="outlined"
                    size="small"
                    sx={{ margin: "8px" }}
                    value={newFileName}
                    onChange={(event) => {
                      setNewFileName(event.currentTarget.value);
                    }}
                  />
                  <IconButton
                    size="medium"
                    color="success"
                    onClick={() => {
                      handleNewFile(newFileName);
                      handleNewFilePopoverClose();
                    }}
                  >
                    <CheckIcon />
                  </IconButton>
                  <IconButton
                    size="medium"
                    color="error"
                    onClick={() => {
                      handleNewFilePopoverClose();
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Stack>
              </Popover>
              <Tooltip title="New Workspace">
                <IconButton
                  onClick={(event) => {
                    setNewWorkspaceName(getCurrentDefaultWorkspaceName());
                    handleNewWorkspacePopover(event);
                  }}
                >
                  <CreateNewFolderIcon />
                </IconButton>
              </Tooltip>
              <Popover
                open={Boolean(newWorkspaceAnchorEl)}
                anchorEl={newWorkspaceAnchorEl}
                onClose={handleNewWorkspacePopoverClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
              >
                <Stack direction="row">
                  <TextField
                    required
                    label="workspace name"
                    variant="outlined"
                    size="small"
                    sx={{ margin: "8px" }}
                    value={newWorkspaceName}
                    onChange={(event) => {
                      setNewWorkspaceName(event.currentTarget.value);
                    }}
                  />
                  <IconButton
                    size="medium"
                    color="success"
                    onClick={() => {
                      handleNewWorkspace(newWorkspaceName);
                      handleNewWorkspacePopoverClose();
                    }}
                  >
                    <CheckIcon />
                  </IconButton>
                  <IconButton
                    size="medium"
                    color="error"
                    onClick={() => {
                      handleNewWorkspacePopoverClose();
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Stack>
              </Popover>
              <Tooltip title="Save">
                <IconButton>
                  <SaveIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Run">
                <IconButton>
                  <ArrowRightIcon sx={{ transform: "scale(1.8)" }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Publish">
                <IconButton>
                  <PublishIcon sx={{ transform: "scale(1.2)" }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Export">
                <IconButton>
                  <ShortcutIcon />
                </IconButton>
              </Tooltip>
            </ButtonGroup>
          </Box>
          <Grid container>
            <Grid item xs={6} sx={{ borderRight: "1px solid rgb(0,0,0,0.12)" }}>
              <Grid container direction={"column"}>
                <Grid item xs={12}>
                  <Paper className="editor" elevation={0}>
                    <AceEditor
                      value={code}
                      mode="scheme"
                      height="100%"
                      width="100%"
                      tabSize={2}
                      onChange={setCode}
                      onLoad={(editor) => {
                        editor.focus();
                      }}
                      enableBasicAutocompletion={false}
                      enableLiveAutocompletion={false}
                      enableSnippets={false}
                      setOptions={{
                        showLineNumbers: true,
                      }}
                      fontSize={14}
                    />
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <Box className="terminal">
                    <Tabs
                      value={0}
                      variant="fullWidth"
                      sx={{
                        borderTop: "1px solid rgb(0,0,0,0.12)",
                        borderBottom: "1px solid rgb(0,0,0,0.12)",
                      }}
                      TabIndicatorProps={{
                        sx: { display: "none" },
                      }}
                    >
                      <Tab label="Terminal" />
                    </Tabs>
                    <Paper
                      elevation={0}
                      sx={{ height: "371px", overflow: "auto" }}
                    >
                      <div className="history">
                        {history.map((line, index) => (
                          <div key={index}>{line}</div>
                        ))}
                      </div>
                      <AceEditor
                        value={line}
                        mode="scheme"
                        width="100%"
                        tabSize={2}
                        onChange={handleLineChange}
                        onLoad={(editor) => {
                          editor.session.gutterRenderer = {
                            getWidth: function (
                              session,
                              lastLineNumber,
                              config,
                            ) {
                              return 3 * config.characterWidth;
                            },
                            getText: function (session, row) {
                              return "scm> ";
                            },
                          };
                        }}
                        enableBasicAutocompletion={false}
                        enableLiveAutocompletion={false}
                        enableSnippets={false}
                        setOptions={{
                          showLineNumbers: false,
                        }}
                        fontSize={14}
                        minLines={1}
                        maxLines={1}
                      />
                    </Paper>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <Paper elevation={0} sx={{ height: "100%" }}>
                canvas
              </Paper>
            </Grid>
          </Grid>
        </React.Fragment>
      )}
    </div>
  );
}

interface EditorTabsProps {
  handleError: (message: string, severity?: AlertColor) => void;
}

export default function EditorTabs({
  handleError,
}: EditorTabsProps): React.ReactElement {
  const activeWorkspace = useAppSelector(selectActiveWorkspace);
  const initState = useAppSelector(selectWorkbenchInitState);
  const dispatch = useAppDispatch();

  // const [value, setValue] = React.useState(
  //   activeWorkspace ? activeWorkspace.activeFile : false,
  // );

  const value = activeWorkspace ? activeWorkspace.activeFile : false;

  const handleChange = async (
    event: React.SyntheticEvent,
    newValue: string,
  ) => {
    if (activeWorkspace) {
      await dispatch(
        updateWorkspace({
          workspace_id: activeWorkspace.id,
          active_file: newValue,
        }),
      ).unwrap();
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={(event, newValue: string) => {
              handleChange(event, newValue).catch((error) => {
                handleError(`${error}`, "error");
                console.log(error);
              });
            }}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ backgroundColor: "rgb(243, 243, 243)" }}
            TabIndicatorProps={{
              sx: { display: "none" },
            }}
          >
            {initState === "succeeded" && activeWorkspace
              ? activeWorkspace.fileRefs
                  .filter(({ id: fileId }) =>
                    activeWorkspace.openedFiles.includes(fileId),
                  )
                  .map(({ id: fileId, name: filename }) => {
                    return (
                      <Tab
                        component="div"
                        label={filename}
                        key={fileId}
                        value={fileId}
                        disableRipple
                        sx={{ backgroundColor: "rgb(236,236,236)" }}
                        icon={
                          <IconButton
                            size="small"
                            onClick={(event) => {
                              event.stopPropagation();
                              dispatch(
                                closeFile({
                                  workspace_id: activeWorkspace.id,
                                  file_id: fileId,
                                }),
                              )
                                .unwrap()
                                .catch((error) => {
                                  handleError(`${error}`, "error");
                                  console.log(error);
                                });
                            }}
                          >
                            <CloseIcon />
                          </IconButton>
                        }
                        iconPosition="end"
                      />
                    );
                  })
              : null}
          </Tabs>
        </Box>
        {initState === "succeeded" && activeWorkspace && value
          ? activeWorkspace.openedFiles.map((fileId) => {
              return (
                <File
                  value={value}
                  fileId={fileId}
                  workspaceId={activeWorkspace.id}
                  key={fileId}
                  handleError={handleError}
                />
              );
            })
          : null}
      </Box>
    </ThemeProvider>
  );
}
