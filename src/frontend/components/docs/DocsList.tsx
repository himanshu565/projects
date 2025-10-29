import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DocCard from "./DocCard.js";
import type { Doc } from "./DocCard.js";
import { trpc } from "../../trpc/trpc.js";

type Props = {
  docs?: Doc[];
  teamId?: string; // optional: when provided, component will fetch docs from backend
  currentUserId?: string;
  onOpen?: (id: string) => void;
};

const TABS = ["Recent", "Starred", "Owned / Shared"] as const;

export const DocsList: React.FC<Props> = ({
  docs = [],
  teamId,
  currentUserId,
  onOpen,
}) => {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("Recent");
  const [query, setQuery] = useState("");
  const [remoteDocs, setRemoteDocs] = useState<Doc[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [compact, setCompact] = useState(false);
  const [visibleCount, setVisibleCount] = useState(20);
  const navigate = useNavigate();

  const starredKey = `starredDocs:${currentUserId ?? "guest"}`;
  const [starredMap, setStarredMap] = useState<Record<string, boolean>>(() => {
    try {
      const raw = localStorage.getItem(starredKey);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  const filtered = useMemo(() => {
    const source = remoteDocs ?? docs;
    // annotate with starred state from local map
    const annotated = source.map((d) => ({
      ...d,
      starred: !!starredMap[d.id],
    }));
    let list = annotated.slice();
    if (activeTab === "Starred") list = list.filter((d) => d.starred);
    // Owned / Shared tab currently shows all docs; implement finer toggle as needed
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          (d.snippet || "").toLowerCase().includes(q)
      );
    }
    if (activeTab === "Recent") {
      list.sort((a, b) => {
        const ta = a.lastEdited ? Date.parse(a.lastEdited) : 0;
        const tb = b.lastEdited ? Date.parse(b.lastEdited) : 0;
        return tb - ta;
      });
    }
    return list;
  }, [docs, activeTab, query, currentUserId, remoteDocs, starredMap]);

  const visible = filtered.slice(0, visibleCount);

  // fetch team docs when a teamId is provided
  useEffect(() => {
    let mounted = true;
    if (!teamId) {
      setRemoteDocs(null);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    (trpc as any)
      .query("docRouter.getTeamDocs", { teamId })
      .then((res: any) => {
        if (!mounted) return;
        // map backend shape to Doc type used by UI
        const mapped: Doc[] = (res || []).map((d: any) => ({
          id: d.docId,
          title: d.name,
          snippet: `by ${d.ownerFirstName} ${d.ownerLastName}`,
          lastEdited: d.lastEdited,
          starred: !!starredMap[d.docId],
          ownerId: d.ownerId,
        }));
        setRemoteDocs(mapped);
      })
      .catch((err: unknown) => {
        console.error("failed to load team docs", err);
        if (!mounted) return;
        const msg =
          err && typeof err === "object" && (err as any).message
            ? (err as any).message
            : String(err);
        setError(msg || "Failed to load docs");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [teamId, starredMap]);

  const handleToggleStar = (id: string) => {
    setStarredMap((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem(starredKey, JSON.stringify(next));
      } catch {}
      // update remoteDocs if present
      setRemoteDocs((rd) =>
        rd
          ? rd.map((d) => (d.id === id ? { ...d, starred: !!next[id] } : d))
          : rd
      );
      return next;
    });
  };

  const handleOpen = (id: string) => {
    if (onOpen) return onOpen(id);
    if (teamId) return navigate(`/team/${teamId}/doc/${id}`);
    navigate(`/team/unknown/doc/${id}`);
  };

  return (
    <section className="space-y-4">
      <header className="flex items-center justify-between">
        <nav className="flex gap-2" aria-label="Docs tabs">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded ${
                activeTab === tab ? "bg-blue-600 text-white" : "bg-gray-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <input
            aria-label="Search documents"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search…"
            className="px-3 py-1 border rounded"
          />
        </div>
      </header>

      <div className="grid gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <label className="text-sm">Compact</label>
            <button
              onClick={() => setCompact((c) => !c)}
              className="px-2 py-1 border rounded"
            >
              {compact ? "On" : "Off"}
            </button>
          </div>
          <div className="text-sm text-gray-500">{filtered.length} results</div>
        </div>

        {loading ? (
          <div className="p-6 text-center text-gray-500">
            Loading documents…
          </div>
        ) : error ? (
          <div className="p-6 text-center text-red-600">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No documents found.
          </div>
        ) : (
          <>
            {visible.map((doc) => (
              <div key={doc.id} className={compact ? "text-sm" : ""}>
                <DocCard
                  doc={doc}
                  onOpen={handleOpen}
                  onToggleStar={handleToggleStar}
                />
              </div>
            ))}

            {filtered.length > visible.length && (
              <div className="text-center mt-2">
                <button
                  onClick={() => setVisibleCount((c) => c + 20)}
                  className="px-3 py-1 border rounded"
                >
                  Load more
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default DocsList;
