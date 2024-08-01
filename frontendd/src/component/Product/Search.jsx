import React, { useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";  // Updated for React Router v6
import MetaData from "../layout/MetaData";
import "./Search.css";

const Search = () => {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();  // Updated for React Router v6

  const searchSubmitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/products/${keyword}`);  // Updated for React Router v6
    } else {
      navigate("/products");  // Updated for React Router v6
    }
  };

  return (
    <Fragment>
      <MetaData title="Search A Product -- ECOMMERCE" />
      <form className="searchBox" onSubmit={searchSubmitHandler}>
        <input
          type="text"
          placeholder="Search a Product ..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <input type="submit" value="Search" />
      </form>
    </Fragment>
  );
};

export default Search;
