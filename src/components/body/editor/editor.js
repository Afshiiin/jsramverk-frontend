import React, { useContext } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { makeStyles } from '@mui/styles';
import { Paper } from '@mui/material';
import { Box } from '@mui/material';
import { useEffect,useRef } from "react";
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
import LogoutIcon from '@mui/icons-material/Logout';
import ResizeObserver from 'resize-observer-polyfill';
import { io } from "socket.io-client";
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/userContext'; 
import { Select, MenuItem, Checkbox, ListItemText, FormControl, InputLabel } from '@mui/material';




if (typeof window !== "undefined" && !window.ResizeObserver) {
  window.ResizeObserver = ResizeObserver;
}

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
});
function Editor(props) {
  
  const { user, setUser } = useContext(UserContext);
  const classes = useStyles();
  const navigate = useNavigate();

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

  useEffect(() => {
    const token = localStorage.getItem('jwt'); // Get the JWT token from local storage
    if (!token) {
      navigate('/'); // Redirect to login if no token is found
    }
  }, [navigate]);

const [checkOwnerDelete, setCheckOwnerDelete] = React.useState();


if(user) {
localStorage.setItem('UserLoggedIn', user);
}

if (!user) {
  const loggedInUser = localStorage.getItem('UserLoggedIn');
  if (loggedInUser) {
    setUser(loggedInUser); 
  }
}

//list of users material ui
const [selecUsersToShare, setSelecUsersToShare] = React.useState([]);
const [allUsers, setAllUsers] = React.useState([]);


const handleChange = (event) => {
  setSelecUsersToShare(event.target.value);
};

const [socket, setSocket] = React.useState(null);
const [room, setRoom] = React.useState("");
/* const [titleRoom, setTitleRoom] = React.useState("");
const [valueRoom, setValueRoom] = React.useState(""); */

const join_Room = (idRoom) => {
  if (socket && idRoom) {
    if (room) {
      setGetDB("UpdateDatabaseList");
      socket.emit("leave-room", room); // Leave the current room
    }
    setGetDB("UpdateDatabaseList");
    socket.emit("join-room", idRoom); // Join the new room
    setRoom(idRoom); 
  }
};



const isFromSocket = useRef(false);

const sendMessage = (data) => {
  if (socket && room && !isFromSocket.current) {
    socket.emit("sendValuetoSocket", data, room); 
    setGetDB("UpdateDatabaseList");
  } else {
    console.error("Socket is not connected or no room set");
  }
};


useEffect(() => {
  const newSocket = io("http://127.0.0.1:1337");
  setSocket(newSocket);

  newSocket.on("reciveValuefromSocket", (data) => {
    setGetDB("UpdateDatabaseList");
    isFromSocket.current = true;  
    setEditorValue(data);         
  });

  return () => {
    if (newSocket) {
      newSocket.disconnect();
    }
  };
}, []);




useEffect(() => {
  isFromSocket.current = false;
}, [editorValue]);





  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('jwt'); 
        const response = await fetch(`${url}/get`, {
          headers: {
            'Authorization': `Bearer ${token}`, // Include the token in the request header
          },
        });
        if (response.status === 401) {
          navigate('/'); 
          return; 
        }
        const data = await response.json();
        setApi(data);
        setGetDB("");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    return () => {};
  }, [url, getDB, navigate]);

//get users with REST-API 
/* useEffect(() => {
  const fetchData = async () => {
    try {
      const token = localStorage.getItem('jwt'); 
      const response = await fetch(`${url}/getUsers`, {
        headers: {
          'Authorization': `Bearer ${token}`, 
        },
      });
      if (response.status === 401) {
        return; 
      }
      const users = await response.json();
      setAllUsers(users); 
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  fetchData();

  return () => {};
}, [url, getDB]); */



// Get only users email of users with GraphQL
useEffect(() => {

  const fetchData = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:1337/graphql`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
             query {
               users  {
                 u_email
                      }
                    }
          `,
        }),
      });
      if (response.status === 401) {
        console.log("Unauthorized access");
        return; 
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const { data } = await response.json(); 
      setAllUsers(data.users); 
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  fetchData();

  return () => {
  };
}, [url, getDB]);

