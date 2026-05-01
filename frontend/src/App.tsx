import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import PostListPage from "./pages/PostListPage";
import PostDetailPage from "./pages/PostDetailPage";
import PostCreatePage from "./pages/PostCreatePage";
import PostEditPage from "./pages/PostEditPage";
import MyPage from "./pages/MyPage";
import PrivateRoute from "./components/PrivateRoute";
import Header from "./components/Header";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/posts" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        
        <Route path="/posts" element={<PostListPage />} />
        <Route path="/posts/:id" element={<PostDetailPage />} />
        
        <Route path="/posts/new" element={
          <PrivateRoute>
            <PostCreatePage />
          </PrivateRoute>
        } />
        
        <Route path="/posts/:id/edit" element={
          <PrivateRoute>
            <PostEditPage />
          </PrivateRoute>
        } />
        
        <Route path="/me" element={
          <PrivateRoute>
            <MyPage />
          </PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;