const transactions = [
    // April 5th 2025
    {
      id: "t023",
      amount: -15.00,
      title: "bluebottle",
      type: "EXPENSE",
      date: "2025-04-05",
      method: "Credit Card",
      category: {
        main: "Beverage",
        sub: "Coffee"
      },
      notes: "morning coffee & sandwich"
    },
    {
      id: "t024",
      amount: -20.00,
      title: "headphone",
      type: "EXPENSE",
      date: "2025-04-05",
      method: "Cash",
      category: {
        main: "Utilities",
        sub: ""
      },
      notes: ""
    },
    {
      id: "t025",
      amount: 1000.00,
      title: "paycheck",
      type: "INCOME",
      date: "2025-04-05",
      method: "Transfer",
      category: {
        main: "Income",
        sub: "Salary"
      },
      notes: ""
    },

    // March 21st 2025
    {
      id: "t001",
      amount: -5.00,
      title: "coffee at X cafe",
      type: "EXPENSE",
      date: "2025-03-21",
      method: "Credit Card",
      category: {
        main: "Beverage",
        sub: "Coffee"
      },
      notes: "morning coffee"
    },
    {
      id: "t002",
      amount: -15.00,
      title: "book",
      type: "EXPENSE",
      date: "2025-03-21",
      method: "Cash",
      category: {
        main: "Education",
        sub: ""
      },
      notes: "design book"
    },
    {
      id: "t003",
      amount: 1000.00,
      title: "paycheck",
      type: "INCOME",
      date: "2025-03-21",
      method: "Transfer",
      category: {
        main: "Income",
        sub: "Salary"
      },
      notes: ""
    },
  
    // March 10th 2025
    {
      id: "t004",
      amount: -10.00,
      title: "theater",
      type: "EXPENSE",
      date: "2025-03-10",
      method: "Credit Card",
      category: {
        main: "Entertainment",
        sub: "Movies"
      },
      notes: ""
    },
    {
      id: "t005",
      amount: -50.00,
      title: "jacket",
      type: "EXPENSE",
      date: "2025-03-10",
      method: "Cash",
      category: {
        main: "Shopping",
        sub: "Clothing"
      },
      notes: "new spring jacket"
    },
    {
      id: "t006",
      amount: 50.00,
      title: "venmo",
      type: "INCOME",
      date: "2025-03-10",
      method: "Transfer",
      category: {
        main: "Income",
        sub: "Transfer"
      },
      notes: "from friend"
    },
  
    // March 5th 2025
    {
      id: "t007",
      amount: -10.00,
      title: "theater",
      type: "EXPENSE",
      date: "2025-03-05",
      method: "Credit Card",
      category: {
        main: "Entertainment",
        sub: "Movies"
      },
      notes: ""
    },
    {
      id: "t008",
      amount: -50.00,
      title: "jacket",
      type: "EXPENSE",
      date: "2025-03-05",
      method: "Cash",
      category: {
        main: "Shopping",
        sub: "Clothing"
      },
      notes: ""
    },
    {
      id: "t009",
      amount: 50.00,
      title: "venmo",
      type: "INCOME",
      date: "2025-03-05",
      method: "Transfer",
      category: {
        main: "Income",
        sub: "Transfer"
      },
      notes: "refund"
    },

    // February 2025
    {
        id: "t010",
        amount: -30.00,
        title: "movie night",
        type: "EXPENSE",
        date: "2025-02-14",
        method: "Credit Card",
        category: {
          main: "Entertainment",
          sub: "Movies"
        },
        notes: "valentine"
    },
    {
        id: "t011",
        amount: -12.00,
        title: "lunch at deli",
        type: "EXPENSE",
        date: "2025-02-14",
        method: "Cash",
        category: {
          main: "Food",
          sub: "Restaurants"
        },
        notes: ""
    },
    {
        id: "t012",
        amount: 500.00,
        title: "freelance payment",
        type: "INCOME",
        date: "2025-02-07",
        method: "Transfer",
        category: {
          main: "Income",
          sub: "Freelance"
        },
        notes: "client work"
    },

    // January 2025
    {
        id: "t020",
        amount: -2.75,
        title: "bus fare",
        type: "EXPENSE",
        date: "2025-01-22",
        method: "Cash",
        category: {
          main: "Transport",
          sub: "Bus"
        },
        notes: ""
    },
    {
        id: "t021",
        amount: -45.00,
        title: "hoodie",
        type: "EXPENSE",
        date: "2025-01-19",
        method: "Credit Card",
        category: {
          main: "Shopping",
          sub: "Clothing"
        },
        notes: "gift for brother"
    },
    {
        id: "t022",
        amount: 1200.00,
        title: "salary",
        type: "INCOME",
        date: "2025-01-15",
        method: "Transfer",
        category: {
          main: "Income",
          sub: "Salary"
        },
        notes: ""
    }
  ];