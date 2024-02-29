const http = require("http");
const { v4: uuidv4 } = require("uuid");
const errorHandle = require("./errorHandle");
const successHandle = require("./successHandle");

const todos = [
  {
    id: uuidv4(),
    title: "今晚打老虎",
  },
];

const reqListener = (req, res) => {
  const HEADER = {
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, Content-Length, X-Requested-With",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "PATCH, POST, GET,OPTIONS,DELETE",
    "Content-Type": "application/json",
  };

  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });

  if (req.url === "/todos" && req.method === "GET") {
    successHandle(res, todos);
  } else if (req.url === "/todos" && req.method === "POST") {
    req.on("end", () => {
      try {
        const { title } = JSON.parse(body);
        
        if (title !== undefined && title.trim() !== "") {
          const todo = {
            id: uuidv4(),
            title: title,
          };
          todos.push(todo);
          successHandle(res, todos);
        } else {
          errorHandle(res, "請填寫代辦事項");
        }
      } catch (error) {
        errorHandle(res);
      }
    });
  } else if (req.url.startsWith("/todos/") && req.method === "DELETE") {
    const id = req.url.split("/").pop();

    const index = todos.findIndex((item) => item.id === id);

    if (index !== -1) {
      todos.splice(index, 1);
      successHandle(res, todos);
    } else {
      errorHandle(res, "無此代辦事項，請重新操作");
    }
  } else if (req.url === "/todos" && req.method === "DELETE") {
    todos.length = 0;

    successHandle(res, todos);
  } else if (req.url.startsWith("/todos") && req.method === "PATCH") {
    req.on("end", () => {
      try {
        const id = req.url.split("/").pop();

        const title = JSON.parse(body).title;
        const index = todos.findIndex((item) => item.id === id);

        if (title !== undefined && index !== -1) {
          todos[index].title = title;
          successHandle(res, todos);
        } else {
          errorHandle(res, "無此代辦事項，請重新操作");
        }
      } catch (error) {
        errorHandle(res);
      }
    });
  } else if (req.method === "OPTIONS") {
    res.writeHead(200, HEADER);
    res.end();
  } else {
    res.writeHead(404, HEADER);
    res.write(
      JSON.stringify({
        status: "false",
        message: "無此網站路由",
      })
    );
    res.end();
  }
};

const server = http.createServer(reqListener);
server.listen(8080);
