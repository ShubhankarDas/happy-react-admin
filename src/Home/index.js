import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore/lite";
import { database as db } from "../config/firebase";
import { useNavigate } from "react-router-dom";

import Header from "../Header";

import "./Home.css";

const Home = () => {
  const quotesV2CollectionRef = collection(db, "quotesV2");
  const [quotes, setQuotes] = useState([]);
  const [filteredQuotes, setFilteredQuotes] = useState([]);
  const [filterOption, setFilterOption] = useState("all");
  const navigate = useNavigate();

  const onCardClick = (messageId) => {
    navigate(`/message/${messageId}`, {
      state: quotes.filter((q) => q.key === messageId)[0],
    });
  };

  const onAddButtonClick = () => {
    navigate(`/message/new`);
  };

  useEffect(() => {
    const getAllQuotes = async () => {
      const allQuotes = await getDocs(quotesV2CollectionRef);
      const qs = [];
      allQuotes.forEach((q) => {
        qs.push({ key: q.id, ...q.data() });
      });
      console.log(qs);
      setQuotes(qs);
    };

    getAllQuotes();

    // setQuotes(dummy);
  }, []);

  useEffect(() => {
    if (filterOption === "all") {
      setFilteredQuotes(quotes);
    } else {
      setFilteredQuotes(quotes.filter((q) => q.status === filterOption));
    }
  }, [quotes, filterOption]);

  return (
    <div className="home light-mode">
      <Header primaryText="New" onPrimaryClick={onAddButtonClick} />
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
    </div>
  );
};

export default Home;
