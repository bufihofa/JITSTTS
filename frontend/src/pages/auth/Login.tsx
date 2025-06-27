import { useEffect, useRef, useState } from "react";
import './Auth.css';
import { login, register } from "../../api/auth";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [activeTab, setActiveTab] = useState<boolean>(true); // 
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [shakeForm, setShakeForm] = useState<boolean>(false);
  const formRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (errorMessage) {
      setShakeForm(true);
      const timer = setTimeout(() => {
        setShakeForm(false);
      }, 600); // Match animation duration
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);
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
  const handleSubmit = async () => {
    setErrorMessage('');
    if (!username || !password || (!activeTab && !email)) {
        setErrorMessage("Vui lòng điền đầy đủ thông tin.");
        return;
    }
    setLoading(true);
    if (activeTab) {
        try {
            const response = await login(username, password);
            console.log(response.status);
            if (response.status === 200) {
                navigate('/home'); 
            } else {
                setErrorMessage(response || "Đăng nhập thất bại");
            }
        } catch (error: any) {
            setErrorMessage(error.message || "Đăng nhập thất bại");
        } 
    }
    else {
        try {
            const response = await register(username, email, password);
            console.log(response.status);
            if (response.status === 200) {
                navigate('/home'); 
            } else {
                setErrorMessage(response || "Đăng ký thất bại");
            }
        } catch (error: any) {
            setErrorMessage(error.message || "Đăng ký thất bại");
        }
    }
    setLoading(false);
    
  }
  const loginForm = () => {
    return (
        <form className="login-form ">
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
            {!activeTab && (
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
            )}
        </form>
    );
  }
  
  return (
    <div className="login-page">
        <div 
          className={`login-container ${shakeForm ? 'shake-animation' : ''}`}
          ref={formRef}
        >
            <div className="login-header">
                <div className="logo">
                    <img src="/bh_logo.png" alt="Logo" />
                </div>
                
                <div className="logo-subtext">Inventory Management</div>
            </div>
            {selectTab()}
            
            {loginForm()}
            <p className={errorMessage ? "error-message" : "loading-message"}>
                {errorMessage || `${loading ? "Đang xử lý..." : "---"}`} 
            </p>
            <button className="submit-btn" onClick={handleSubmit}>{activeTab? `Đăng nhập`:`Đăng ký`}</button>
        </div>
    </div>
  );
}
export default LoginPage;