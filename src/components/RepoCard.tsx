import React from "react";
import "./RepoCard.css";

interface Repo {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  owner: {
    avatar_url: string;
  };
}

interface Props {
  repo: Repo;
  isBookmarked: boolean;
  toggleBookmark: () => void;
}

const RepoCard: React.FC<Props> = React.memo(({ repo, isBookmarked, toggleBookmark }) => {
  return (
    <div className="repo-card">
      <img src={repo.owner.avatar_url} alt={repo.name} className="repo-avatar" />
      <div className="repo-info">
        <a
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="repo-title"
        >
          {repo.name}
        </a>
        <p className="repo-desc">{repo.description || "No description provided."}</p>
        <p className="repo-meta">
          ⭐ {repo.stargazers_count} | {repo.language || "Unknown Language"}
        </p>
      </div>

      <button
        onClick={toggleBookmark}
        className={`bookmark-btn ${isBookmarked ? "bookmarked" : ""}`}
      >
        {isBookmarked ? "★ Bookmarked" : "☆ Bookmark"}
      </button>
    </div>
  );
});

export default RepoCard;
