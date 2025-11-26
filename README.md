## GreenStitch Seat Booking
##LiveLink -- https://seatbookavailablity.netlify.app/
A single-page React application built for the GreenStitch Frontend Assessment. It simulates an airline/theatre style seat booking experience with tier-based pricing, continuity validation, and local persistence of confirmed bookings.

### Features
- Seat grid with 8 rows (A–H) × 10 seats and color-coded availability states.
- Tiered pricing (Premium ₹1000, Standard ₹750, Economy ₹500) with live total.
- Selection guardrails: max 8 seats per booking and no isolated seats rule.
- Booking flow with confirmation modal, success/error feedback, and localStorage persistence.
- Quick actions to clear the current selection or reset the full layout.

### Tech Stack
- React 18 with CRA (`react-scripts`)
- CSS modules for styling (`src/SeatBooking.css`)
- Testing libraries shipped with CRA (Jest + Testing Library)

### Getting Started
1. Install dependencies:
   ```
   npm install
   ```
2. Start the development server:
   ```
   npm start
   ```
   The app runs on `http://localhost:3000` by default.
3. Build for production:
   ```
   npm run build
   ```
4. Run unit tests (if/when added):
   ```
   npm test
   ```

### Project Structure
```
public/                # CRA static assets & HTML template
src/
  App.js               # Root component wiring SeatBooking
  SeatBooking.js       # Booking logic, pricing, persistence, UI
  SeatBooking.css      # Component styles & responsive tweaks
  index.js / index.css # CRA entry point and global styles
package.json           # Scripts, dependencies, project metadata
```

### Booking Rules
- **Seat Tiers**: Rows A–C Premium, D–F Standard, G–H Economy.
- **Max Selection**: 8 seats can be selected/booked per transaction.
- **Continuity**: Selections cannot leave a single available seat trapped between booked or selected seats in the same row.
- **Persistence**: Confirmed bookings are stored in `localStorage` under `greenstitch-booked-seats`.

### Future Enhancements
- Add automated tests for continuity logic and persistence.
- Integrate real backend APIs for seat status and payments.
- Improve accessibility with keyboard navigation and ARIA roles.
- Display seat legends/pricing dynamically from configuration.

### License
This project inherits the licensing terms provided with the GreenStitch assessment. Adjust or add a license here as needed.


