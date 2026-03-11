/**
 * Library Management System - Factory, Strategy (FineCalculator)
 */

class Book {
  constructor(id, title, author) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.isAvailable = true;
    this.borrowedBy = null;
    this.dueDate = null;
  }
}

class Member {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.borrowedBooks = [];
  }
}

class FineCalculator {
  calculate(daysOverdue) {
    throw new Error('Implement');
  }
}

class SimpleFineCalculator extends FineCalculator {
  constructor(ratePerDay = 1) {
    super();
    this.ratePerDay = ratePerDay;
  }
  calculate(daysOverdue) {
    return Math.max(0, daysOverdue) * this.ratePerDay;
  }
}

class Library {
  constructor() {
    this.books = new Map();
    this.members = new Map();
    this.fineCalculator = new SimpleFineCalculator(1);
    this.issuePeriodDays = 14;
  }

  addBook(id, title, author) {
    this.books.set(id, new Book(id, title, author));
  }

  addMember(id, name) {
    this.members.set(id, new Member(id, name));
  }

  issueBook(bookId, memberId) {
    const book = this.books.get(bookId);
    const member = this.members.get(memberId);
    if (!book || !member) throw new Error('Invalid book or member');
    if (!book.isAvailable) throw new Error('Book not available');
    book.isAvailable = false;
    book.borrowedBy = memberId;
    book.dueDate = new Date();
    book.dueDate.setDate(book.dueDate.getDate() + this.issuePeriodDays);
    member.borrowedBooks.push(bookId);
  }

  returnBook(bookId) {
    const book = this.books.get(bookId);
    if (!book) throw new Error('Invalid book');
    if (book.isAvailable) throw new Error('Book not issued');
    const member = this.members.get(book.borrowedBy);
    member.borrowedBooks = member.borrowedBooks.filter(id => id !== bookId);
    const now = new Date();
    const daysOverdue = Math.ceil((now - book.dueDate) / (1000 * 60 * 60 * 24));
    const fine = this.fineCalculator.calculate(daysOverdue);
    book.isAvailable = true;
    book.borrowedBy = null;
    book.dueDate = null;
    return fine;
  }

  searchByTitle(title) {
    return [...this.books.values()].filter(b =>
      b.title.toLowerCase().includes(title.toLowerCase())
    );
  }
}

// Demo
if (require.main === module) {
  const lib = new Library();
  lib.addBook(1, 'Clean Code', 'Robert Martin');
  lib.addMember(1, 'Alice');
  lib.issueBook(1, 1);
  console.log('Issued. Fine on return:', lib.returnBook(1));
}

module.exports = { Library, Book, Member, SimpleFineCalculator };
