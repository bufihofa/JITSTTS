// frontend/src/App.jsx
import './App.css';
import Header from './component/header/header';
import ProductList from './component/product/ProductList';
import Sidebar from './component/sidebar/Sidebar';


function App() {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <main className="content-area">
          <ProductList />
        </main>
      </div>
    </div>
  );
}

export default App;