import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { makeStyles } from '@mui/styles';

import { Paper } from '@mui/material';
import { Box } from '@mui/material';
import { useEffect } from "react";

import { TextField } from '@mui/material';
import Divider from "@mui/material/Divider";
import EditIcon from "@mui/icons-material/Edit";
import { Button } from '@mui/material';
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import List from "@mui/material/List";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import AlertTitle from "@mui/material/AlertTitle";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import FactCheckIcon from "@mui/icons-material/FactCheck";

//import axios from "axios";

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
});
function Editor(props) {
  const classes = useStyles();

  const [editorValue, setEditorValue] = React.useState("");

  const [fileName, setFileName] = React.useState("");
  const [idOfDoc, setIdOfDoc] = React.useState("");
  const [alertMessage, setAlertMessage] = React.useState("");
  const [getDB, setGetDB] = React.useState("");

  //API NODE.JS

  const [api, setApi] = React.useState();

  var url = "http://127.0.0.1:1337";
  // const hostArray = ["127.0.0.1", "127.0.0.1"];

  // if (hostArray.includes(window.location.hostname)) {
  //   url = "http://127.0.0.1:1337";
  // } else {
  //   url = "https://jsramverk-editor-afbo19.azurewebsites.net/";
  // }



  //axio for api
 /*  useEffect(() => {
    axios.get(url + "/get").then((res) => {
      console.log("info:", res.data);
      setApi(res.data);
      setGetDB("");
    });

    return () => {};
  }, [getDB]); */



  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${url}/get`);
        const data = await response.json();
        console.log("info:", data);
        setApi(data);
        setGetDB("");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    return () => {};
  }, [url,getDB]);

  const getEditorValue = () => {
    console.log(editorValue);
  };
  const saveValueInDB = () => {
    if (fileName) {
      fetch(url + "/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: fileName, value: editorValue }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
          setAlertMessage("File " + fileName + " created!");
          setGetDB("POST");
        })
        .catch((error) => {
          console.error("Error:", error);
        });

      console.log("File Saved");
    } else {
      setAlertMessage("Give a name to the file!");
    }
  };
  const putValueInDB = () => {
    if (fileName) {
      fetch(url + "/put", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: idOfDoc,
          name: fileName,
          value: editorValue,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
          setAlertMessage(fileName + " updated!");
          setGetDB("Edit");
        })
        .catch((error) => {
          console.error("Error:", error);
        });

      console.log("File Updated");
    } else {
      setAlertMessage("Give a name to the file!");
    }
  };

  const deleteValueInDB = () => {
    if (fileName) {
      fetch(url + "/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: idOfDoc,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
          setAlertMessage(fileName + " deleted from DB!");
          setGetDB("Delete");
        })
        .catch((error) => {
          console.error("Error:", error);
        });

      console.log("File Deleted");
    } else {
      setAlertMessage("Give a name to the file!");
    }
  };

  return (
    <div>
      <Paper className={classes.root}>
        <Box textAlign="center">
          <TextField
            id="outlined-basic"
            label="Enter file name"
            variant="standard"
            focused
            required
            onChange={(event) => {
              setFileName(event.target.value);
            }}
            value={fileName ? fileName : ""}
          />
          {idOfDoc ? (
            <>
              <Button
                style={{
                  marginTop: "1.1%",
                  textTransform: "none",
                  borderLeft: "1px solid black",
                }}
                onClick={putValueInDB}
              >
                Edit | <EditIcon fontSize="small" />
              </Button>
              <Button
                style={{
                  marginTop: "1.1%",
                  textTransform: "none",
                  borderLeft: "1px solid black",
                }}
                onClick={() => {
                  deleteValueInDB("");
                  setEditorValue("");
                  setFileName("");
                  setIdOfDoc("");
                }}
              >
                Delete
                <DeleteForeverIcon fontSize="small" />
              </Button>
            </>
          ) : null}
          <Button
            style={{
              marginTop: "1.1%",
              textTransform: "none",
              borderLeft: "1px solid black",
            }}
            onClick={() => {
              saveValueInDB("");
              setEditorValue("");
              setFileName("");
              setIdOfDoc("");
            }}
          >
            Create New File <NoteAddIcon fontSize="small" />
          </Button>
          <Button
            style={{
              marginTop: "1.1%",
              textTransform: "none",
              borderLeft: "1px solid black",
            }}
            onClick={getEditorValue}
          >
            Show In Console <FactCheckIcon fontSize="small" />
          </Button>
        </Box>
      </Paper>
      <div>
        <div
          style={{
            width: "80%",
            border: "1px solid black",
            minHeight: "81vh",
            display: "inline-block",
          }}
        >
          <CKEditor
            editor={ClassicEditor}
            data={editorValue ? editorValue : ""}
            onChange={(event, editor) => {
              const data = editor.getData();
              setEditorValue(data);
            }}
              onError={(error) => {
    console.error("CKEditor error:", error);
  }}
          />
        </div>
        <div
          style={{
            width: "19.47%",
            display: "inline-block",
            position: "absolute",
            minHeight: "81vh",
          }}
        >
          {alertMessage ? (
            <Stack>
              <Alert severity="info">
                <AlertTitle>Info</AlertTitle>
                <strong>{alertMessage}</strong>
              </Alert>
            </Stack>
          ) : null}
          <div
            style={{
              borderBottom: "1px solid black",
              textAlign: "center",
            }}
          >
            <h3 data-testid="todo-1">Existing files</h3>
          </div>

          <Paper
            style={{
              maxHeight: "54.8vh",
              overflow: "auto",
              textAlign: "center",
            }}
          >
            <List>
              {Array.isArray(api)
                ? api.map((DBvalue) => (
                    <div
                      style={{
                        marginTop: "3px",
                      }}
                    >
                      <Button
                        style={{ textTransform: "none" }}
                        onClick={() => {
                          setEditorValue(DBvalue.value);
                          setFileName(DBvalue.name);
                          setIdOfDoc(DBvalue._id);
                          setAlertMessage("");
                        }}
                      >
                        {DBvalue.name}
                      </Button>

                      <Divider variant="middle" />
                    </div>
                  ))
                : "There is no saved file to show"}
            </List>
          </Paper>
        </div>
      </div>
    </div>
  );
}

export default Editor;
