import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "../api/axios";
import "./PostEditPage.css";

interface Post {
  id: number;
  title: string;
  content: string;
  userId: number;
}

export default function PostEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentUserId = Number(localStorage.getItem("userId")) || 0;

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get<Post>(`/api/posts/${id}`);
        const postData = res.data;

        if (postData.userId !== currentUserId) {
          setError("수정 권한이 없습니다.");
          setLoading(false);
          return;
        }

        setTitle(postData.title);
        setContent(postData.content);
      } catch (err: unknown) {
        console.error(err);
        const axiosErr = err as { response?: { status: number } };
        if (axiosErr.response?.status === 404) {
          setError("게시글을 찾을 수 없습니다.");
        } else {
          setError("게시글을 불러오는 중 오류가 발생했습니다.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, currentUserId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      await api.put(`/api/posts/${id}`, {
        title: title.trim(),
        content: content.trim(),
      });

      alert("게시글이 수정되었습니다.");
      navigate(`/posts/${id}`);
    } catch (err: unknown) {
      console.error(err);
      const axiosErr = err as { response?: { status: number } };
      if (axiosErr.response?.status === 403) {
        alert("수정 권한이 없습니다.");
      } else {
        alert("게시글 수정에 실패했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="edit-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="edit-container">
        <div className="error-state">
          <p>{error}</p>
          <Link to="/posts" className="back-link">
            목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-container">
      <form onSubmit={handleSubmit} className="edit-form">
        <div className="edit-header">
          <Link to={`/posts/${id}`} className="back-link">
            ← 상세로 돌아가기
          </Link>
          <h1>글 수정</h1>
        </div>

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
            rows={15}
          />
        </div>

        <div className="form-actions">
          <Link to={`/posts/${id}`} className="cancel-btn">
            취소
          </Link>
          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? "수정 중..." : "수정하기"}
          </button>
        </div>
      </form>
    </div>
  );
}