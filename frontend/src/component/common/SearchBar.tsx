import './SearchBar.css'
import { IoSearch } from "react-icons/io5";

interface SearchBarProps {
    value: string;
    onUpdateSearch: (query: string) => void;
}
const SearchBar: React.FC<SearchBarProps> = ({value, onUpdateSearch}) => {
  return (
    <div className="search-bar">
      <div className="search-icon">
        <IoSearch className="search-icon-svg" />
      </div>
      <div className="search-input-container">
        <input 
            type="text" 
            className="search-input"  
            placeholder="Search..." 
            value={value}
            onChange={(e) => onUpdateSearch(e.target.value)}
        />
      </div>
      
    </div>
  );
}
export default SearchBar;