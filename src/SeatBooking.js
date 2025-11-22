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

    const [seats, setSeats] = useState(initializeSeats());

    // TODO: Implement all required functionality below

    const getSeatPrice = (row) => { return 0; };
    const getSelectedCount = () => { return 0; };
    const getBookedCount = () => { return 0; };
    const getAvailableCount = () => { return 0; };
    const calculateTotalPrice = () => { return 0; };

    const handleSeatClick = (row, seat) => {
        // TODO: Implement seat selection logic
    };

    const handleBookSeats = () => {
        // TODO: Implement booking logic
    };

    const handleClearSelection = () => {
        // TODO: Implement clear selection logic
    };

    const handleReset = () => {
        // TODO: Implement reset logic
    };

    return (
        <div className="seat-booking-container">
            <h1>GreenStitch Seat Booking System</h1>

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
