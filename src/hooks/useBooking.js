// src/hooks/useBookings.js
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  createBooking,
  fetchBookingById,
  fetchMyBookings,
  cancelBooking,
  confirmBookingPayment,
  fetchAllBookings,
} from "../store/bookingSlice";
import { api } from "../services/api";

/**
 * useBookings
 *
 * Enhancements:
 * - Keeps all existing action wrappers (create/fetch/cancel/confirm) and returns promises (unwrap).
 * - Adds lightweight client-side enrichment for shows and seats:
 *   - Batch fetches /api/shows?ids=... and /api/seats?ids=... when available.
 *   - Caches results in local hook state to avoid repeated network calls.
 * - Exposes `enrichedList` (bookings with movieTitle, showTime, theaterName, seatNumbers)
 *   while leaving Redux store untouched (store still contains raw BookingResponse objects).
 *
 * Notes:
 * - This file uses the existing axios instance `api` (src/services/api.js).
 * - If your backend does not expose `/api/shows` or `/api/seats`, the hook will gracefully fall back
 *   to showing readable IDs (e.g., `#69e096...`) while still keeping the UI friendly.
 */
const useBooking = () => {
  const booking = useSelector((s) => s.booking);
  const dispatch = useDispatch();

  // Local caches for enrichment
  const [showsMap, setShowsMap] = useState({}); // { showId: { id, movieTitle, showTime, theaterName } }
  const [seatsMap, setSeatsMap] = useState({}); // { seatId: { id, seatNumber } }
  const [enriching, setEnriching] = useState(false);

  // Stable action wrappers (return promises)
  const createBookingAction = useCallback(
    (payload) => dispatch(createBooking(payload)).unwrap(),
    [dispatch]
  );

  const fetchBookingByIdAction = useCallback(
    (id) => dispatch(fetchBookingById(id)).unwrap(),
    [dispatch]
  );

  const fetchMyBookingsAction = useCallback(
    (params = { page: 0, size: 10 }) => dispatch(fetchMyBookings(params)).unwrap(),
    [dispatch]
  );

  const cancelBookingAction = useCallback(
    (id) => dispatch(cancelBooking(id)).unwrap(),
    [dispatch]
  );

  const confirmBookingPaymentAction = useCallback(
    (id, paymentId) => dispatch(confirmBookingPayment({ id, paymentId })).unwrap(),
    [dispatch]
  );

  const fetchAllBookingsAction = useCallback(
    (params = { page: 0, size: 10 }) => dispatch(fetchAllBookings(params)).unwrap(),
    [dispatch]
  );

  // Helper: batch fetch shows by ids (graceful)
  const fetchShows = useCallback(async (ids = []) => {
    if (!ids || ids.length === 0) return {};
    // filter out already cached
    const toFetch = ids.filter((id) => !showsMap[id]);
    if (toFetch.length === 0) return showsMap;

    try {
      const params = new URLSearchParams();
      params.set("ids", toFetch.join(","));
      const res = await api.get(`/shows?${params.toString()}`);
      // backend may return ApiResponse wrapper or raw array
      const payload = res?.data ?? res;
      const arr = Array.isArray(payload) ? payload : payload?.data ?? [];
      const map = { ...showsMap };
      arr.forEach((s) => {
        if (s && s.id) {
          map[s.id] = s;
        }
      });
      setShowsMap(map);
      return map;
    } catch (e) {
      // endpoint missing or error — ignore and return existing cache
      return showsMap;
    }
  }, [showsMap]);

  // Helper: batch fetch seats by ids (graceful)
  const fetchSeats = useCallback(async (ids = []) => {
    if (!ids || ids.length === 0) return {};
    const toFetch = ids.filter((id) => !seatsMap[id]);
    if (toFetch.length === 0) return seatsMap;

    try {
      const params = new URLSearchParams();
      params.set("ids", toFetch.join(","));
      const res = await api.get(`/seats?${params.toString()}`);
      const payload = res?.data ?? res;
      const arr = Array.isArray(payload) ? payload : payload?.data ?? [];
      const map = { ...seatsMap };
      arr.forEach((s) => {
        if (s && s.id) {
          map[s.id] = s;
        }
      });
      setSeatsMap(map);
      return map;
    } catch (e) {
      return seatsMap;
    }
  }, [seatsMap]);

  // Whenever the booking.list changes, attempt to enrich missing show/seat data
  useEffect(() => {
    let mounted = true;
    const enrich = async () => {
      if (!mounted) return;
      const list = booking.list || [];
      if (list.length === 0) return;

      setEnriching(true);
      try {
        // collect unique ids
        const showIds = Array.from(new Set(list.map((b) => b.showId).filter(Boolean)));
        const seatIds = Array.from(new Set(list.flatMap((b) => b.seatIds || []).filter(Boolean)));

        // fetch both in parallel
        await Promise.all([fetchShows(showIds), fetchSeats(seatIds)]);
      } finally {
        if (mounted) setEnriching(false);
      }
    };

    enrich();

    return () => {
      mounted = false;
    };
  }, [booking.list, fetchShows, fetchSeats]);

  // Build enriched list (does not mutate store)
  const enrichedList = useMemo(() => {
    const list = booking.list || [];
    return list.map((b) => {
      const show = b.showId ? showsMap[b.showId] : null;
      const seatNumbers = (b.seatIds || []).map((id) => {
        const s = seatsMap[id];
        if (!s) return `#${id}`;
        // prefer seatNumber, fallback to label/number/id
        return s.seatNumber ?? s.number ?? s.label ?? `#${id}`;
      });

      return {
        ...b,
        movieTitle: show?.movieTitle ?? show?.movieName ?? null,
        showTime: show?.showTime ?? null,
        theaterName: show?.theaterName ?? null,
        seatNumbers,
      };
    });
  }, [booking.list, showsMap, seatsMap]);

  return {
    // state
    current: booking.current,
    list: booking.list,
    enrichedList, // friendly list for UI
    allBookings: booking.allBookings,
    pageable: booking.pageable,
    loading: booking.loading || enriching,
    error: booking.error,

    // actions
    createBooking: createBookingAction,
    fetchBookingById: fetchBookingByIdAction,
    fetchMyBookings: fetchMyBookingsAction,
    cancelBooking: cancelBookingAction,
    confirmBookingPayment: confirmBookingPaymentAction,
    fetchAllBookings: fetchAllBookingsAction,
  };
};

export default useBooking;