console.log("emails: ", allUsers)

  const getEditorValue = () => {
    console.log(editorValue);
  };
  
  const logOut = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("UserLoggedIn");
    window.location.assign('/')

  };
  const saveValueInDB = () => {
    if (fileName) {
      fetch(url + "/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: fileName, value: editorValue, owner: user, allowed_users: selecUsersToShare }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
          setAlertMessage("File " + fileName + " created!");
          setGetDB("POST");
          setSelecUsersToShare([]);
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
          allowed_users: selecUsersToShare,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
          setAlertMessage(fileName + " updated!");
          setGetDB("Edit");
          setSelecUsersToShare([]);
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
          owner: user,
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
            data-testid="inputTitleDoc"
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
                Edit | <EditIcon style={{minWidth: '40px'}} fontSize="small" />
              </Button>
              {checkOwnerDelete === user && (
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
                  <DeleteForeverIcon style={{minWidth: '40px'}} fontSize="small" />
                </Button>
              )}
            </>
          ) : null}
             <FormControl sx={{ m: 0.5, width: 200 }}>
      <InputLabel id="multiple-checkbox-label">Share the file with ...</InputLabel>
      <Select
  labelId="multiple-checkbox-label"
  multiple
  value={selecUsersToShare}
  onChange={handleChange}
  renderValue={(selected) => selected.join(', ')}
>
  {allUsers
    .filter((option) => option.u_email !== user) // Filter out user who logged in
    .map((option) => (
      <MenuItem key={option._id} value={option.u_email}>
        <Checkbox checked={selecUsersToShare.indexOf(option.u_email) > -1} />
        <ListItemText primary={option.u_email} />
      </MenuItem>
    ))}
</Select>
    </FormControl>
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
            Create New File <NoteAddIcon style={{minWidth: '40px'}} fontSize="small" />
          </Button>
          <Button
            style={{
              marginTop: "1.1%",
              textTransform: "none",
              borderLeft: "1px solid black",
            }}
            onClick={getEditorValue}
          >
            Show In Console <FactCheckIcon style={{minWidth: '40px'}} fontSize="small" />
          </Button>
          
    

          <Button
            style={{
              marginTop: "1.1%",
              textTransform: "none",
              borderLeft: "1px solid black",
            }}
            onClick={logOut}
          >
            Log Out   <LogoutIcon style={{minWidth: '40px'}} fontSize="small" />
          </Button>

          <TextField id="filled-basic" value={user}  InputProps={{
          readOnly: true, 
        }} label="Logged in as: " variant="filled" focused />
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
          data-testid="valueInsideEditor"
        >
 <CKEditor
  editor={ClassicEditor}
  data={editorValue || ""}
  onChange={(event, editor) => {
    const data = editor.getData();
    if (!isFromSocket.current) {
      setEditorValue(data);
      sendMessage(data); 
    }
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
            <h3 data-testid="ListOfFiles">Existing files</h3>
          </div>

          <Paper
            style={{
              maxHeight: "54.8vh",
              overflow: "auto",
              textAlign: "center",
            }}
          >
      <List>
  {Array.isArray(api) ? (
    api
      .filter((DBvalue) => DBvalue.owner === user|| (DBvalue.allowed_users && DBvalue.allowed_users.includes(user)))
      .map((DBvalue) => (
        <div
          key={DBvalue._id} // Make sure to add a unique key prop
          style={{
            marginTop: "3px",
          }}
        >
          <Button
            style={{ textTransform: "none" }}
            onClick={() => {
              setEditorValue(DBvalue.value); 
              setCheckOwnerDelete(DBvalue.owner)
              setFileName(DBvalue.name);    
              setIdOfDoc(DBvalue._id);       
              setRoom(DBvalue._id);          
              join_Room(DBvalue._id);       
              setAlertMessage("");           
            }}
          >
            {user ? DBvalue.name : "Please log in again!"} 
          </Button>
          <Divider variant="middle" />
        </div>
      ))
  ) : (
    "There is no saved file to show"
  )}
</List>
          </Paper>
        </div>
      </div>
    </div>
  );
}

export default Editor;