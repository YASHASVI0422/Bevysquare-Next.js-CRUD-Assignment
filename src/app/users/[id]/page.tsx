"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import type { User } from "@/types";
import styles from "./user.module.css";

const COLORS = [
  "#e0e7ff","#fce7f3","#dcfce7","#fef9c3",
  "#ffedd5","#dbeafe","#f3e8ff","#ccfbf1",
  "#ffe4e6","#ecfccb",
];
const TEXT_COLORS = [
  "#4338ca","#9d174d","#15803d","#a16207",
  "#c2410c","#1d4ed8","#7e22ce","#0f766e",
  "#be123c","#4d7c0f",
];

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

type Toast = { message: string; type: "success" | "error" };

export default function UserPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });
  const [saving, setSaving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  useEffect(() => {
    api.get<User>(`/users/${id}`).then((res) => {
      setUser(res.data);
      setForm({ name: res.data.name, email: res.data.email });
      setLoading(false);
    });
  }, [id]);

  function showToast(message: string, type: Toast["type"]) {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function handleUpdate() {
    if (!user) return;
    setSaving(true);
    const prev = { ...user };
    // Optimistic update
    setUser((u) => u ? { ...u, name: form.name, email: form.email } : u);
    setEditMode(false);
    try {
      await api.put(`/users/${id}`, { ...user, name: form.name, email: form.email });
      showToast("Changes saved", "success");
    } catch {
      setUser(prev);
      setForm({ name: prev.name, email: prev.email });
      showToast("Failed to save. Reverted.", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setShowConfirm(false);
    router.push("/users");
    try {
      await api.delete(`/users/${id}`);
    } catch {
      console.error("Delete failed");
    }
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <nav className={styles.nav}>
          <Link href="/users" className={styles.back}>← Users</Link>
        </nav>
        <div className={styles.loadingBody}>
          <div className={styles.spinner} />
        </div>
      </div>
    );
  }

  if (!user) return null;

  const bg = COLORS[(user.id - 1) % COLORS.length];
  const tc = TEXT_COLORS[(user.id - 1) % TEXT_COLORS.length];

  return (
    <div className={styles.page}>
      {toast && (
        <div className={`${styles.toast} ${styles[`toast_${toast.type}`]}`}>
          {toast.message}
        </div>
      )}

      {showConfirm && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modal}>
            <h3>Delete user?</h3>
            <p>This will permanently remove <strong>{user.name}</strong> from the system.</p>
            <div className={styles.modalActions}>
              <button className={styles.btnCancel} onClick={() => setShowConfirm(false)}>Cancel</button>
              <button className={styles.btnDelete} onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}

      <nav className={styles.nav}>
        <Link href="/users" className={styles.back}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M5 12l7-7M5 12l7 7" />
          </svg>
          Users
        </Link>
        <span className={styles.breadcrumb}>{user.name}</span>
      </nav>

      <main className={styles.main}>
        {/* Profile header */}
        <div className={styles.profileCard}>
          <div className={styles.profileLeft}>
            <div className={styles.avatar} style={{ background: bg, color: tc }}>
              {getInitials(user.name)}
            </div>
            <div className={styles.profileInfo}>
              {editMode ? (
                <div className={styles.editRow}>
                  <input
                    className={styles.input}
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Name"
                    autoFocus
                  />
                  <input
                    className={styles.input}
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="Email"
                  />
                </div>
              ) : (
                <>
                  <div className={styles.profileName}>{user.name}</div>
                  <div className={styles.profileMeta}>@{user.username} · {user.email}</div>
                </>
              )}
            </div>
          </div>
          <div className={styles.profileActions}>
            {editMode ? (
              <>
                <button
                  className={styles.btnSave}
                  onClick={handleUpdate}
                  disabled={saving || !form.name || !form.email}
                >
                  {saving ? "Saving..." : "Save"}
                </button>
                <button className={styles.btnCancel} onClick={() => {
                  setForm({ name: user.name, email: user.email });
                  setEditMode(false);
                }}>
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button className={styles.btnEdit} onClick={() => setEditMode(true)}>Edit</button>
                <button className={styles.btnDelete} onClick={() => setShowConfirm(true)}>Delete</button>
              </>
            )}
          </div>
        </div>

        {/* Details grid */}
        <div className={styles.detailsGrid}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Contact</h2>
            <div className={styles.fieldList}>
              <Field label="Email" value={user.email} />
              <Field label="Phone" value={user.phone} mono />
              <Field label="Website" value={user.website} />
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Address</h2>
            <div className={styles.fieldList}>
              <Field label="Street" value={`${user.address.street}, ${user.address.suite}`} />
              <Field label="City" value={user.address.city} />
              <Field label="Zip" value={user.address.zipcode} mono />
              <Field label="Geo" value={`${user.address.geo.lat}, ${user.address.geo.lng}`} mono />
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Company</h2>
            <div className={styles.fieldList}>
              <Field label="Name" value={user.company.name} />
              <Field label="Catchphrase" value={user.company.catchPhrase} />
              <Field label="Industry" value={user.company.bs} />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className={styles.field}>
      <span className={styles.fieldLabel}>{label}</span>
      <span className={styles.fieldValue} style={{ fontFamily: mono ? "'SF Mono','Fira Mono',monospace" : undefined }}>
        {value}
      </span>
    </div>
  );
}
