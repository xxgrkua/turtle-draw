import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import PublishIcon from "@mui/icons-material/Publish";
import RefreshIcon from "@mui/icons-material/Refresh";
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
import React, { useEffect, useMemo } from "react";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-scheme";
import { Interpreter, SVGPath } from "rust-scheme";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { closeTerminal } from "../../features/terminal";
import {
  closeFile,
  createFile,
  createWorkspace,
  initFile,
  saveFile,
  selectActiveWorkspace,
  selectAllWorkspaces,
  selectFileById,
  selectFileSaveState,
  selectFileState,
  selectWorkbenchInitState,
  selectWorkspaceById,
  unsavedFile,
  updateFile,
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
  const editorRef = React.useRef<AceEditor | null>(null);
  const workspace = useAppSelector((state) => {
    return selectWorkspaceById(state, workspaceId);
  });
  const workspaces = useAppSelector(selectAllWorkspaces);
  const fileState = useAppSelector((state) =>
    selectFileState(state, workspaceId, fileId),
  );
  const fileSaved = useAppSelector((state) =>
    selectFileSaveState(state, workspaceId, fileId),
  );
  const file = useAppSelector((state) =>
    selectFileById(state, workspaceId, fileId),
  );

  const dispatch = useAppDispatch();

  const [code, setCode] = React.useState("");
  const [history, setHistory] = React.useState<string[]>([]);
  const [current, setCurrent] = React.useState("");
  const [restartCount, setRestartCount] = React.useState(0);
  const interpreter = useMemo(() => {
    restartCount;
    return new Interpreter();
  }, [restartCount]);

  const [newFileAnchorEl, setNewFileAnchorEl] =
    React.useState<null | HTMLButtonElement>(null);
  const [newWorkspaceAnchorEl, setNewWorkspaceAnchorEl] =
    React.useState<null | HTMLButtonElement>(null);

  // const interpreter = useMemo(() => new Interpreter(), []);
  const [paths, setPaths] = React.useState<SVGPath[]>([]);
  const [visible, setVisible] = React.useState(true);
  const [turtle_x, setTurtle_x] = React.useState(0);
  const [turtle_y, setTurtle_y] = React.useState(0);
  const [rotation, setRotation] = React.useState(-90);
  const [bgColor, setBgColor] = React.useState("white");

  useEffect(() => {
    if (value === fileId && fileState === "idle") {
      // dispatch(initTerminal({ file_id: fileId }));
      dispatch(initFile({ workspace_id: workspaceId, file_id: fileId }))
        .unwrap()
        .catch((error) => {
          handleError(`${error}`, "error");
          console.log(error);
        });
    }
  }, [dispatch, fileId, fileState, value, workspaceId, handleError]);

  // const history = useAppSelector((state) => selectHistory(state, fileId));
  // const line = useAppSelector((state) => selectCurrent(state, fileId));
  // const interpreter = useAppSelector((state) =>
  //   selectInterpreter(state, fileId),
  // );

  useEffect(() => {
    if (file) {
      setCode(file.content);
      // const row = (editorRef.current?.editor.session.getLength() || 1) - 1;
      // const column = editorRef.current?.editor.session.getLine(row).length || 0;
      // editorRef.current?.editor.moveCursorTo(row, column);
    }
  }, [file]);

  const handleLineChange = (line: string) => {
    if (line.endsWith("\n")) {
      let output = "";
      try {
        const result = interpreter.eval(line);
        output = result.console;
        const canvas = result.canvas;
        setPaths(canvas.paths);
        setVisible(canvas.visible);
        setTurtle_x(canvas.x);
        setTurtle_y(canvas.y);
        setRotation(canvas.rotation);
      } catch (error) {
        output = error as string;
      }
      setHistory([...history, `scm> ${line}`, output]);
      // dispatch(updateHistory({ file_id: fileId, out: output }));
      // dispatch(setCurrent({ file_id: fileId, current: "" }));
      setCurrent("");
    } else {
      setCurrent(line);
    }
  };

  const getCurrentDefaultFileName = () => {
    const filenameSet = new Set(
      Object.entries(workspace.fileRefs).map(([, { name }]) => name),
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

  const [newFileName, setNewFileName] = React.useState(
    getCurrentDefaultFileName(),
  );

  const handleNewFile = (name: string) => {
    // dispatch(initTerminal({ file_id: fileId }));
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

  const handleSave = () => {
    let finalCode = code;
    if (!finalCode.endsWith("\n")) {
      finalCode += "\n";
    }
    dispatch(
      updateFile({
        workspace_id: workspaceId,
        file_id: fileId,
        content: finalCode,
      }),
    )
      .unwrap()
      .then(() =>
        dispatch(saveFile({ workspace_id: workspaceId, file_id: fileId })),
      )
      .catch((error) => {
        handleError(`${error}`, "error");
        console.log(error);
      });
  };

  const handleRun = () => {
    try {
      restartInterpreter();
      const result = interpreter.eval(`(begin ${code})`);
      const canvas = result.canvas;
      setHistory([result.console]);
      setPaths(canvas.paths);
      setVisible(canvas.visible);
      setTurtle_x(canvas.x);
      setTurtle_y(canvas.y);
      setRotation(canvas.rotation);
    } catch (error) {
      // dispatch(updateHistory({ file_id: fileId, out: error as string }));
    }
  };

  const restartInterpreter = () => {
    setHistory([]);
    setCurrent("");
    setRestartCount(restartCount + 1);
    // dispatch(restartTerminal({ file_id: fileId }));
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
              <Tooltip title="Save File">
                <span>
                  <IconButton disabled={fileSaved} onClick={handleSave}>
                    <SaveIcon />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title="Run Code">
                <IconButton onClick={handleRun}>
                  <ArrowRightIcon sx={{ transform: "scale(1.8)" }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Restart Interpreter">
                <IconButton onClick={restartInterpreter}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Publish File">
                <IconButton>
                  <PublishIcon sx={{ transform: "scale(1.2)" }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Export SVG">
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
                      ref={editorRef}
                      value={code}
                      mode="scheme"
                      height="100%"
                      width="100%"
                      tabSize={2}
                      onChange={(content) => {
                        setCode(content);
                        dispatch(
                          unsavedFile({
                            workspace_id: workspaceId,
                            file_id: fileId,
                          }),
                        );
                      }}
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
                        value={current}
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
                <svg
                  width="100%"
                  height="100%"
                  xmlns="http://www.w3.org/2000/svg"
                  version="1.1"
                  viewBox="-256 -256 512 512"
                >
                  <g>
                    {Array.from(paths.entries()).map(([index, path]) => {
                      return (
                        <path
                          key={index}
                          d={path.d}
                          fill={path.fill}
                          stroke={path.stroke}
                          // strokeWidth={path.strokeWidth}
                        />
                      );
                    })}
                    {visible ? (
                      <polygon
                        points="0,0 -10,5 -10,-5"
                        transform={`translate(${turtle_x},${turtle_y}) rotate(${rotation})`}
                      />
                    ) : null}
                  </g>
                </svg>
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
              ? activeWorkspace.openedFiles.map((fileId) => {
                  const filename = activeWorkspace.fileRefs[fileId].name;
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
                            dispatch(closeTerminal({ file_id: fileId }));
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
