import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMovies } from "../store/movieSlice";
import { fetchTheaters } from "../store/theaterSlice";
import { fetchShows } from "../store/showSlice";
import { fetchAllBookings } from "../store/bookingSlice";
import { fetchAllUsers } from "../store/userSlice";
import { Link } from "react-router-dom";


const AdminDashboard = () => {
  const dispatch = useDispatch();

  const movies = useSelector((s) => s.movie.list) || [];
  const theaters = useSelector((s) => s.theater.list) || [];
  const shows = useSelector((s) => s.show.list) || [];
  const bookings = useSelector((s) => s.booking.allBookings?.content) || [];
  const users = useSelector((s) => s.user.users) || [];

  useEffect(() => {
    dispatch(fetchMovies());
    dispatch(fetchTheaters());
    dispatch(fetchShows());
    dispatch(fetchAllBookings({ page: 0, size: 5 }));
    dispatch(fetchAllUsers());
  }, [dispatch]);

  return (
    <div className="admin-dashboard">
      
      <div className="container mt-4">
        <h1 className="mb-4 text-center fw-bold text-primary">Admin Dashboard</h1>

        <div className="row g-4">
          <div className="col-md-4">
            <div className="card shadow-sm h-100">
              <div className="card-body text-center">
                <h3 className="card-title">Movies</h3>
                <p className="card-text">{movies.length} total</p>
                <Link to="/admin/movies" className="btn btn-outline-primary w-100">
                  Manage Movies
                </Link>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm h-100">
              <div className="card-body text-center">
                <h3 className="card-title">Theaters</h3>
                <p className="card-text">{theaters.length} total</p>
                <Link to="/admin/theaters" className="btn btn-outline-primary w-100">
                  Manage Theaters
                </Link>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm h-100">
              <div className="card-body text-center">
                <h3 className="card-title">Shows</h3>
                <p className="card-text">{shows.length} total</p>
                <Link to="/admin/shows" className="btn btn-outline-primary w-100">
                  Manage Shows
                </Link>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm h-100">
              <div className="card-body text-center">
                <h3 className="card-title">Seats</h3>
                <p className="card-text">Seat layouts per theater</p>
                <Link to="/admin/seats" className="btn btn-outline-primary w-100">
                  Manage Seats
                </Link>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm h-100">
              <div className="card-body text-center">
                <h3 className="card-title">Bookings</h3>
                <p className="card-text">{bookings.length} recent</p>
                <Link to="/admin/bookings" className="btn btn-outline-primary w-100">
                  Manage Bookings
                </Link>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm h-100">
              <div className="card-body text-center">
                <h3 className="card-title">Users</h3>
                <p className="card-text">{users.length} total</p>
                <Link to="/admin/users" className="btn btn-outline-primary w-100">
                  Manage Users
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
