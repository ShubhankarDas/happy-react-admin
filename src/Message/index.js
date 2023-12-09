import { useState, useRef, useEffect, useContext } from "react";
import { storage } from "../config/firebase";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  updateMetadata,
} from "firebase/storage";
import { v4 } from "uuid";
import { database as db } from "../config/firebase";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore/lite";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import Header from "../Header";

import PlusIcon from "../images/PlusIcon";
import SunIcon from "../images/SunIcon";
import DeleteIcon from "../images/DeleteIcon";
import RadioIcon from "../images/RadioIcon";

import "./Message.css";
import { ToastContext } from "../context/toastContext";

const Message = () => {
  const { messageId } = useParams();
  const { state: selectedQuote } = useLocation();
  const navigate = useNavigate();
  const toastContext = useContext(ToastContext);

  const [isLoading, setIsLoading] = useState(false);
  const [showEditOptions, setShowEditOptions] = useState(false);

  const [imageUpload, setImageUpload] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [message, setMessage] = useState("");

  const [darkTheme, setDarkTheme] = useState(false);
  const [isActive, setIsActive] = useState(true);

  const metadata = {
    cacheControl: "public,max-age=86400",
    contentType: "image/svg+xml",
  };

  const inputRef = useRef(null);

  const onAddImageClick = () => {
    inputRef.current.click();
  };

  const getNewFileName = (imageName) =>
    `${imageName.split(".").slice(0, -1).join("")}_${v4()}.${imageName
      .split(".")
      .slice(-1)
      .join("")}`;

  const uploadImage = async () => {
    const imageRef = ref(storage, `images/${getNewFileName(imageUpload.name)}`);

    await uploadBytes(imageRef, imageUpload);
    await updateMetadata(imageRef, metadata);
    return await getDownloadURL(imageRef);
  };

  const saveMessage = async () => {
    if (imageUpload == null || message.trim() === "") return;
    setIsLoading(true);
    try {
      const url = await uploadImage();

      await addDoc(collection(db, "quotesV2"), {
        message,
        imageUrl: url,
        status: "inactive",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      toastContext.success("Saved!");
    } catch (error) {
      if (error.code === "permission-denied") {
        console.log(error.message);
        toastContext.error("Access Denied");
      } else {
        console.log(error);
        toastContext.error("Error Occurred");
      }
    }
    navigate("/messages");
  };

  const onDeleteClick = async () => {
    setIsLoading(true);
    try {
      const currentQuoteRef = doc(db, "quotesV2", selectedQuote.key);

      await updateDoc(currentQuoteRef, {
        deleted: true,
        updatedAt: serverTimestamp(),
      });
      toastContext.success("Deleted!");
      navigate("/messages");
    } catch (error) {
      if (error.code === "permission-denied") {
        console.log(error.message);
        toastContext.error("Access Denied");
      } else {
        console.log(error);
        toastContext.error("Error Occurred");
      }
    }
  };

  const onSetActiveClick = async (status) => {
    setIsLoading(true);
    try {
      const currentQuoteRef = doc(db, "quotesV2", selectedQuote.key);

      await updateDoc(currentQuoteRef, {
        status: status ? "active" : "inactive",
        updatedAt: serverTimestamp(),
      });
      setIsActive(status);
      toastContext.success("Updated!");
    } catch (error) {
      if (error.code === "permission-denied") {
        console.log(error.message);
        toastContext.error("Access Denied");
      } else {
        console.log(error.message);
        toastContext.error("Error Occurred");
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (messageId) {
      if (selectedQuote && selectedQuote.key === messageId) {
        setMessage(selectedQuote.message);
        setImageUpload(selectedQuote.imageUrl);
        setImageUrl(selectedQuote.imageUrl);
        setIsActive(selectedQuote.status === "active");
        setShowEditOptions(true);
      } else {
        navigate("/message/new");
      }
    }
  }, []);

  return (
    <div className={`message ${darkTheme ? "dark-mode" : "light-mode"}`}>
      {isLoading && <div className="loading"></div>}
      <Header
        onPrimaryClick={saveMessage}
        primaryText={showEditOptions ? "Update" : "Save"}
        onSecondaryClick={() => navigate("/messages")}
        secondaryText={showEditOptions ? "Back" : "Cancel"}
      />
      <div className="content">
        <div className="options-container">
          <SunIcon
            onClick={() => {
              setDarkTheme(!darkTheme);
            }}
            height="30"
            width="30"
            className="options theme-control"
          />
          {showEditOptions && (
            <RadioIcon
              onClick={() => {
                onSetActiveClick(!isActive);
              }}
              height="25"
              width="25"
              className="options active-control"
              isActive={isActive}
            />
          )}
          {showEditOptions && (
            <DeleteIcon
              onClick={() => {
                onDeleteClick();
              }}
              height="25"
              width="25"
              className="options delete-control"
            />
          )}
        </div>
        {imageUpload ? (
          <img
            onClick={onAddImageClick}
            className="hero-image"
            src={imageUrl}
            alt=""
          />
        ) : (
          <PlusIcon
            onClick={onAddImageClick}
            fill="#00000020"
            height="150"
            width="150"
            className="plus-icon"
          />
        )}

        <input
          className="message-input"
          type="text"
          value={message}
          placeholder="Your happy quote :)"
          onChange={(e) =>
            e.target.value !== message ? setMessage(e.target.value) : null
          }
        />
        <input
          style={{ display: "none" }}
          type="file"
          ref={inputRef}
          accept=".svg"
          onChange={(e) => {
            if (e.target.files[0]) {
              setImageUpload(e.target.files[0]);
              setImageUrl(URL.createObjectURL(e.target.files[0]));
            }
          }}
        />
      </div>
    </div>
  );
};

export default Message;
