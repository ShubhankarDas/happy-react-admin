import { useState, useRef, useEffect } from "react";
import { storage } from "../config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
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

const Message = () => {
  const { messageId } = useParams();
  const { state: selectedQuote } = useLocation();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [showEditOptions, setShowEditOptions] = useState(false);

  const [imageUpload, setImageUpload] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [message, setMessage] = useState("");

  const [darkTheme, setDarkTheme] = useState(false);
  const [isActive, setIsActive] = useState(true);

  const inputRef = useRef(null);

  const onAddImageClick = () => {
    inputRef.current.click();
  };

  const uploadImage = async () => {
    const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);

    await uploadBytes(imageRef, imageUpload);
    return await getDownloadURL(imageRef);
  };

  const saveMessage = async () => {
    if (imageUpload == null || message.trim() === "") return;
    setIsLoading(true);
    const url = await uploadImage();

    await addDoc(collection(db, "quotesV2"), {
      message,
      imageUrl: url,
      status: "inactive",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    navigate("/messages");
  };

  const onDeleteClick = async () => {
    setIsLoading(true);
    const currentQuoteRef = doc(db, "quotesV2", selectedQuote.key);

    await updateDoc(currentQuoteRef, {
      deleted: true,
      updatedAt: serverTimestamp(),
    });
    navigate("/messages");
  };

  const onSetActiveClick = async (status) => {
    setIsLoading(true);
    const currentQuoteRef = doc(db, "quotesV2", selectedQuote.key);

    await updateDoc(currentQuoteRef, {
      status: status ? "active" : "inactive",
      updatedAt: serverTimestamp(),
    });
    setIsActive(status);
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
