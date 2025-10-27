import React from "react";
import { Star, Bookmark, BookmarkCheck, ExternalLink } from "lucide-react";
import "./RepoCard.css";

interface RepoCardProps {
  repo: {
    name: string;
    html_url: string;
    description: string;
    stargazers_count: number;
    language: string;
    owner: { login: string; avatar_url: string };
  };
  isBookmarked: boolean;
  onToggleBookmark: () => void;
}

const RepoCard: React.FC<RepoCardProps> = React.memo(({ repo, isBookmarked, onToggleBookmark }) => {
  return (
    <div className="repo-card">
      <div className="repo-header">
        <img src={repo.owner.avatar_url} alt="Owner Avatar" className="avatar" />
        <h3>{repo.name}</h3>
      </div>
      <p className="repo-description">{repo.description || "No description provided."}</p>

      <div className="repo-footer">
        <span className="stars"><Star size={16} /> {repo.stargazers_count}</span>
        <span className="lang">{repo.language || "N/A"}</span>
        <button className="bookmark-btn" onClick={onToggleBookmark}>
          {isBookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
        </button>
        <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
          <ExternalLink size={18} />
        </a>
      </div>
    </div>
  );
});

export default RepoCard;
