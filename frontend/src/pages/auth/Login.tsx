import { useEffect, useRef, useState } from "react";
import './Login.css';
import { login, register } from "../../api/auth";
import { useNavigate } from "react-router-dom";
import CMSInput from "../../component/common/Input";
import SelectTab from "../../component/common/SelectTab";
import { useGoogleAuth } from "../../hooks/useGoogleAuth";

const LoginPage = () => {
  const navigate = useNavigate();
  const googleLogin = useGoogleAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [activeTab, setActiveTab] = useState<boolean>(true); // 
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [shakeForm, setShakeForm] = useState<boolean>(false);

  const [savePassword, setSavePassword] = useState<boolean>(false);
  
  const formRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (errorMessage) {
      setShakeForm(true);
      const timer = setTimeout(() => {
        setShakeForm(false);
      }, 600); 
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const handleSubmit = async () => {
    setErrorMessage('');
    if (!username || !password || (!activeTab && !email)) {
        setErrorMessage("Vui lòng điền đầy đủ thông tin.");
        return;
    }
    setLoading(true);
    if (activeTab) {
        try {
            const response = await login(username, password, savePassword);
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
        <form className="login-form" key={activeTab ? 'login' : 'register'}>
            <CMSInput 
              label="Tên đăng nhập"
              value={username}
              onChange={setUsername}
            />
            <CMSInput 
              label="Mật khẩu"
              value={password}
              type="password"
              onChange={setPassword}
            />
            {!activeTab ? 
            (
                <CMSInput
                  label="Email"
                  type="email"
                  value={email}
                  onChange={setEmail}
                />
            )
            :
            (
              <>
                <div className="save-password">
                  <input 
                    type="checkbox" 
                    checked={savePassword} 
                    onChange={() => setSavePassword(!savePassword)} 
                  />
                  <label>Lưu mật khẩu</label>
                </div>
              </>
            )
          }
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
            <SelectTab
              leftTab="Đăng nhập"
              rightTab="Đăng ký"
              isLeft={activeTab}
              setLeft={setActiveTab}
            />
            
            {loginForm()}
            
            
            <button className="submit-btn" onClick={handleSubmit}>{activeTab? `Đăng nhập`:`Đăng ký`}</button>
            <p className={errorMessage ? "error-message" : "loading-message"}>
                {errorMessage || `${loading ? "Đang xử lý..." : "_________"}`} 
            </p>
            <button onClick={() => googleLogin()} className="google-button">
              Tiếp tục với Google
            </button>
        </div>
    </div>
  );
}
export default LoginPage;