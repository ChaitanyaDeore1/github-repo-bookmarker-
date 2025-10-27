import React, { useState, useEffect, useCallback, useMemo } from "react";
import RepoCard from "./components/RepoCard";
import "./App.css";

interface Repo {
  id: number;
  name: string;
  html_url: string;
  description: string | null; // ✅ fixed
  stargazers_count: number;
  language: string | null; // ✅ fixed
  owner: {
    avatar_url: string;
  };
}

const App: React.FC = () => {
  const [query, setQuery] = useState("");
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookmarks, setBookmarks] = useState<Repo[]>([]);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);

  // Load bookmarks from localStorage once
  useEffect(() => {
    const saved = localStorage.getItem("bookmarks");
    if (saved) setBookmarks(JSON.parse(saved));
  }, []);

  // Persist bookmarks on change
  useEffect(() => {
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  // Debounced API call (GitHub Search)
  const fetchRepos = useCallback(
    async (searchTerm: string) => {
      if (!searchTerm.trim()) {
        setRepos([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://api.github.com/search/repositories?q=${searchTerm}&per_page=30`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch repositories");
        }
        const data = await response.json();
        setRepos(data.items || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Debounce input
  useEffect(() => {
    const handler = setTimeout(() => {
      if (!showBookmarksOnly) fetchRepos(query);
    }, 300); // 300ms debounce
    return () => clearTimeout(handler);
  }, [query, fetchRepos, showBookmarksOnly]);

  const toggleBookmark = useCallback(
    (repo: Repo) => {
      setBookmarks((prev) => {
        const exists = prev.find((r) => r.id === repo.id);
        return exists
          ? prev.filter((r) => r.id !== repo.id)
          : [...prev, repo];
      });
    },
    []
  );

  const isBookmarked = useCallback(
    (repoId: number) => bookmarks.some((r) => r.id === repoId),
    [bookmarks]
  );

  const displayedRepos = useMemo(
    () => (showBookmarksOnly ? bookmarks : repos),
    [showBookmarksOnly, bookmarks, repos]
  );

  return (
    <div className="app-container">
      <h1 className="heading">GitHub Repo Bookmark App</h1>

      <div className="search-container">
        {!showBookmarksOnly && (
          <input
            type="text"
            placeholder="Search GitHub repositories..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input"
          />
        )}

        <button
          className="toggle-btn"
          onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
        >
          {showBookmarksOnly ? "Show All" : "Show Bookmarked Only"}
        </button>
      </div>

      {loading && <p className="status-msg">Loading...</p>}
      {error && <p className="status-msg error">{error}</p>}
      {!loading && !error && displayedRepos.length === 0 && (
        <p className="status-msg">No repositories found.</p>
      )}

      <div className="repo-list">
        {displayedRepos.map((repo) => (
          <RepoCard
            key={repo.id}
            repo={repo}
            isBookmarked={isBookmarked(repo.id)}
            toggleBookmark={() => toggleBookmark(repo)}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
