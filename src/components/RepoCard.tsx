import React from "react";
import "./RepoCard.css";

interface Repo {
  id: number;
  name: string;
  html_url: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

interface Props {
  repo: Repo;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
}

const RepoCard: React.FC<Props> = React.memo(
  ({ repo, isBookmarked, onToggleBookmark }) => {
    return (
      <div className="repo-card">
        <div className="repo-header">
          <img src={repo.owner.avatar_url} alt="avatar" className="repo-avatar" />
          <div className="repo-info">
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="repo-title"
            >
              {repo.name}
            </a>
            <p className="repo-desc">
              {repo.description || "No description available."}
            </p>
          </div>
        </div>

        <div className="repo-meta">
          <span>⭐ {repo.stargazers_count}</span>
          <span>🍴 {repo.forks_count}</span>
          <span>💻 {repo.language || "Unknown"}</span>
        </div>

        <button
          onClick={onToggleBookmark}
          className={`bookmark-btn ${isBookmarked ? "bookmarked" : ""}`}
        >
          {isBookmarked ? "★ Bookmarked" : "☆ Bookmark"}
        </button>
      </div>
    );
  }
);

export default RepoCard;
