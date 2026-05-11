import { useEffect, useState, type ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/axios";
import "./PostListPage.css";

interface PostItem {
  id: number;
  title: string;
  userId: number;
  createdAt: string;
  summary?: string;
  tags?: string[];
}

interface PostPageResponse {
  content: PostItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

type SearchType = "title" | "title_content";

export default function PostListPage() {
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageInfo, setPageInfo] = useState<PostPageResponse | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [searchType, setSearchType] = useState<SearchType>("title_content");

  const currentUserId = Number(localStorage.getItem("userId")) || 0;

  const fetchPosts = async (page: number = 0, searchKeyword: string = "", type: SearchType = searchType) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: "10",
      });

      if (searchKeyword.trim()) {
        params.append("keyword", searchKeyword.trim());
        params.append("searchType", type);
      }

      const res = await api.get<PostPageResponse>(`/api/posts?${params.toString()}`);
      setPosts(res.data.content);
      setPageInfo(res.data);
      setCurrentPage(page);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(0);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPosts(0, keyword, searchType);
  };

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  const handleSearchTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSearchType(e.target.value as SearchType);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="post-list-container">
      <section className="hero-section">
        <div className="hero-copy">
          <span className="hero-badge">개발자 커뮤니티 게시판</span>
          <h1>지식을 공유하고 함께 성장하는 공간</h1>
          <p>개발자들이 질문, 학습 기록, 문제 해결 경험을 자유롭게 나누는 게시판입니다.</p>
          <div className="hero-actions">
            <Link to="/posts/new" className="btn btn-primary">
              글 작성하기
            </Link>
            <a href="#about" className="btn btn-secondary">
              소개
            </a>
          </div>
        </div>
      </section>

      <div className="page-container">
        <div className="page-intro">
          <div>
            <span className="section-label">게시글</span>
            <h2>개발 기록과 질문을 한곳에서 확인하세요</h2>
            <p className="page-description">검색 기준을 선택하고 제목 또는 내용에서 원하는 글을 빠르게 찾아보세요.</p>
          </div>
          <Link to="/posts/new" className="btn btn-primary mini-action">
            글 작성하기
          </Link>
        </div>

        <div className="search-card" id="search-bar">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-group">
              <label htmlFor="searchType" className="search-label">
                검색 기준
              </label>
              <select
                id="searchType"
                value={searchType}
                onChange={handleSearchTypeChange}
                className="search-select"
              >
                <option value="title">제목</option>
                <option value="title_content">제목 + 내용</option>
              </select>
            </div>

            <div className="search-group input-group">
              <label htmlFor="keyword" className="search-label">
                검색어
              </label>
              <input
                id="keyword"
                type="text"
                value={keyword}
                onChange={handleKeywordChange}
                placeholder="검색어를 입력하세요"
                className="search-input"
              />
            </div>

            <button type="submit" className="search-button">
              검색
            </button>
          </form>
        </div>

        {loading ? (
          <div className="loading">불러오는 중...</div>
        ) : posts.length === 0 ? (
          <div className="empty-state">
            <p>게시글이 없습니다.</p>
            <Link to="/posts/new">첫 번째 게시글을 작성해보세요</Link>
          </div>
        ) : (
          <>
            <div className="post-list">
              {posts.map((post) => (
                <Link key={post.id} to={`/posts/${post.id}`} className="post-card">
                  <div className="post-card-header">
                    <span className="post-id">No. {post.id}</span>
                    <span className="post-date">{formatDate(post.createdAt)}</span>
                  </div>
                  <h3 className="post-title">{post.title}</h3>
                  {post.summary ? <p className="post-summary">{post.summary}</p> : null}
                  <div className="post-card-footer">
                    <span className={`post-author ${post.userId === currentUserId ? "is-mine" : ""}`}>
                      {post.userId === currentUserId ? "내 글" : `작성자: ${post.userId}`}
                    </span>
                    {post.tags?.length ? (
                      <div className="tag-list">
                        {post.tags.map((tag) => (
                          <span key={tag} className="post-tag">
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </Link>
              ))}
            </div>

            {pageInfo && pageInfo.totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => fetchPosts(currentPage - 1)}
                  disabled={pageInfo.first}
                  className="page-button"
                >
                  이전
                </button>
                <span className="page-info">
                  {currentPage + 1} / {pageInfo.totalPages}
                </span>
                <button
                  onClick={() => fetchPosts(currentPage + 1)}
                  disabled={pageInfo.last}
                  className="page-button"
                >
                  다음
                </button>
              </div>
            )}
          </>
        )}

        <section className="about-section" id="about">
          <div className="about-card">
            <div>
              <span className="section-label">DevBoard 소개</span>
              <h3>개발자 중심의 기술 토론과 기록에 집중한 공간</h3>
            </div>
            <div className="about-grid">
              <div className="about-item">
                <strong>깔끔한 인터페이스</strong>
                <p>다크 테마에 집중된 레이아웃으로 코드 커뮤니티 분위기를 유지합니다.</p>
              </div>
              <div className="about-item">
                <strong>빠른 검색</strong>
                <p>검색 필터로 원하는 글을 빠르게 찾아볼 수 있습니다.</p>
              </div>
              <div className="about-item">
                <strong>개발자 중심</strong>
                <p>개발자 커뮤니티 게시판에 어울리는 간결하고 프로페셔널한 디자인.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
