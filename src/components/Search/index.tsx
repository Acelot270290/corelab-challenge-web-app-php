import React from 'react';
import './Search.css';
import { FaSearch } from 'react-icons/fa';

interface ISearch {
  placeholder: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Search = ({ placeholder, value, onChange }: ISearch) => {
  return (
    <div className="search-container">
      <input 
        type="text" 
        placeholder={placeholder} 
        value={value} 
        onChange={onChange} 
        className="search-input"
      />
      <FaSearch className="search-icon" />
    </div>
  );
};
export default Search;
