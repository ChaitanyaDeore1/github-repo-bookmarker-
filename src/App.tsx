import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import RepoCard from "./components/RepoCard";
import "./App.css";

interface Repo {
  id: number;
  name: string;
  html_url: string;
  description: string;
  stargazers_count: number;
  language: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

const App: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [repos, setRepos] = useState<Repo[]>([]);
  const [bookmarked, setBookmarked] = useState<Repo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showBookmarks, setShowBookmarks] = useState<boolean>(false);

  // Debounce logic
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) fetchRepos(query);
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  // Fetch from GitHub search API
  const fetchRepos = async (searchQuery: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`https://api.github.com/search/repositories?q=${searchQuery}&per_page=30`);
      setRepos(res.data.items || []);
    } catch {
      setError("Failed to fetch repositories. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Toggle bookmark
  const toggleBookmark = useCallback((repo: Repo) => {
    setBookmarked((prev) => {
      const exists = prev.some((r) => r.id === repo.id);
      const updated = exists ? prev.filter((r) => r.id !== repo.id) : [...prev, repo];
      localStorage.setItem("bookmarks", JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Load bookmarks
  useEffect(() => {
    const stored = localStorage.getItem("bookmarks");
    if (stored) setBookmarked(JSON.parse(stored));
  }, []);

  const displayedRepos = showBookmarks ? bookmarked : repos;

  return (
    <div className="app-container">
      <h1 className="heading">🔍 GitHub Repo Bookmarker</h1>

      <div className="search-container">
        <input
          className="search-input"
          type="text"
          placeholder="Search for repositories..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          className="toggle-btn"
          onClick={() => setShowBookmarks((prev) => !prev)}
        >
          {showBookmarks ? "Show All Results" : "Show Bookmarked Only"}
        </button>
      </div>

      {loading && <p className="status-msg">Loading repositories...</p>}
      {error && <p className="status-msg error">{error}</p>}
      {!loading && !error && displayedRepos.length === 0 && (
        <p className="status-msg">No repositories found.</p>
      )}

      <div className="repo-list">
        {displayedRepos.map((repo) => (
          <RepoCard
            key={repo.id}
            repo={repo}
            isBookmarked={bookmarked.some((r) => r.id === repo.id)}
            onToggleBookmark={() => toggleBookmark(repo)}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
