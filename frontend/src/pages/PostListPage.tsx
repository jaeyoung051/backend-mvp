import { useEffect, useState, type ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/axios";
import "./PostListPage.css";

interface PostItem {
  id: number;
  title: string;
  userId: number;
  createdAt: string;
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
      <form onSubmit={handleSearch} className="search-bar">
        <select
          value={searchType}
          onChange={handleSearchTypeChange}
          className="search-select"
        >
          <option value="title">제목</option>
          <option value="title_content">제목+내용</option>
        </select>
        <input
          type="text"
          value={keyword}
          onChange={handleKeywordChange}
          placeholder="검색어를 입력하세요"
          className="search-input"
        />
        <button type="submit" className="search-button">
          검색
        </button>
      </form>

      <div className="post-list-actions">
        <Link to="/posts/new" className="create-post-button">
          <span>+</span> 글 작성하기
        </Link>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
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
                <div className="post-card-footer">
                  <span className={`post-author ${post.userId === currentUserId ? 'is-mine' : ''}`}>
                    {post.userId === currentUserId ? '내 글' : `작성자: ${post.userId}`}
                  </span>
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
    </div>
  );
}