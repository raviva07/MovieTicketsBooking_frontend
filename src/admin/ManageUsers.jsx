import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllUsers,
  deleteUser,
  updateUser, // ✅ FIXED IMPORT
} from "../store/userSlice";

const ManageUsers = () => {
  const dispatch = useDispatch();

  const { users = [], loading, error } = useSelector((s) => s.user);
  const auth = useSelector((s) => s.auth);

  const [processingId, setProcessingId] = useState(null);

  // ✅ EDIT STATE
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({
    name: "",
    role: "",
  });

  // ================= LOAD =================
  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (id === auth.user?.id) {
      return alert("You cannot delete your own account");
    }

    if (!window.confirm("Delete this user?")) return;

    try {
      setProcessingId(id);

      await dispatch(deleteUser(id)).unwrap();

      dispatch(fetchAllUsers());
    } catch (err) {
      alert(err?.message || "Delete failed");
    } finally {
      setProcessingId(null);
    }
  };

  // ================= EDIT =================
  const openEdit = (user) => {
    setEditingUser(user);
    setForm({
      name: user.name || "",
      role: user.role || "ROLE_USER",
    });
  };

  const handleUpdate = async () => {
    try {
      setProcessingId(editingUser.id);

      await dispatch(
        updateUser({
          id: editingUser.id,
          payload: form, // ✅ FIXED KEY
        })
      ).unwrap();

      setEditingUser(null);
      dispatch(fetchAllUsers());
    } catch (err) {
      alert(err?.message || "Update failed");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="container py-4">

      <h2 className="mb-4 text-center fw-bold">👤 Manage Users</h2>

      {/* LOADING */}
      {loading && (
        <div className="text-center">
          <div className="spinner-border"></div>
        </div>
      )}

      {/* ERROR */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* TABLE */}
      {!loading && users.length > 0 && (
        <div className="table-responsive shadow-sm rounded">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th style={{ width: "180px" }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="fw-semibold">{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <span
                      className={`badge ${
                        u.role === "ROLE_ADMIN"
                          ? "bg-dark"
                          : "bg-secondary"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>

                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => openEdit(u)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-sm btn-outline-danger"
                      disabled={processingId === u.id}
                      onClick={() => handleDelete(u.id)}
                    >
                      {processingId === u.id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && users.length === 0 && (
        <div className="text-center text-muted">No users found</div>
      )}

      {/* ================= EDIT MODAL ================= */}
      {editingUser && (
        <div
          className="modal fade show d-block"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title">Edit User</h5>
                <button
                  className="btn-close"
                  onClick={() => setEditingUser(null)}
                ></button>
              </div>

              <div className="modal-body">

                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    className="form-control"
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Role</label>
                  <select
                    className="form-select"
                    value={form.role}
                    onChange={(e) =>
                      setForm({ ...form, role: e.target.value })
                    }
                  >
                    <option value="ROLE_USER">USER</option>
                    <option value="ROLE_ADMIN">ADMIN</option>
                  </select>
                </div>

              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setEditingUser(null)}
                >
                  Cancel
                </button>

                <button
                  className="btn btn-primary"
                  disabled={processingId === editingUser.id}
                  onClick={handleUpdate}
                >
                  {processingId === editingUser.id
                    ? "Updating..."
                    : "Update"}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ManageUsers;
