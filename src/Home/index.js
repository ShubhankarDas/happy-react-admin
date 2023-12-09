import { useContext, useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore/lite";
import { database as db } from "../config/firebase";
import { useNavigate } from "react-router-dom";

import Header from "../Header";

import "./Home.css";
import Loader from "../components/Loader";
import { getAuth, signOut } from "firebase/auth";
import { ToastContext } from "../context/toastContext";

const Home = () => {
  const quotesV2CollectionRef = query(
    collection(db, "quotesV2"),
    orderBy("updatedAt", "desc")
  );
  const [loading, setLoading] = useState(false);
  const [quotes, setQuotes] = useState([]);
  const [filteredQuotes, setFilteredQuotes] = useState([]);
  const [filterOption, setFilterOption] = useState("all");
  const navigate = useNavigate();
  const toastContext = useContext(ToastContext);

  const onCardClick = (messageId) => {
    navigate(`/message/${messageId}`, {
      state: quotes.filter((q) => q.key === messageId)[0],
    });
  };

  const onAddButtonClick = () => {
    navigate(`/message/new`);
  };

  const onLogoutClick = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        navigate(`/`);
        toastContext.success("Goodbye");
      })
      .catch((error) => {
        toastContext.error("Error Occurred");
        console.log("[Error] " + error.message);
      });
  };

  useEffect(() => {
    setLoading(true);
    const getAllQuotes = async () => {
      const allQuotes = await getDocs(quotesV2CollectionRef);
      const qs = [];
      allQuotes.forEach(async (q) => {
        qs.push({ key: q.id, ...q.data() });
      });
      setLoading(false);
      setQuotes(qs);
    };

    getAllQuotes();
  }, [quotesV2CollectionRef]);

  useEffect(() => {
    if (filterOption === "all") {
      setFilteredQuotes(quotes);
    } else {
      setFilteredQuotes(quotes.filter((q) => q.status === filterOption));
    }
  }, [quotes, filterOption]);

  return (
    <div className="home light-mode">
      <Header
        primaryText="New"
        onPrimaryClick={onAddButtonClick}
        secondaryText="Logout"
        onSecondaryClick={onLogoutClick}
      />
      <div className="container link-container">
        <a
          href="https://undraw.co/illustrations"
          rel="noreferrer noopener"
          target="_blank"
        >
          Link 1
        </a>
        <a
          href="https://delesign.com/free-designs/graphics/illustration"
          rel="noreferrer noopener"
          target="_blank"
        >
          Link 2
        </a>
      </div>
      <div className="container filter-container">
        <div
          className={`filter filter-all ${
            filterOption === "all" ? "selected" : ""
          }`}
          onClick={() => setFilterOption("all")}
        >
          all
        </div>
        <div
          className={`filter filter-active ${
            filterOption === "active" ? "selected" : ""
          }`}
          onClick={() => setFilterOption("active")}
        >
          active
        </div>
        <div
          className={`filter filter-inactive ${
            filterOption === "inactive" ? "selected" : ""
          }`}
          onClick={() => setFilterOption("inactive")}
        >
          inactive
        </div>
      </div>
      <div className="container card-container">
        {filteredQuotes.map((quoteData) => (
          <div
            className={`card ${
              quoteData.status === "active" ? "active" : "inactive"
            }`}
            key={quoteData.key}
            onClick={(e) => onCardClick(quoteData.key)}
          >
            <img
              loading="lazy"
              alt={quoteData.imageUrl}
              className="card-image"
              src={quoteData.imageUrl}
            />
            <p className="card-message">{quoteData.message}</p>
          </div>
        ))}
      </div>
      {loading && <Loader />}
    </div>
  );
};

export default Home;
