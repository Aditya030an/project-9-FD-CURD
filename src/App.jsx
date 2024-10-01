import { useState, useEffect } from "react";
import "./App.css";
import toast, { Toaster } from 'react-hot-toast';

function App() {
  const [task, setTask] = useState("");
  const [taskList, setTaskList] = useState([]);
  const [updateId, setUpdateId] = useState(null);
  const [showUpdateButton, setShowUpdateButton] = useState(false);
  const API_URI = import.meta.env.VITE_APP_API_URI || "http://localhost:8080";
  const endPointOfTask = `${API_URI}/api/v1/task/tasks`;

  // Function to add a task
  const handleAddTask = async () => {
    try {
      let result = await fetch(endPointOfTask, {
        method: "POST",
        body: JSON.stringify({ task }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      result = await result.json();
      result.success ? toast.success(result.message , {style:{backgroundColor:"green", color:"white" , fontSize:22} , duration:3000} ) : toast.error(result.message , {style:{backgroundColor:"red", color:"white" , fontSize:22} , duration:3000});
      if (result.success) {
        // Successfully added task
        handleGetTask(); // Refresh task list after adding
        setTask("");
        toast.success(message=result.message)
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.log("Error in add Task", error);
    }
  };

  // Function to update a task
  const handleUpdateTask = async (id) => {
    console.log("update task id" , id)
    console.log("update task text" , task)
    try {
      let result = await fetch(`${endPointOfTask}/${id}`, {
        method: "PUT",
        body:JSON.stringify({task}),
        headers: {
          "Content-Type": "application/json",
        },
      });
      result = await result.json();
      console.log("result " , result);
      result.success ? toast.success(result.message , {style:{backgroundColor:"green", color:"white" , fontSize:22} , duration:3000} ) : toast.error(result.message , {style:{backgroundColor:"red", color:"white" , fontSize:22} , duration:3000});
      if (result.success) {
        console.log("result success" , result.success);
        handleGetTask(); // Refresh task list after updating
        setShowUpdateButton(false);
        setTask("");
      }
    } catch (error) {
      console.log("Error in Update Task", error);
    }
  };

  // Function to delete a task
  const handleDeleteTask = async (id) => {
    try {
      let result = await fetch(`${endPointOfTask}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      result = await result.json();
      console.log("result " , result);
      result.success ? toast.success(result.message , {style:{backgroundColor:"green", color:"white" , fontSize:22} , duration:3000} ) : toast.error(result.message , {style:{backgroundColor:"red", color:"white" , fontSize:22} , duration:3000});
      if (result.success) {
        console.log("result success" , result.success);
        handleGetTask(); // Refresh task list after deleting
      }
    } catch (error) {
      console.log("Error in Delete Task", error);
    }
  };

  // Function to get tasks
  const handleGetTask = async () => {
    try {
      let result = await fetch(endPointOfTask, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      result = await result.json();
      console.log("result get task" , result);
      if (result.success) {
        setTaskList(result.list);
      }
      else{
        setTaskList([]);
      }
    } catch (error) {
      console.log("Error in Get Task", error);
    }
  };

  // Fetch tasks on component mount
  useEffect(() => {
    handleGetTask();
  }, []);

  return (
    <div className="w-screen h-screen bg-white p-2 md:px-20  flex flex-col items-center gap-7">
      <div className="flex flex-col gap-7 w-full">
        <div className="flex items-center justify-between p-2 w-full">
          <h1 className="text-3xl md:text-5xl xl:text-7xl  font-bold text-black">
            All <span className="text-emerald-500">Tasks</span>
          </h1>
          {
            showUpdateButton ? 
          <button
            className="md:text-xl font-medium p-2 rounded-md bg-gray-900 hover:bg-gray-800 text-white outline-none border-none"
            onClick={()=>{handleUpdateTask(updateId)}}
          >
            Update Task
          </button> :
          <button
            className="md:text-xl font-medium p-2 rounded-md bg-gray-900 hover:bg-gray-800 text-white outline-none border-none"
            onClick={handleAddTask}
          >
            Add Task
          </button>
          }
        </div>
        <div className="w-full">
          <input
            type="text"
            placeholder="Enter Task"
            value={task}
            onChange={(e) => {
              setTask(e.target.value);
            }}
            className="w-full outline-none border-2 border-gray-600 rounded-md p-2 text-xl font-semibold"
          />
        </div>
      </div>
      <div className="w-full px-4 flex flex-col gap-3">
        {/* Mapping all tasks */}
        {taskList.length > 0 ? (
          taskList.map((item, index) => (
            <div
              key={index}
              className="flex flex-col gap-4 p-2 border-2 border-gray-300 rounded-md shadow-md shadow-gray-400 bg-white"
            >
              <p className="text-xl font-semibold text-gray-600">{item.task}</p>
              <div className="w-full flex items-center justify-end gap-4 md:gap-7">
                <button
                  className="md:text-xl font-medium p-2 rounded-md bg-gray-900 hover:bg-gray-800 text-white"
                  onClick={() => {
                    setTask(item.task);
                    setUpdateId(item._id);
                    setShowUpdateButton(true);
                  }}
                >
                  Edit Task
                </button>
                <button
                  className="md:text-xl font-medium p-2 rounded-md bg-gray-900 hover:bg-gray-800 text-white"
                  onClick={() => handleDeleteTask(item._id)}
                >
                  Delete Task
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className=" p-2 bg-gray-900 text-gray-600 text-3xl font-semibold text-center rounded-md">
            No Tasks Added Yet
          </div>
        )}
      </div>
      <Toaster/>
    </div>
  );
}

export default App;
