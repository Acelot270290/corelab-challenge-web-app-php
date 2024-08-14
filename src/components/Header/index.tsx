import React from 'react';
import Search from '../Search';
import './Header.css';

interface HeaderProps {
  searchValue: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

const Header: React.FC<HeaderProps> = ({ searchValue, onSearchChange, onSearchSubmit }) => {
  return (
    <header className="header">
      <div className="logo-container">
        <h1>Corellab - Tarefas</h1>
      </div>
      <form onSubmit={onSearchSubmit}>
        <Search 
          placeholder="Pesquisar notas" 
          value={searchValue} 
          onChange={onSearchChange} 
        />
      </form>
    </header>
  );
};

export default Header;
