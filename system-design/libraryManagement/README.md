# Library Management System - Low Level Design (LLD)

## Overview

Library system: add books, issue/return, track members, fines.

## Requirements

- Add/remove books
- Issue book to member
- Return book, calculate fine if overdue
- Search books by title/author

## Core Components

- **Book**: id, title, author, isAvailable
- **Member**: id, name, borrowedBooks
- **Library**: catalog, members, issue/return logic
- **FineCalculator**: Strategy for fine calculation
