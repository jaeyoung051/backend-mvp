import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "../api/axios";
import "./PostDetailPage.css";

interface Post {
  id: number;
  title: string;
  content: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const currentUserId = Number(localStorage.getItem("userId")) || 0;

  const fetchPost = async () => {
    try {
      setLoading(true);
      const res = await api.get<Post>(`/api/posts/${id}`);
      setPost(res.data);
      setError(null);
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

  useEffect(() => {
    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
      return;
    }

    try {
      setIsDeleting(true);
      await api.delete(`/api/posts/${id}`);
      alert("게시글이 삭제되었습니다.");
      navigate("/posts");
    } catch (err: unknown) {
      console.error(err);
      const axiosErr = err as { response?: { status: number } };
      if (axiosErr.response?.status === 403) {
        alert("삭제 권한이 없습니다.");
      } else {
        alert("게시글 삭제에 실패했습니다.");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="detail-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="detail-container">
        <div className="error-state">
          <p>{error || "게시글을 찾을 수 없습니다."}</p>
          <Link to="/posts" className="back-link">
            목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  const isAuthor = post.userId === currentUserId;

  return (
    <div className="detail-container">
      <div className="detail-card">
        <div className="detail-header">
          <Link to="/posts" className="back-link">
            ← 목록으로
          </Link>
        </div>

        <div className="detail-meta">
          <span className="detail-id">No. {post.id}</span>
          <span className="detail-date">{formatDate(post.createdAt)}</span>
        </div>

        <h1 className="detail-title">{post.title}</h1>

        <div className="detail-author">
          작성자: <span>{post.userId}</span>
        </div>

        <div className="detail-content">{post.content}</div>

        {isAuthor && (
          <div className="detail-actions">
            <Link to={`/posts/${id}/edit`} className="edit-btn">
              수정
            </Link>
            <button
              onClick={handleDelete}
              className="delete-btn"
              disabled={isDeleting}
            >
              {isDeleting ? "삭제 중..." : "삭제"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}