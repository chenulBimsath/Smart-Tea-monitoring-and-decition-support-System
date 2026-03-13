import { useState } from "react";
import "./MyProfile.css";

export default function MyProfile() {

  const [showEdit, setShowEdit] = useState(false);

  const user = {
    fullname: "Kamal Perera",
    role: "Estate Officer",
    email: "kamal@example.com",
    mobile: "+94 77 123 4567",
    location: "Kandy, Sri Lanka",
    estate_id: "EST-001",
    estate_name: "Green Valley Estate",
    division_id: "DIV-05",
    department: "Field Management",
    join_date: "12 Jan 2022",
    avatar: "/PROFILE.jpg"
  };

  return (
    <div className="profile-page">

      <div className="profile-card">

        <div className="profile-header">

          <div className="profile-left">
            <img src={user.avatar} className="profile-avatar" />

            <div>
              <h2>{user.fullname}</h2>
              <p className="role">{user.role}</p>
              <span className="status">Active</span>
            </div>
          </div>

          <button
            className="edit-btn"
            onClick={() => setShowEdit(true)}
          >
            Edit Profile
          </button>

        </div>

        <div className="section">
          <h3>Contact Information</h3>

          <div className="profile-grid">
            <ProfileItem label="Email" value={user.email} />
            <ProfileItem label="Mobile" value={user.mobile} />
            <ProfileItem label="Location" value={user.location} />
            <ProfileItem label="Joined Date" value={user.join_date} />
          </div>
        </div>

        <div className="section">
          <h3>Estate Information</h3>

          <div className="profile-grid">
            <ProfileItem label="Estate ID" value={user.estate_id} />
            <ProfileItem label="Estate Name" value={user.estate_name} />
            <ProfileItem label="Division ID" value={user.division_id} />
            <ProfileItem label="Department" value={user.department} />
          </div>
        </div>

      </div>

      {showEdit && (
        <EditProfile close={() => setShowEdit(false)} user={user} />
      )}

    </div>
  );
}

function ProfileItem({ label, value }) {
  return (
    <div className="profile-box">
      <span>{label}</span>
      <p>{value}</p>
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
        <input defaultValue={user.location} />

        <button className="save-btn">Save Changes</button>

      </div>

    </div>
  );
}