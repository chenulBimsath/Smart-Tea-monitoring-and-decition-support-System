import { useState } from "react";
import "./MyProfile.css";

export default function MyProfile() {

  const [showEdit, setShowEdit] = useState(false);

  const user = {
    fullname: "Kamal Perera",
    email: "kamal@example.com",
    role: "Estate Officer",
    estate_id: "EST-001",
    division_id: "DIV-05",
    mobile: "+94 77 123 4567",
    avatar: "/PROFILE.jpg"
  };

  return (
    <div className="profile-page">

      <div className="profile-card">

        <div className="profile-header">

          <img src={user.avatar} className="profile-avatar" />

          <div>
            <h2>{user.fullname}</h2>
            <p className="role">{user.role}</p>
          </div>

          <button
            className="edit-btn"
            onClick={() => setShowEdit(true)}
          >
            Edit Profile
          </button>

        </div>

        <div className="profile-grid">

          <div className="profile-item">
            <span>Email</span>
            <strong>{user.email}</strong>
          </div>

          <div className="profile-item">
            <span>Mobile Number</span>
            <strong>{user.mobile}</strong>
          </div>

          <div className="profile-item">
            <span>Estate ID</span>
            <strong>{user.estate_id}</strong>
          </div>

          <div className="profile-item">
            <span>Division ID</span>
            <strong>{user.division_id}</strong>
          </div>

        </div>

      </div>

      {showEdit && (
        <EditProfile close={() => setShowEdit(false)} user={user} />
      )}

    </div>
  );
}

function EditProfile({ close, user }) {
  return (
    <div className="modal-bg">

      <div className="modal">

        <div className="modal-header">
          <h3>Edit Profile</h3>
          <button onClick={close}>✕</button>
        </div>

        <input defaultValue={user.fullname} />
        <input defaultValue={user.email} />
        <input defaultValue={user.mobile} />

        <button className="save-btn">Save</button>

      </div>

    </div>
  );
}