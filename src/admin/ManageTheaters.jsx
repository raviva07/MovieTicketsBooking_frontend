// src/admin/ManageTheaters.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTheaters,
  createTheater,
  updateTheater,
  deleteTheater,
} from "../store/theaterSlice";

// ✅ Always new object
const createEmptyRow = () => ({
  row: "",
  count: "",
  type: "REGULAR",
  basePrice: "",
});

const emptyForm = {
  name: "",
  address: "",
  city: "",
  state: "",
  country: "",
  phone: "",
  contactEmail: "",
  screens: 1,
};

const ManageTheaters = () => {
  const dispatch = useDispatch();
  const { list = [], loading } = useSelector((s) => s.theater);

  const [form, setForm] = useState(emptyForm);
  const [seatRows, setSeatRows] = useState([createEmptyRow()]);
  const [editingId, setEditingId] = useState(null);
  const [viewTheater, setViewTheater] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchTheaters());
  }, [dispatch]);

  // ================= INPUT =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= SEAT BUILDER =================
  const addRow = () => setSeatRows([...seatRows, createEmptyRow()]);

  const removeRow = (index) => {
    setSeatRows(seatRows.filter((_, i) => i !== index));
  };

  const updateRow = (index, field, value) => {
    setSeatRows(
      seatRows.map((row, i) =>
        i === index ? { ...row, [field]: value } : row
      )
    );
  };

  // ================= VALIDATION =================
  const validate = () => {
    if (!form.name.trim()) return "Theater name required";
    if (!form.address.trim()) return "Address required";
    if (!form.contactEmail.trim()) return "Email required";

    const setRows = new Set();

    for (let r of seatRows) {
      if (!r.row || !r.count || !r.basePrice) {
        return "Fill all seat rows";
      }

      const key = r.row.toUpperCase();
      if (setRows.has(key)) return `Duplicate row: ${key}`;
      setRows.add(key);
    }

    return null;
  };

  // ================= PAYLOAD =================
  const buildPayload = () => ({
    ...form,
    screens: Number(form.screens),
    seatLayout: seatRows.map((r) => ({
      row: r.row.toUpperCase(),
      count: String(r.count),
      type: r.type,
      basePrice: String(r.basePrice),
    })),
  });

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const err = validate();
    if (err) return alert(err);

    try {
      setSubmitting(true);

      if (editingId) {
        await dispatch(updateTheater({ id: editingId, payload: buildPayload() })).unwrap();
        alert("✅ Theater updated");
      } else {
        await dispatch(createTheater(buildPayload())).unwrap();
        alert("✅ Theater created");
      }

      resetForm();
      dispatch(fetchTheaters());
    } catch (err) {
      alert("❌ " + (err?.message || JSON.stringify(err)));
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setForm(emptyForm);
    setSeatRows([createEmptyRow()]);
    setEditingId(null);
  };

  // ================= EDIT =================
  const handleEdit = (t) => {
    setEditingId(t.id);

    setForm({
      name: t.name || "",
      address: t.address || "",
      city: t.city || "",
      state: t.state || "",
      country: t.country || "",
      phone: t.phone || "",
      contactEmail: t.contactEmail || "",
      screens: t.screens || 1,
    });

    setSeatRows(
      t.seatLayout?.map((r) => ({ ...r })) || [createEmptyRow()]
    );

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this theater?")) return;
    await dispatch(deleteTheater(id));
  };

  // ================= UI =================
  return (
    <div className="container py-4">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold">🎬 Theater Management</h3>
        <button className="btn btn-outline-primary" onClick={() => dispatch(fetchTheaters())}>
          🔄 Refresh
        </button>
      </div>

      {/* FORM */}
      <div className="card shadow-lg border-0 mb-4">
        <div className="card-header bg-dark text-white fw-semibold">
          {editingId ? "✏️ Edit Theater" : "➕ Create Theater"}
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">

              {/* BASIC INFO */}
              <div className="col-md-6">
                <label className="form-label">Theater Name</label>
                <input className="form-control" name="name"
                  value={form.name} onChange={handleChange} required />
              </div>

              <div className="col-md-6">
                <label className="form-label">Email</label>
                <input className="form-control" name="contactEmail"
                  value={form.contactEmail} onChange={handleChange} required />
              </div>

              <div className="col-md-6">
                <label className="form-label">Address</label>
                <input className="form-control" name="address"
                  value={form.address} onChange={handleChange} required />
              </div>

              <div className="col-md-6">
                <label className="form-label">Phone</label>
                <input className="form-control" name="phone"
                  value={form.phone} onChange={handleChange} />
              </div>

              <div className="col-md-4">
                <label className="form-label">City</label>
                <input className="form-control" name="city"
                  value={form.city} onChange={handleChange} />
              </div>

              <div className="col-md-4">
                <label className="form-label">State</label>
                <input className="form-control" name="state"
                  value={form.state} onChange={handleChange} />
              </div>

              <div className="col-md-4">
                <label className="form-label">Country</label>
                <input className="form-control" name="country"
                  value={form.country} onChange={handleChange} />
              </div>

              {/* SCREENS FIXED */}
              <div className="col-md-3">
                <label className="form-label fw-bold text-primary">
                  🎥 Number of Screens
                </label>
                <input
                  type="number"
                  min="1"
                  className="form-control"
                  name="screens"
                  value={form.screens}
                  onChange={handleChange}
                />
              </div>

              {/* SEAT BUILDER */}
              <div className="col-12">
                <h5 className="mt-3 fw-bold">💺 Seat Layout Builder</h5>

                <table className="table table-bordered align-middle">
                  <thead className="table-secondary text-center">
                    <tr>
                      <th>Row</th>
                      <th>Seats</th>
                      <th>Type</th>
                      <th>Price ₹</th>
                      <th></th>
                    </tr>
                  </thead>

                  <tbody>
                    {seatRows.map((r, i) => (
                      <tr key={i}>
                        <td>
                          <input className="form-control text-center"
                            value={r.row}
                            onChange={(e) => updateRow(i, "row", e.target.value)} />
                        </td>

                        <td>
                          <input type="number" className="form-control text-center"
                            value={r.count}
                            onChange={(e) => updateRow(i, "count", e.target.value)} />
                        </td>

                        <td>
                          <select className="form-select"
                            value={r.type}
                            onChange={(e) => updateRow(i, "type", e.target.value)}>
                            <option>REGULAR</option>
                            <option>PREMIUM</option>
                            <option>VIP</option>
                          </select>
                        </td>

                        <td>
                          <input type="number" className="form-control text-center"
                            value={r.basePrice}
                            onChange={(e) => updateRow(i, "basePrice", e.target.value)} />
                        </td>

                        <td className="text-center">
                          <button type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => removeRow(i)}>
                            ❌
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <button type="button"
                  className="btn btn-outline-primary btn-sm"
                  onClick={addRow}>
                  + Add Row
                </button>
              </div>

              {/* ACTION */}
              <div className="col-12 mt-3">
                <button className="btn btn-success me-2" disabled={submitting}>
                  {submitting ? "Saving..." : editingId ? "Update Theater" : "Create Theater"}
                </button>

                {editingId && (
                  <button type="button" className="btn btn-secondary" onClick={resetForm}>
                    Cancel
                  </button>
                )}
              </div>

            </div>
          </form>
        </div>
      </div>

      {/* LIST */}
      <div className="card shadow-lg border-0">
        <div className="card-header fw-bold">🎥 All Theaters</div>

        <table className="table table-hover">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>City</th>
              <th>Screens</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {list.map((t) => (
              <tr key={t.id}>
                <td>{t.name}</td>
                <td>{t.city}</td>
                <td>
                  <span className="badge bg-primary">{t.screens}</span>
                </td>
                <td className="text-center">
                  <button className="btn btn-info btn-sm me-2"
                    onClick={() => setViewTheater(t)}>
                    👁 View
                  </button>

                  <button className="btn btn-primary btn-sm me-2"
                    onClick={() => handleEdit(t)}>
                    ✏️ Edit
                  </button>

                  <button className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(t.id)}>
                    🗑 Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* VIEW MODAL */}
      {viewTheater && (
        <div className="modal show d-block">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-dark text-white">
                <h5>{viewTheater.name}</h5>
                <button className="btn-close btn-close-white"
                  onClick={() => setViewTheater(null)} />
              </div>

              <div className="modal-body">
                <p><b>City:</b> {viewTheater.city}</p>
                <p><b>Screens:</b> {viewTheater.screens}</p>

                <h6 className="fw-bold mt-3">Seat Layout</h6>
                <ul>
                  {viewTheater.seatLayout?.map((s, i) => (
                    <li key={i}>
                      Row {s.row} → {s.count} seats ({s.type}) ₹{s.basePrice}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ManageTheaters;
