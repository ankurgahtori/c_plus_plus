# Movie Ticket Booking (BookMyShow) - Low Level Design (LLD)

## Overview

Movie ticket booking system: list shows, book/cancel seats, notify on booking.

## Requirements

- List movies and shows by cinema
- Book/cancel seats
- Seat availability
- Notify users on booking (Observer)

## Design Patterns

- **Observer**: Notify users when seat is booked
- **Factory**: Create Show, Movie, Cinema

## Core Components

- **Cinema**: has screens
- **Screen**: has seats
- **Show**: movie + screen + time
- **Booking**: user + seats + show
- **NotificationService**: Observer pattern
