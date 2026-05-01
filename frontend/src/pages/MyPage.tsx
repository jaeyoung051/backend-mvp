import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/axios";
import "./MyPage.css";

interface MyPost {
  id: number;
  title: string;
  createdAt: string;
}

interface MyInfo {
  email: string;
  name: string;
  posts: MyPost[];
}

export default function MyPage() {
  const [myInfo, setMyInfo] = useState<MyInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyInfo = async () => {
      try {
        const res = await api.get<MyInfo>("/api/me");
        setMyInfo(res.data);
      } catch (err: unknown) {
        console.error(err);
        setError("정보를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyInfo();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="my-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error || !myInfo) {
    return (
      <div className="my-container">
        <div className="error-state">
          <p>{error || "정보를 불러올 수 없습니다."}</p>
          <Link to="/posts" className="back-link">
            목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="my-container">
      <div className="my-card">
        <div className="my-header">
          <h1>마이페이지</h1>
        </div>

        <div className="my-info-section">
          <div className="info-item">
            <span className="info-label">이름</span>
            <span className="info-value">{myInfo.name}</span>
          </div>
          <div className="info-item">
            <span className="info-label">이메일</span>
            <span className="info-value">{myInfo.email}</span>
          </div>
        </div>

        <div className="my-posts-section">
          <h2>내가 작성한 글</h2>
          
          {myInfo.posts.length === 0 ? (
            <div className="empty-posts">
              <p>작성한 게시글이 없습니다.</p>
              <Link to="/posts/new" className="create-link">
                첫 번째 글 작성하기
              </Link>
            </div>
          ) : (
            <div className="my-post-list">
              {myInfo.posts.map((post) => (
                <Link
                  key={post.id}
                  to={`/posts/${post.id}`}
                  className="my-post-item"
                >
                  <span className="my-post-id">No. {post.id}</span>
                  <span className="my-post-title">{post.title}</span>
                  <span className="my-post-date">{formatDate(post.createdAt)}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}