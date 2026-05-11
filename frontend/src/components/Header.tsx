import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Header.css";

export default function Header() {
  const token = localStorage.getItem("accessToken");
  const userName = localStorage.getItem("userName");
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  const scrollToSearch = () => {
    const target = document.querySelector("#search-bar");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  if (isAuthPage) {
    return null;
  }

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/posts" className="header-logo">
          <span className="logo-icon">D</span>
          <span className="logo-text">DevBoard</span>
        </Link>

        <nav className="header-nav">
          <Link to="/posts" className={`nav-link ${location.pathname === "/posts" ? "active" : ""}`}>
            게시글
          </Link>
          <a href="#about" className="nav-link">
            소개
          </a>
        </nav>

        <div className="header-actions">
          <button type="button" onClick={scrollToSearch} className="search-trigger" aria-label="검색">
            🔍
          </button>
          {token ? (
            <>
              <div className="user-info">
                <span className="user-name">{userName}</span>
              </div>
              <button onClick={handleLogout} className="logout-btn">
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="login-btn">
                로그인
              </Link>
              <Link to="/signup" className="signup-btn">
                회원가입
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
