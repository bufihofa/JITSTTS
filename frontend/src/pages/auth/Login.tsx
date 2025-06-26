import { useState } from "react";
import './Auth.css';
import { register } from "../../api/auth";

const LoginPage = () => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [activeTab, setActiveTab] = useState<boolean>(true); // 

  const selectTab = () => {
    return (
      <div className="tab-container">
        <button 
          className={`select-login ${activeTab ? 'active-tab' : ''}`}
          onClick={() => setActiveTab(true)}
        >
          Đăng nhập</button>
        <button 
          className={`select-register ${!activeTab ? 'active-tab' : ''}`}
          onClick={() => setActiveTab(false)}
        >
          Đăng ký</button>
        <div 
          className="tab-indicator" 
          style={{ transform: activeTab ? 'translateX(0)' : 'translateX(100%)' }}
        ></div>
      </div>
    );
  }
  const loginForm = () => {
    return (
        <form className="login-form">
            <div className="login-input">
                <label className="form-label">Username</label>
                <br />
                <input 
                    className="form-input"
                    type="text" 
                    value={username} 
                    placeholder="Enter your username"
                    onChange={(e) => setUsername(e.target.value)} 
                />
            </div>
            <div className="login-input">
                <label className="form-label">Password</label>
                <br />
                <input 
                    className="form-input"
                    type="password" 
                    value={password} 
                    placeholder="Enter your password"
                    onChange={(e) => setPassword(e.target.value)} 
                />
            </div>
        </form>
    );
  }
  const registerForm = () => {
    return (
        <form className="login-form">
            <div className="login-input">
                <label className="form-label">Username</label>
                <br />
                <input 
                    className="form-input"
                    type="text" 
                    value={username} 
                    placeholder="Enter your username"
                    onChange={(e) => setUsername(e.target.value)} 
                />
            </div>
            <div className="login-input">
                <label className="form-label">Password</label>
                <br />
                <input 
                    className="form-input"
                    type="password" 
                    value={password} 
                    placeholder="Enter your password"
                    onChange={(e) => setPassword(e.target.value)} 
                />
            </div>
            <div className="login-input">
                <label className="form-label">Email</label>
                <br />
                <input 
                    className="form-input"
                    type="email" 
                    value={email} 
                    placeholder="Enter your email"
                    onChange={(e) => setEmail(e.target.value)} 
                />
            </div>
            
        </form>
    );
  }
  return (
    <div className="login-page">
        <div className="login-container" >
            <div className="login-header">
                <div className="logo">
                    <img src="/bh_logo.png" alt="Logo" />
                </div>
                
                <div className="logo-subtext">Inventory Management</div>
            </div>
            {selectTab()}
            
            {activeTab? loginForm() : registerForm()}

            <button className="submit-btn" type="submit">{activeTab? `Đăng nhập`:`Đăng ký`}</button>
        </div>
    </div>
  );
}
export default LoginPage;