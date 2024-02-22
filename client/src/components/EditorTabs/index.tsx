import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import CloseIcon from "@mui/icons-material/Close";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import SaveIcon from "@mui/icons-material/Save";
import {
  Box,
  ButtonGroup,
  Grid,
  IconButton,
  Paper,
  Tab,
  Tabs,
  ThemeProvider,
  Tooltip,
  createTheme,
} from "@mui/material";
import React from "react";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-scheme";
import { getInterpreter } from "rust-scheme";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  closeFile,
  createFile,
  selectActiveWorkspace,
  selectWorkbenchInitState,
  updateWorkspace,
} from "../../features/workbench";
import "./style.css";

interface FileProps {
  workspaceId: string;
  fileId: string;
  value: string | boolean;
}

function File(props: FileProps) {
  const { value, fileId, workspaceId } = props;

  const dispatch = useAppDispatch();

  const [code, setCode] = React.useState("");
  const [line, setLine] = React.useState("");

  const [history, setHistory] = React.useState<string[]>([]);

  const interpreter = getInterpreter();

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

  const handleNewFile = () => {
    dispatch(createFile({ workspace_id: workspaceId, name: "new file" })).catch(
      (error) => {
        console.log(error);
      },
    );
  };

  return (
    <div role="tabpanel" hidden={value !== fileId}>
      {value === fileId && (
        <Grid container>
          <Grid
            item
            xs={12}
            sx={{
              borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
            }}
          >
            <ButtonGroup variant="text">
              <Tooltip title="New File">
                <IconButton onClick={handleNewFile}>
                  <InsertDriveFileIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="New Workspace">
                <IconButton>
                  <CreateNewFolderIcon />
                </IconButton>
              </Tooltip>
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
            </ButtonGroup>
          </Grid>
          <Grid item xs={6} sx={{ borderRight: "1px solid rgb(0,0,0,0.12)" }}>
            <Grid container direction={"column"}>
              <Grid item xs={12}>
                <Paper className="editor">
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
                <Paper className="terminal">
                  <div className="history">
                    {history.map((line, index) => (
                      <div key={index}>{line}</div>
                    ))}
                  </div>
                  <AceEditor
                    value={line}
                    mode="scheme"
                    height="100%"
                    width="100%"
                    tabSize={2}
                    onChange={handleLineChange}
                    onLoad={(editor) => {
                      editor.session.gutterRenderer = {
                        getWidth: function (session, lastLineNumber, config) {
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
                  />
                </Paper>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <Grid container direction={"column"}>
              <Grid item xs={12}>
                <Paper className="canvas">canvas</Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}
    </div>
  );
}

const tabTheme = createTheme({
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
  },
});

export default function EditorTabs() {
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
      );
    }
  };

  return (
    <ThemeProvider theme={tabTheme}>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={(event, newValue: string) => {
              handleChange(event, newValue).catch((error) => {
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
                        label={filename}
                        key={fileId}
                        value={fileId}
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
                              ).catch((error) => {
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
                />
              );
            })
          : null}
      </Box>
    </ThemeProvider>
  );
}
