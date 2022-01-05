const http = require("http");
const fs = require("fs");

const server = http.createServer((request, response) => {
  const { method, url } = request;
  console.log("listening");
  // 1. /api 200 = `{ message: "Hello! }`
  if (method === "GET" && url === "/api") {
    response.setHeader("Content-Type", "application/json");
    response.statusCode = 200;
    response.write(JSON.stringify({ message: "Hello!" }));
    response.end();
  }

  //2 GET `API/BOOKS`
  if (method === "GET" && url == "/api/books") {
    console.log("in books");
    fs.readFile("./data/books.json", "utf-8", (err, data) => {
      if (err) console.log(err);
      console.log(data);
      response.setHeader("Content-Type", "application/json");
      response.statusCode = 200;
      const booksArr = JSON.parse(data);
      response.write(JSON.stringify({ booksArr }));
      response.end();
    });
  }

  //3 get /api/authors
  if (method === "GET" && url === "/api/authors") {
    console.log("in api/ authors");

    fs.readFile("./data/authors.json", "utf-8", (err, data) => {
      if (err) console.log(err);
      console.log(data);
      response.setHeader("Content-Type", "application/json");
      response.statusCode = 200;
      const authorsArr = JSON.parse(data);
      response.write(JSON.stringify({ authorsArr }));
      response.end();
    });
  }

  // 4 GET `/api/books/:bookId` e.g. `/api/books/1`
  if (url.includes("/api/books/")) {
    if (method === "GET") {
      let id = url.split("/books/")[1];
      console.log("-->", id);
      const newId = Number(id);
      if (url.includes(id)) {
        console.log("in getBookById");
        fs.readFile(`./data/books.json`, "utf-8", (err, data) => {
          if (err) console.log(err);
          response.setHeader("Content-Type", "application/json");
          response.statusCode = 200;
          const books = JSON.parse(data);
          console.log(typeof id);
          console.log("books -->", books);
          const bookByID = books.filter((book) => {
            if (book.bookId === newId) return book;
          });
          console.log(bookByID);
          response.write(JSON.stringify({ bookByID }));
          response.end();
        });
      }
    }
  }

  // 5. Add a POST `/api/books` e.g  `./data/books.json`
  if (method === "POST" && url === "/api/books") {
    let body = "";
    request.on("data", (packet) => {
      body += packet.toString();
    });
    request.on("end", () => {
      // do something with the bod
      const parsedData = JSON.parse(body);
      console.log("parsed -->s", parsedData);

      // ...end
    });
  }
});

server.listen(7090, (err) => {
  if (err) console.log(err);
  else console.log("Server listening on port: 7090");
});
