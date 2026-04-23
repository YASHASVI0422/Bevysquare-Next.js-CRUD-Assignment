"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import type { User } from "@/types";
import styles from "./users.module.css";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get<User[]>("/users").then((res) => {
      setUsers(res.data);
      setLoading(false);
    });
  }, []);

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.company.name.toLowerCase().includes(search.toLowerCase())
  );

  function getInitials(name: string) {
    return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  }

  const COLORS = [
    "#e0e7ff", "#fce7f3", "#dcfce7", "#fef9c3",
    "#ffedd5", "#dbeafe", "#f3e8ff", "#ccfbf1",
    "#ffe4e6", "#ecfccb",
  ];
  const TEXT_COLORS = [
    "#4338ca", "#9d174d", "#15803d", "#a16207",
    "#c2410c", "#1d4ed8", "#7e22ce", "#0f766e",
    "#be123c", "#4d7c0f",
  ];

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>Users</h1>
            {!loading && (
              <span className={styles.count}>{users.length} total</span>
            )}
          </div>
        </div>
      </header>

      <div className={styles.toolbar}>
        <div className={styles.toolbarInner}>
          <div className={styles.searchWrap}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.searchIcon}>
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              className={styles.search}
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {!loading && search && (
            <span className={styles.resultNote}>{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
          )}
        </div>
      </div>

      <main className={styles.main}>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Company</th>
                <th>City</th>
                <th>Phone</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i} className={styles.skeletonRow}>
                      <td><div className={`skeleton ${styles.skLine}`} style={{ width: "140px" }} /></td>
                      <td><div className={`skeleton ${styles.skLine}`} style={{ width: "180px" }} /></td>
                      <td><div className={`skeleton ${styles.skLine}`} style={{ width: "120px" }} /></td>
                      <td><div className={`skeleton ${styles.skLine}`} style={{ width: "90px" }} /></td>
                      <td><div className={`skeleton ${styles.skLine}`} style={{ width: "110px" }} /></td>
                      <td></td>
                    </tr>
                  ))
                : filtered.map((user) => {
                    const bg = COLORS[(user.id - 1) % COLORS.length];
                    const tc = TEXT_COLORS[(user.id - 1) % TEXT_COLORS.length];
                    return (
                      <tr key={user.id} className={styles.row}>
                        <td>
                          <div className={styles.nameCell}>
                            <div className={styles.avatar} style={{ background: bg, color: tc }}>
                              {getInitials(user.name)}
                            </div>
                            <div>
                              <div className={styles.name}>{user.name}</div>
                              <div className={styles.username}>@{user.username}</div>
                            </div>
                          </div>
                        </td>
                        <td className={styles.email}>{user.email}</td>
                        <td className={styles.secondary}>{user.company.name}</td>
                        <td className={styles.secondary}>{user.address.city}</td>
                        <td className={styles.mono}>{user.phone}</td>
                        <td className={styles.actionCell}>
                          <Link href={`/users/${user.id}`} className={styles.viewLink}>
                            View →
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
            </tbody>
          </table>

          {!loading && filtered.length === 0 && (
            <div className={styles.empty}>
              No users match &ldquo;{search}&rdquo;
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
