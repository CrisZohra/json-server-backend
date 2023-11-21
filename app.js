require("dotenv").config();
const jsonServer = require("json-server");
const morgan = require("morgan");

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
const PORT = process.env.PORT || 4001;

server.use(middlewares);
server.use(morgan("dev"));
server.use((req, res, next) => {
  // Middleware to disable CORS
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

server.use(middlewares);

server.get("/posts/search", (req, res) => {
  const query = req.query.q;
  const posts = router.db.get("posts").value();
  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(query.toLowerCase()) ||
      post.location.toLowerCase().includes(query.toLowerCase()) ||
      post.description.toLowerCase().includes(query.toLowerCase()) ||
      post.category.toLowerCase().includes(query.toLowerCase())
  );
  res.json(filteredPosts);
});

server.use(router);

server.listen(PORT, () => {
  console.log(`JSON Server is running at port ${PORT}`);
});
