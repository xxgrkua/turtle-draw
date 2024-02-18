import { Box, Grid, Paper, Tab, Tabs } from "@mui/material";
import React from "react";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-scheme";
import { getInterpreter } from "rust-scheme";
import "./style.css";

interface TabPanelProps {
  index: number;
  value: number;
}

function File(props: TabPanelProps) {
  const { value, index, ...other } = props;

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

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Grid container>
          <Grid item xs={6}>
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
                <Tabs value={0}>
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
                <Tabs value={0}>
                  <Tab label="Graphic" />
                </Tabs>
                <Paper className="canvas">canvas</Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function EditorTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Item One" {...a11yProps(0)} />
          <Tab label="Item Two" {...a11yProps(1)} />
          <Tab label="Item Three" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <File value={value} index={0} />
      <File value={value} index={1} />
      <File value={value} index={2} />
    </Box>
  );
}
