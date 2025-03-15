import express from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";

const app = express();
app.use(express.json());

let users = [
  {
    username: "mohamed-msila",
    password: "mohamed2024",
  },
  {
    username: "amina-msila",
    password: "amina2024",
  },
];

let posts = [
  {
    title: "Post 1",
    author: "mohamed-msila",
  },
  {
    title: "Post 2",
    author: "amina-msila",
  },
];

// get post of a specific user
// user should authenticate
// then authorization is performed based on username
app.get("/posts", tokenAuth, async (req, res) => {
  const username = req.body.username;
  res.json(posts.filter((post) => post.author === username));
});

// create a post by a specific user
// user should authenticate
app.post("/posts", tokenAuth, async (req, res) => {
  const { title, username } = req.body;
  if (!username || !title) {
    return res.send("Both username and title are required");
  }
  const newPost = { title, author: username };
  posts.push(newPost);
  res.send("Post created successfully");
});

// also called signin
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  // Check username and password value existence
  if (!username || !password) {
    return res.send("Both username and password are required");
  }
  // Check user existence
  const exist = users.find((user) => user.username === username);
  if (!exist) {
    return res.send("Invalid username or password");
  }
  // Check password matching
  if (exist.password !== password) {
    return res.send("Invalid username or password");
  }

  // create and sign a jwt token

  const token = jwt.sign({ username }, process.env.TOKEN_SECRET, {
    expiresIn: "7d",
  });
  return res.json({ token });
});

// also called sigin
function tokenAuth(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.send("Invalid Authorization Header");
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.send("Invalid Authorization Header");
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    console.log(decoded.username);
    // return res.send(decoded);
    next();
    // return res.json(decoded);
  } catch (error) {
    return res.json(error.message);
  }
}

const PORT = 2000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
