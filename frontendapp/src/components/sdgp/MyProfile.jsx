import { useState, useEffect, useRef } from "react";
import "./MyProfile.css";

const API = import.meta.env.VITE_API_BASE || "https://api.smartteamonitor.com";

/* Derive initials from full name */
function initials(name = "") {
  return name.trim().split(/\s+/).map(w => w[0]).join("").slice(0, 2).toUpperCase() || "?";
}

/* Role → badge class */
function badgeClass(role = "") {
  const r = role.toLowerCase();
  if (r.includes("admin"))   return "admin";
  if (r.includes("manager")) return "manager";
  if (r.includes("officer")) return "officer";
  return "other";
}

/* Format date nicely */
function fmtDate(d) {
  if (!d) return null;
  return new Date(d).toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" });
}

export default function MyProfile() {
  const [profile,    setProfile]    = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [userId,     setUserId]     = useState(null);

  // Editable form state
  const [form, setForm] = useState({ fullName: "", mobileNum: "", address: "" });
  const [saving, setSaving] = useState(false);

  // Password form
  const [pass,     setPass]     = useState({ current: "", next: "", confirm: "" });
  const [show,     setShow]     = useState({ current: false, next: false, confirm: false });
  const [passErr,  setPassErr]  = useState("");
  const [passSaving, setPassSaving] = useState(false);

  // Toast
  const [toast, setToast] = useState(null);
  const toastRef = useRef();
  function showToast(msg, type = "success") {
    clearTimeout(toastRef.current);
    setToast({ msg, type });
    toastRef.current = setTimeout(() => setToast(null), 3200);
  }

  // ── On mount: read userId from localStorage, then fetch profile ──────────
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user") || "{}");
    // Support both camelCase and snake_case keys from login response
    const uid = stored?.userId || stored?.user_id || stored?.id;
    if (!uid) {
      setError("You are not logged in. Please sign in first.");
      setLoading(false);
      return;
    }
    setUserId(uid);
    fetchProfile(uid);
  }, []);

  async function fetchProfile(uid) {
    setLoading(true); setError(null);
    try {
      const res = await fetch(`${API}/api/users/${uid}`);
      if (!res.ok) throw new Error(`Failed to load profile (${res.status})`);
      const data = await res.json();
      setProfile(data);
      setForm({
        fullName:  data.fullName  || "",
        mobileNum: data.mobileNum || "",
        address:   data.address   || "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // ── Save profile info ─────────────────────────────────────────────────────
  async function handleSave(e) {
    e.preventDefault();
    if (!form.fullName.trim()) return showToast("Full name cannot be empty.", "error");
    setSaving(true);
    try {
      const res = await fetch(`${API}/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(await res.text());
      const updated = await res.json();
      setProfile(updated);
      setForm({ fullName: updated.fullName || "", mobileNum: updated.mobileNum || "", address: updated.address || "" });
      // Keep localStorage in sync
      const stored = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem("user", JSON.stringify({ ...stored, fullName: updated.fullName }));
      showToast("Profile saved successfully.");
    } catch (err) {
      showToast(err.message || "Failed to save.", "error");
    } finally {
      setSaving(false);
    }
  }

  // ── Change password ───────────────────────────────────────────────────────
  async function handlePassword(e) {
    e.preventDefault();
    setPassErr("");
    if (!pass.current)             return setPassErr("Please enter your current password.");
    if (pass.next.length < 6)      return setPassErr("New password must be at least 6 characters.");
    if (pass.next !== pass.confirm) return setPassErr("New passwords do not match.");
    setPassSaving(true);
    try {
      const res = await fetch(`${API}/api/users/${userId}/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: pass.current, newPassword: pass.next }),
      });
      if (!res.ok) throw new Error(await res.text());
      setPass({ current: "", next: "", confirm: "" });
      showToast("Password updated successfully.");
    } catch (err) {
      setPassErr(err.message || "Failed to change password.");
    } finally {
      setPassSaving(false);
    }
  }

  // ── Render: loading ───────────────────────────────────────────────────────
  if (loading) return (
    <div className="mp-page">
      <div className="mp-loading">
        <div className="mp-spinner" />
        <p>Loading your profile...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="mp-page">
      <div className="mp-body">
        <div className="mp-error">{error}</div>
      </div>
    </div>
  );

  const name = profile.fullName || "Unknown User";

  return (
    <div className="mp-page">
      <div className="mp-body">

        {/* ── KPI STRIP ── */}
        <div className="mp-kpi-strip">
          <div className="mp-kpi-card">
            <div className="mp-kpi-label">Account</div>
            <div className="mp-kpi-val green">{name}</div>
            <div className="mp-kpi-hint">{profile.role || "—"}</div>
          </div>
          <div className="mp-kpi-sep" />
          <div className="mp-kpi-card">
            <div className="mp-kpi-label">Estate</div>
            <div className="mp-kpi-val sky">{profile.estateName || `Estate #${profile.estateId}` || "—"}</div>
            <div className="mp-kpi-hint">ID: {profile.estateId ?? "—"}</div>
          </div>
          <div className="mp-kpi-sep" />
          <div className="mp-kpi-card">
            <div className="mp-kpi-label">Division</div>
            <div className="mp-kpi-val amber">{profile.divisionName || `Division #${profile.divisionId}` || "—"}</div>
            <div className="mp-kpi-hint">ID: {profile.divisionId ?? "—"}</div>
          </div>
          <div className="mp-kpi-sep" />
          <div className="mp-kpi-card">
            <div className="mp-kpi-label">Joined</div>
            <div className="mp-kpi-val">{fmtDate(profile.joinedDate) || "—"}</div>
            <div className="mp-kpi-hint">Department: {profile.department || "—"}</div>
          </div>
        </div>

        {/* ── MAIN GRID ── */}
        <div className="mp-grid">

          {/* LEFT — avatar + snapshot */}
          <div className="mp-card mp-avatar-panel">
            <div className="mp-avatar">{initials(name)}</div>
            <div className="mp-avatar-name">{name}</div>
            <div className="mp-avatar-email">{profile.email || "—"}</div>
            <span className={`mp-badge ${badgeClass(profile.role || "")}`}>{profile.role || "User"}</span>

            <div className="mp-info-tiles">
              <div className="mp-info-tile">
                <div>
                  <div className="mp-tile-lbl">Email</div>
                  <div className="mp-tile-val">{profile.email || "—"}</div>
                </div>
              </div>
              <div className="mp-info-tile">
                <div>
                  <div className="mp-tile-lbl">Mobile</div>
                  <div className="mp-tile-val">{profile.mobileNum || "Not set"}</div>
                </div>
              </div>
              <div className="mp-info-tile">
                <div>
                  <div className="mp-tile-lbl">Estate</div>
                  <div className="mp-tile-val">{profile.estateName || `#${profile.estateId}` || "—"}</div>
                </div>
              </div>
              <div className="mp-info-tile">
                <div>
                  <div className="mp-tile-lbl">Division</div>
                  <div className="mp-tile-val">{profile.divisionName || `#${profile.divisionId}` || "—"}</div>
                </div>
              </div>
              <div className="mp-info-tile">
                <div>
                  <div className="mp-tile-lbl">User ID</div>
                  <div className="mp-tile-val" style={{ fontSize: 11, fontFamily: "monospace" }}>{profile.userId}</div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT sections */}
          <div className="mp-sections">

            {/* ── READ-ONLY: Account Details ── */}
            <div className="mp-card">
              <div className="mp-card-hd">
                <span className="mp-card-ttl">Account Details</span>
              </div>
              <div className="mp-info-grid">
                <div className="mp-info-cell">
                  <div className="mp-info-cell-lbl">Email Address</div>
                  <div className="mp-info-cell-val">{profile.email || "—"}</div>
                </div>
                <div className="mp-info-cell">
                  <div className="mp-info-cell-lbl">Mobile Number</div>
                  <div className={`mp-info-cell-val ${!profile.mobileNum ? "empty" : ""}`}>
                    {profile.mobileNum || "Not provided"}
                  </div>
                </div>
                <div className="mp-info-cell">
                  <div className="mp-info-cell-lbl">Joined Date</div>
                  <div className={`mp-info-cell-val ${!profile.joinedDate ? "empty" : ""}`}>
                    {fmtDate(profile.joinedDate) || "Not recorded"}
                  </div>
                </div>
                <div className="mp-info-cell">
                  <div className="mp-info-cell-lbl">Department</div>
                  <div className={`mp-info-cell-val ${!profile.department ? "empty" : ""}`}>
                    {profile.department || "Not assigned"}
                  </div>
                </div>
                <div className="mp-info-cell">
                  <div className="mp-info-cell-lbl">Address</div>
                  <div className={`mp-info-cell-val ${!profile.address ? "empty" : ""}`}>
                    {profile.address || "Not provided"}
                  </div>
                </div>
                <div className="mp-info-cell">
                  <div className="mp-info-cell-lbl">Role</div>
                  <div className="mp-info-cell-val">{profile.role || "—"}</div>
                </div>
              </div>
            </div>

            {/* ── READ-ONLY: Estate Information ── */}
            <div className="mp-card">
              <div className="mp-card-hd">
                <span className="mp-card-ttl">Estate Information</span>
              </div>
              <div className="mp-info-grid">
                <div className="mp-info-cell">
                  <div className="mp-info-cell-lbl">Estate ID</div>
                  <div className="mp-info-cell-val">{profile.estateId ?? "—"}</div>
                </div>
                <div className="mp-info-cell">
                  <div className="mp-info-cell-lbl">Estate Name</div>
                  <div className={`mp-info-cell-val ${!profile.estateName ? "empty" : ""}`}>
                    {profile.estateName || "—"}
                  </div>
                </div>
                <div className="mp-info-cell">
                  <div className="mp-info-cell-lbl">Division ID</div>
                  <div className="mp-info-cell-val">{profile.divisionId ?? "—"}</div>
                </div>
                <div className="mp-info-cell">
                  <div className="mp-info-cell-lbl">Department</div>
                  <div className={`mp-info-cell-val ${!profile.department ? "empty" : ""}`}>
                    {profile.department || "—"}
                  </div>
                </div>
              </div>
            </div>

            {/* ── EDIT: Personal Information ── */}
            <div className="mp-card">
              <div className="mp-card-hd">
                <span className="mp-card-ttl">Edit Personal Information</span>
              </div>
              <form onSubmit={handleSave}>
                <div className="mp-form">
                  <div className="mp-form-row">
                    <div className="mp-field">
                      <label>Full Name</label>
                      <input
                        type="text" placeholder="Your full name"
                        value={form.fullName}
                        onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="mp-field">
                      <label>Email Address</label>
                      <input value={profile.email || ""} disabled />
                      <span className="mp-field-hint">Email cannot be changed here</span>
                    </div>
                  </div>
                  <div className="mp-form-row">
                    <div className="mp-field">
                      <label>Mobile Number</label>
                      <input
                        type="text" placeholder="+94 77 000 0000"
                        value={form.mobileNum}
                        onChange={e => setForm(p => ({ ...p, mobileNum: e.target.value }))}
                      />
                    </div>
                    <div className="mp-field">
                      <label>Role</label>
                      <input value={profile.role || ""} disabled />
                      <span className="mp-field-hint">Contact admin to change</span>
                    </div>
                  </div>
                  <div className="mp-field full">
                    <label>Address</label>
                    <input
                      type="text" placeholder="Your address"
                      value={form.address}
                      onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="mp-form-footer">
                  <button type="submit" className="mp-btn primary" disabled={saving}>
                    {saving ? "Saving…" : "Save Changes"}
                  </button>
                  <button type="button" className="mp-btn ghost"
                    onClick={() => setForm({ fullName: profile.fullName || "", mobileNum: profile.mobileNum || "", address: profile.address || "" })}>
                    Reset
                  </button>
                </div>
              </form>
            </div>

            {/* ── Change Password ── */}
            <div className="mp-card">
              <div className="mp-card-hd">
                <span className="mp-card-ttl">Change Password</span>
              </div>
              <form onSubmit={handlePassword}>
                <div className="mp-form">
                  <div className="mp-field">
                    <label>Current Password</label>
                    <div className="mp-pass-wrap">
                      <input
                        type={show.current ? "text" : "password"}
                        placeholder="Enter current password"
                        value={pass.current}
                        onChange={e => setPass(p => ({ ...p, current: e.target.value }))}
                      />
                      <button type="button" className="mp-eye"
                        onClick={() => setShow(s => ({ ...s, current: !s.current }))}>
                        {show.current ? "HIDE" : "SHOW"}
                      </button>
                    </div>
                  </div>
                  <div className="mp-form-row">
                    <div className="mp-field">
                      <label>New Password</label>
                      <div className="mp-pass-wrap">
                        <input
                          type={show.next ? "text" : "password"}
                          placeholder="Min. 6 characters"
                          value={pass.next}
                          onChange={e => setPass(p => ({ ...p, next: e.target.value }))}
                        />
                        <button type="button" className="mp-eye"
                          onClick={() => setShow(s => ({ ...s, next: !s.next }))}>
                          {show.next ? "HIDE" : "SHOW"}
                        </button>
                      </div>
                    </div>
                    <div className="mp-field">
                      <label>Confirm New Password</label>
                      <div className="mp-pass-wrap">
                        <input
                          type={show.confirm ? "text" : "password"}
                          placeholder="Repeat new password"
                          value={pass.confirm}
                          onChange={e => setPass(p => ({ ...p, confirm: e.target.value }))}
                        />
                        <button type="button" className="mp-eye"
                          onClick={() => setShow(s => ({ ...s, confirm: !s.confirm }))}>
                          {show.confirm ? "HIDE" : "SHOW"}
                        </button>
                      </div>
                    </div>
                  </div>
                  {passErr && <div className="mp-inline-err">{passErr}</div>}
                </div>
                <div className="mp-form-footer">
                  <button type="submit" className="mp-btn primary" disabled={passSaving}>
                    {passSaving ? "Updating…" : "Update Password"}
                  </button>
                  <button type="button" className="mp-btn ghost"
                    onClick={() => { setPass({ current: "", next: "", confirm: "" }); setPassErr(""); }}>
                    Clear
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`mp-toast ${toast.type}`}>
          {toast.type === "success" ? "✓" : "✕"} {toast.msg}
        </div>
      )}
    </div>
  );
}
