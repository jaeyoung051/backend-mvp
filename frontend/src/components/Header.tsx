import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Header.css";

export default function Header() {
  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  if (isAuthPage) {
    return null;
  }

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/posts" className="header-logo">
          Board
        </Link>

        <nav className="header-nav">
          <Link to="/posts" className="nav-link">
            게시글
          </Link>
          {token && (
            <>
              <Link to="/posts/new" className="nav-link">
                글 작성
              </Link>
              <Link to="/me" className="nav-link">
                마이페이지
              </Link>
            </>
          )}
        </nav>

        <div className="header-actions">
          {token ? (
            <button onClick={handleLogout} className="logout-btn">
              로그아웃
            </button>
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