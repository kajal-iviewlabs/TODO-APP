import React, { useEffect, useState } from "react";
import "./todo.css";

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
    } else {
      const allInputData = {
        id: Date.now().toString(),
        name: inputData,
      };
      setItems([...items, allInputData]);
      setInputData("");
    }
  };

  const deleteItem = (id) => {
    const updatedItems = items.filter((element) => element.id !== id);
    setItems(updatedItems);
  };

  const removeAll = () => {
    setItems([]);
  };

  const editItem = (id) => {
    let newEditItem = items.find((element) => {
      return element.id === id;
    });
    setToggleSubmit(false);
    setInputData(newEditItem.name);
    setIsEditItem(id);
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
                <img
                  src="data:image/jpeg;base64,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"
                  alt="No items available"
                />
              </div>
            ) : (
              <div className="showItems">
                {items.map((element) => (
                  <div className="eachItem" key={element.id}>
                    <h3>{element.name}</h3>
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
              </div>
            )}
          </div>
          <div className="showItems">
            <button
              className="btn effect04"
              data-sm-link-text="Remove All"
              onClick={removeAll}
            >
              <span>Clear All</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Todo;
