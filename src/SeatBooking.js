import React, { useState } from 'react';
import './SeatBooking.css';

const SEAT_STATUS = {
    AVAILABLE: 'available',
    SELECTED: 'selected',
    BOOKED: 'booked'
};

const SEAT_PRICES = {
    PREMIUM: 1000,  // Rows A-C (0-2)
    STANDARD: 750,  // Rows D-F (3-5)
    ECONOMY: 500    // Rows G-H (6-7)
};

const MAX_SEATS_PER_BOOKING = 8;
const STORAGE_KEY = 'greenstitch-booked-seats';

const SeatBooking = () => {
    const ROWS = 8;
    const SEATS_PER_ROW = 10;

    const initializeSeats = () => {
        const seats = [];
        for (let row = 0; row < ROWS; row++) {
            const rowSeats = [];
            for (let seat = 0; seat < SEATS_PER_ROW; seat++) {
                rowSeats.push({
                    id: `${row}-${seat}`,
                    row: row,
                    seat: seat,
                    status: SEAT_STATUS.AVAILABLE
                });
            }
            seats.push(rowSeats);
        }
        return seats;
    };

    const loadPersistedSeats = () => {
        const baseSeats = initializeSeats();
        if (typeof window === 'undefined') return baseSeats;

        try {
            const persisted = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            if (!Array.isArray(persisted) || persisted.length === 0) {
                return baseSeats;
            }
            return baseSeats.map(row =>
                row.map(seat =>
                    persisted.includes(seat.id)
                        ? { ...seat, status: SEAT_STATUS.BOOKED }
                        : seat
                )
            );
        } catch (error) {
            console.error('Failed to parse persisted seats', error);
            return baseSeats;
        }
    };

    const [seats, setSeats] = useState(loadPersistedSeats);
    const [feedback, setFeedback] = useState({ type: '', message: '' });

    const showFeedback = (message, type = 'info') => setFeedback({ message, type });
    const clearFeedback = () => setFeedback({ message: '', type: '' });

    const persistBookedSeats = (grid) => {
        if (typeof window === 'undefined') return;
        const bookedIds = [];
        grid.forEach(row =>
            row.forEach(seat => {
                if (seat.status === SEAT_STATUS.BOOKED) {
                    bookedIds.push(seat.id);
                }
            })
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(bookedIds));
    };

    // TODO: Implement all required functionality below

    const getSeatPrice = (row) => {
        if (row <= 2) return SEAT_PRICES.PREMIUM;
        if (row <= 5) return SEAT_PRICES.STANDARD;
        return SEAT_PRICES.ECONOMY;
    };

    const getSelectedCount = () =>
        seats.reduce(
            (total, row) =>
                total +
                row.reduce(
                    (rowTotal, seat) =>
                        rowTotal + (seat.status === SEAT_STATUS.SELECTED ? 1 : 0),
                    0
                ),
            0
        );

    const getBookedCount = () =>
        seats.reduce(
            (total, row) =>
                total +
                row.reduce(
                    (rowTotal, seat) =>
                        rowTotal + (seat.status === SEAT_STATUS.BOOKED ? 1 : 0),
                    0
                ),
            0
        );

    const getAvailableCount = () => ROWS * SEATS_PER_ROW - getSelectedCount() - getBookedCount();

    const calculateTotalPrice = () =>
        seats.reduce(
            (total, row, rowIndex) =>
                total +
                row.reduce(
                    (rowTotal, seat) =>
                        rowTotal +
                        (seat.status === SEAT_STATUS.SELECTED ? getSeatPrice(rowIndex) : 0),
                    0
                ),
            0
        );

    const violatesContinuityRule = (rowSeats) => {
        for (let i = 1; i < rowSeats.length - 1; i++) {
            const current = rowSeats[i];
            if (current.status !== SEAT_STATUS.AVAILABLE) continue;

            const left = rowSeats[i - 1];
            const right = rowSeats[i + 1];

            const leftBlocked = left.status === SEAT_STATUS.SELECTED || left.status === SEAT_STATUS.BOOKED;
            const rightBlocked = right.status === SEAT_STATUS.SELECTED || right.status === SEAT_STATUS.BOOKED;

            if (leftBlocked && rightBlocked) {
                return true;
            }
        }
        return false;
    };

    const handleSeatClick = (row, seat) => {
        const seatData = seats[row][seat];
        if (seatData.status === SEAT_STATUS.BOOKED) {
            showFeedback('This seat is already booked.', 'error');
            return;
        }

        const isSelecting = seatData.status !== SEAT_STATUS.SELECTED;
        if (isSelecting && getSelectedCount() >= MAX_SEATS_PER_BOOKING) {
            showFeedback(`You can select up to ${MAX_SEATS_PER_BOOKING} seats per booking.`, 'error');
            return;
        }

        const updatedSeats = seats.map((rowSeats, rowIndex) =>
            rowSeats.map((seatItem, seatIndex) => {
                if (rowIndex === row && seatIndex === seat) {
                    return {
                        ...seatItem,
                        status: seatItem.status === SEAT_STATUS.SELECTED
                            ? SEAT_STATUS.AVAILABLE
                            : SEAT_STATUS.SELECTED
                    };
                }
                return seatItem;
            })
        );

        if (violatesContinuityRule(updatedSeats[row])) {
            showFeedback('Seat selection cannot isolate an available seat between selected or booked seats.', 'error');
            return;
        }

        setSeats(updatedSeats);
        clearFeedback();
    };

    const handleBookSeats = () => {
        const selectedSeats = [];
        seats.forEach(row =>
            row.forEach(seat => {
                if (seat.status === SEAT_STATUS.SELECTED) {
                    selectedSeats.push(seat);
                }
            })
        );

        if (selectedSeats.length === 0) {
            showFeedback('Select seats before booking.', 'error');
            return;
        }

        if (selectedSeats.length > MAX_SEATS_PER_BOOKING) {
            showFeedback(`You can book a maximum of ${MAX_SEATS_PER_BOOKING} seats at once.`, 'error');
            return;
        }

        const totalPrice = selectedSeats.reduce((sum, seat) => sum + getSeatPrice(seat.row), 0);
        const seatLabels = selectedSeats
            .map(seat => `${String.fromCharCode(65 + seat.row)}${seat.seat + 1}`)
            .join(', ');

        const confirmed = window.confirm(
            `You're booking ${selectedSeats.length} seat(s): ${seatLabels}\nTotal Price: ₹${totalPrice}\nProceed?`
        );

        if (!confirmed) {
            showFeedback('Booking cancelled.', 'info');
            return;
        }

        const updatedSeats = seats.map(row =>
            row.map(seat =>
                seat.status === SEAT_STATUS.SELECTED
                    ? { ...seat, status: SEAT_STATUS.BOOKED }
                    : seat
            )
        );

        setSeats(updatedSeats);
        persistBookedSeats(updatedSeats);
        showFeedback('Seats booked successfully!', 'success');
    };

    const handleClearSelection = () => {
        if (getSelectedCount() === 0) {
            showFeedback('There are no seats to clear.', 'info');
            return;
        }

        const updatedSeats = seats.map(row =>
            row.map(seat =>
                seat.status === SEAT_STATUS.SELECTED
                    ? { ...seat, status: SEAT_STATUS.AVAILABLE }
                    : seat
            )
        );
        setSeats(updatedSeats);
        showFeedback('Selection cleared.', 'info');
    };

    const handleReset = () => {
        const confirmed = window.confirm('Reset all seats and clear booking history?');
        if (!confirmed) return;

        const resetSeats = initializeSeats();
        setSeats(resetSeats);
        if (typeof window !== 'undefined') {
            localStorage.removeItem(STORAGE_KEY);
        }
        showFeedback('All seats have been reset.', 'success');
    };

    return (
        <div className="seat-booking-container">
            <h1>GreenStitch Seat Booking System</h1>

            {feedback.message && (
                <div className={`feedback-message ${feedback.type}`}>
                    {feedback.message}
                </div>
            )}

            <div className="info-panel">
                <div className="info-item">
                    <span className="info-label">Available:</span>
                    <span className="info-value">{getAvailableCount()}</span>
                </div>
                <div className="info-item">
                    <span className="info-label">Selected:</span>
                    <span className="info-value">{getSelectedCount()}</span>
                </div>
                <div className="info-item">
                    <span className="info-label">Booked:</span>
                    <span className="info-value">{getBookedCount()}</span>
                </div>
            </div>

            <div className="legend">
                <div className="legend-item">
                    <div className="seat-demo available"></div>
                    <span>Available</span>
                </div>
                <div className="legend-item">
                    <div className="seat-demo selected"></div>
                    <span>Selected</span>
                </div>
                <div className="legend-item">
                    <div className="seat-demo booked"></div>
                    <span>Booked</span>
                </div>
            </div>

            <div className="seat-grid">
                {seats.map((row, rowIndex) => (
                    <div key={rowIndex} className="seat-row">
                        <div className="row-label">{String.fromCharCode(65 + rowIndex)}</div>
                        {row.map((seat, seatIndex) => (
                            <div
                                key={seat.id}
                                className={`seat ${seat.status}`}
                                onClick={() => handleSeatClick(rowIndex, seatIndex)}
                            >
                                {seatIndex + 1}
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            <div className="pricing-info">
                <p>Selected Seats Total: <strong>₹{calculateTotalPrice()}</strong></p>
                <p className="price-note">Premium (A-C): ₹1000 | Standard (D-F): ₹750 | Economy (G-H): ₹500</p>
            </div>

            <div className="control-panel">
                <button
                    className="btn btn-book"
                    onClick={handleBookSeats}
                    disabled={getSelectedCount() === 0}
                >
                    Book Selected Seats ({getSelectedCount()})
                </button>
                <button
                    className="btn btn-clear"
                    onClick={handleClearSelection}
                    disabled={getSelectedCount() === 0}
                >
                    Clear Selection
                </button>
                <button
                    className="btn btn-reset"
                    onClick={handleReset}
                >
                    Reset All
                </button>
            </div>
        </div>
    );
};

export default SeatBooking;
