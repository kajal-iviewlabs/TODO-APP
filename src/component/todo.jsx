import React, { useEffect, useState, useRef } from "react";
import "./todo.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// to get the data from local storage
const getData = () => {
  let list = localStorage.getItem("lists");

  if (list) {
    return JSON.parse(localStorage.getItem("lists"));
  } else {
    return [];
  }
};

const Todo = () => {
  const [inputData, setInputData] = useState("");
  const [items, setItems] = useState(getData());
  const [toggleSubmit, setToggleSubmit] = useState(true);
  const [isEditItem, setIsEditItem] = useState(null);
  const [error, setError] = useState(""); // State to track error message
  const containerRef = useRef(null); // Ref for the container element
  const notify = () => toast.success("new list added!");
  const deleteToast = () => toast.error("list deleted");
  const editToast = () => toast.info("list updated!");
  const RemoveAllToast = () => toast("all list removed!");

  useEffect(() => {
    containerRef.current?.scrollIntoView();
  }, [items]);

  const addItem = () => {
    if (!inputData.trim()) {
      setError("Please enter an item."); // Set error message
      // Clear error message after 5 seconds
      setTimeout(() => {
        setError("");
      }, 2000);
      return;
    } else {
      setError(""); // Clear error message
    }

    if (inputData && !toggleSubmit) {
      setItems(
        items.map((elm) => {
          if (elm.id === isEditItem) {
            return { ...elm, name: inputData };
          }
          return elm;
        })
      );
      setToggleSubmit(true);
      setInputData("");
      setIsEditItem(null);
      editToast();
    } else {
      const allInputData = {
        id: Date.now().toString(),
        name: inputData,
      };
      setItems([...items, allInputData]);
      setInputData("");
      notify();
    }
  };

  const deleteItem = (id) => {
    const updatedItems = items.filter((element) => element.id !== id);
    setItems(updatedItems);
    deleteToast();
  };

  const removeAll = () => {
    setItems([]);
    RemoveAllToast();
  };

  const editItem = (id) => {
    let newEditItem = items.find((element) => {
      return element.id === id;
    });
    setToggleSubmit(false);
    setInputData(newEditItem.name);
    setIsEditItem(id);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addItem();
    }
  };

  useEffect(() => {
    localStorage.setItem("lists", JSON.stringify(items));
  }, [items]);

  return (
    <>
      <div className="main-div">
        <div className="child-div">
          <figure>
            <img
              src="https://cdn2.iconfinder.com/data/icons/xomo-basics/128/document-03-512.png"
              className="todo-icon"
              alt="todo icon"
            />
            <figcaption>Add your list here</figcaption>
          </figure>
          <div className="addItems">
            <input
              type="text"
              placeholder="Add Items..."
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            {toggleSubmit ? (
              <i
                className="fas fa-plus add-btn"
                title="Add Item"
                onClick={addItem}
              ></i>
            ) : (
              <i
                className="fas fa-edit add-btn"
                title="Update Item"
                onClick={addItem}
              ></i>
            )}
          </div>
          {error && <p className="error-msg">{error}</p>}
          <div className="showItemsContainer">
            {items.length === 0 ? (
              <div className="no-items-msg-container">
                <p className="no-items-msg ">No items available</p>
                {/* <div></div> */}
              </div>
            ) : (
              <div className="showItems">
                {items.map((element) => (
                  <div className="eachItem" key={element.id}>
                    <h3 style={{ wordWrap: "break-word" }}>{element.name}</h3>
                    <div className="todo-btn">
                      <i
                        className="far fa-edit add-btn"
                        title="Edit Item"
                        onClick={() => editItem(element.id)}
                      ></i>
                      <i
                        className="far fa-trash-alt add-btn"
                        title="Delete Item"
                        onClick={() => deleteItem(element.id)}
                      ></i>
                    </div>
                  </div>
                ))}
                <div ref={containerRef} />
              </div>
            )}
          </div>
          <div className="showItems1">
            <button className="btn" onClick={removeAll}>
              <span>Clear All</span>
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Todo;
