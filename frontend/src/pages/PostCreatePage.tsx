import { useState } from "react";
import { api } from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import "./PostCreatePage.css";

export default function PostCreatePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      await api.post("/api/posts", {
        title: title.trim(),
        content: content.trim(),
      });

      alert("게시글이 작성되었습니다.");
      navigate("/posts");
    } catch (err: unknown) {
      console.error(err);
      alert("게시글 작성에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="post-create-container">
      <header className="post-create-header">
        <Link to="/posts" className="back-button">
          ← 목록으로
        </Link>
        <h1>글 작성</h1>
      </header>

      <form onSubmit={handleCreate} className="post-create-form">
        <div className="form-group">
          <label htmlFor="title">제목</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            required
            maxLength={100}
          />
          <span className="char-count">{title.length}/100</span>
        </div>

        <div className="form-group">
          <label htmlFor="content">내용</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 입력하세요"
            required
            rows={12}
          />
        </div>

        <div className="form-actions">
          <Link to="/posts" className="cancel-button">
            취소
          </Link>
          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? "작성 중..." : "작성하기"}
          </button>
        </div>
      </form>
    </div>
  );
}