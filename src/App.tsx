import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import RepoCard from "./components/RepoCard";
import "./App.css";

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

const App: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [repos, setRepos] = useState<Repo[]>([]);
  const [bookmarked, setBookmarked] = useState<Repo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState<boolean>(false);

  // 🧠 Load saved bookmarks
  useEffect(() => {
    const stored = localStorage.getItem("bookmarkedRepos");
    if (stored) setBookmarked(JSON.parse(stored));
  }, []);

  // 🔁 Save bookmarks whenever they change
  useEffect(() => {
    localStorage.setItem("bookmarkedRepos", JSON.stringify(bookmarked));
  }, [bookmarked]);

  // ⏳ Debounce search effect (300ms)
  useEffect(() => {
    const delay = setTimeout(() => {
      if (query.trim()) fetchRepos(query);
      else setRepos([]);
    }, 300);
    return () => clearTimeout(delay);
  }, [query]);

  // 🔍 Fetch Repos from GitHub Search API
  const fetchRepos = useCallback(async (search: string) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://api.github.com/search/repositories?q=${encodeURIComponent(
          search
        )}&sort=stars&order=desc&per_page=30`
      );
      setRepos(res.data.items);
    } catch (err) {
      console.error("Error fetching repositories:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ⭐ Toggle Bookmark
  const toggleBookmark = useCallback((repo: Repo) => {
    setBookmarked((prev) => {
      const exists = prev.some((r) => r.id === repo.id);
      return exists ? prev.filter((r) => r.id !== repo.id) : [...prev, repo];
    });
  }, []);

  // 🧮 Decide what to display
  const displayedRepos = useMemo(
    () =>
      showBookmarksOnly
        ? bookmarked.sort((a, b) => b.stargazers_count - a.stargazers_count)
        : repos,
    [showBookmarksOnly, repos, bookmarked]
  );

  return (
    <div className="app-container">
      <h1 className="heading">🚀 GitHub Repo Finder & Bookmarker</h1>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search GitHub repositories..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />
        <button
          className={`toggle-btn ${showBookmarksOnly ? "active" : ""}`}
          onClick={() => setShowBookmarksOnly((prev) => !prev)}
        >
          {showBookmarksOnly ? "Show All" : "Bookmarked Only"}
        </button>
      </div>

      {loading ? (
        <p className="status-msg">Loading...</p>
      ) : displayedRepos.length === 0 ? (
        <p className="status-msg">No repositories found.</p>
      ) : (
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
      )}
    </div>
  );
};

export default App;
