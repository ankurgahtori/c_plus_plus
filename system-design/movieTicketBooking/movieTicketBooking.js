/**
 * Movie Ticket Booking - Observer pattern for notifications
 */

class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }
  notify(message) {
    console.log(`[${this.email}] ${message}`);
  }
}

class Seat {
  constructor(id, row, col) {
    this.id = id;
    this.row = row;
    this.col = col;
    this.isBooked = false;
  }
}

class Screen {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.seats = [];
  }
  addSeats(rows, cols) {
    let id = 1;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        this.seats.push(new Seat(id++, r, c));
      }
    }
  }
  getAvailableSeats() {
    return this.seats.filter(s => !s.isBooked);
  }
}

class Show {
  constructor(movieName, screen, time) {
    this.movieName = movieName;
    this.screen = screen;
    this.time = time;
    this.observers = [];
  }
  subscribe(observer) { this.observers.push(observer); }
  notifyAll(message) { this.observers.forEach(o => o.notify(message)); }
}

class Booking {
  constructor(user, show, seats) {
    this.user = user;
    this.show = show;
    this.seats = seats;
    this.id = `BKG-${Date.now()}`;
  }
}

class BookingService {
  book(user, show, seatIds) {
    const seats = show.screen.seats.filter(s => seatIds.includes(s.id) && !s.isBooked);
    if (seats.length !== seatIds.length) throw new Error('Some seats unavailable');
    seats.forEach(s => s.isBooked = true);
    const booking = new Booking(user, show, seats);
    show.subscribe(user);
    show.notifyAll(`Booking ${booking.id}: ${seats.length} seats for ${show.movieName}`);
    return booking;
  }
}

// Demo
if (require.main === module) {
  const screen = new Screen(1, 'Screen 1');
  screen.addSeats(2, 3);
  const show = new Show('Inception', screen, '7:00 PM');
  const user = new User('Alice', 'alice@mail.com');
  const service = new BookingService();
  const booking = service.book(user, show, [1, 2]);
  console.log('Booking:', booking.id);
}

module.exports = { BookingService, Show, Screen, User };
