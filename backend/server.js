// //src/server.js
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const judgeRoute = require('./codeRunner');
// const userRoutes = require('./routes/userRoutes');

// const app = express();

// app.use(cors());
// app.use(express.json());

// // MongoDB Connection
// mongoose.connect('mongodb://localhost:27017/codejudge', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => console.log('✅ MongoDB connected'))
// .catch(err => console.error('❌ MongoDB connection error:', err));

// // Test route
// app.get('/', (req, res) => {
//   res.send('🚀 CodeJudge API is running');
// });

// // API Routes
// app.use('/api/contest', require('./routes/contestRoutes'));
// app.use('/api/problem', require('./routes/problemRoutes'));
// app.use('/api/judge', judgeRoute);
// app.use('/api/users', userRoutes);

// // Start Server
// const PORT = 5000;
// app.listen(PORT, () => {
//   console.log(`🟢 Server running on http://localhost:${PORT}`);
// });








//src/server.js
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const judgeRoute = require('./codeRunner');
// const userRoutes = require('./routes/userRoutes');
// const submissionRoutes = require('./routes/submissionRoutes');

// const app = express();

// app.use(cors());
// app.use(express.json());

// // MongoDB Connection
// mongoose.connect('mongodb://localhost:27017/codejudge', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => console.log('✅ MongoDB connected'))
// .catch(err => console.error('❌ MongoDB connection error:', err));

// // Test route
// app.get('/', (req, res) => {
//   res.send('🚀 CodeJudge API is running');
// });

// // API Routes
// app.use('/api/contest', require('./routes/contestRoutes'));
// app.use('/api/problem', require('./routes/problemRoutes'));
// app.use('/api/judge', judgeRoute);
// app.use('/api/users', userRoutes);
// app.use('/api/submissions', submissionRoutes);

// // Start Server
// const PORT = 5000;
// app.listen(PORT, () => {
//   console.log(`🟢 Server running on http://localhost:${PORT}`);
// });




// // src/server.js
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const judgeRoute = require('./codeRunner');
// const userRoutes = require('./routes/userRoutes');
// const submissionRoutes = require('./routes/submissionRoutes');

// const app = express();

// app.use(cors());
// app.use(express.json());

// // MongoDB Connection
// mongoose.connect('mongodb://localhost:27017/codejudge', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => console.log('✅ MongoDB connected'))
// .catch(err => console.error('❌ MongoDB connection error:', err));

// // Test route
// app.get('/', (req, res) => {
//   res.send('🚀 CodeJudge API is running');
// });

// // API Routes
// app.use('/api/contest', require('./routes/contestRoutes'));
// app.use('/api/problem', require('./routes/problemRoutes'));
// app.use('/api/judge', judgeRoute);
// app.use('/api/users', userRoutes);
// app.use('/api/submissions', submissionRoutes);

// // Start Server
// const PORT = 5000;
// app.listen(PORT, () => {
//   console.log(`🟢 Server running on http://localhost:${PORT}`);
// });










// src/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const judgeRoute = require('./codeRunner');
const userRoutes = require('./routes/userRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const leaderboardRoutes=require('./routes/leaderboardRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/codejudge', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Test route
app.get('/', (req, res) => {
  res.send('🚀 CodeJudge API is running');
});

// API Routes
app.use('/api/contest', require('./routes/contestRoutes'));
app.use('/api/problem', require('./routes/problemRoutes'));
app.use('/api/judge', judgeRoute);
app.use('/api/users', userRoutes);
app.use('/api/submissions', submissionRoutes); 
app.use('/api/leaderboard', leaderboardRoutes); 

// Start Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🟢 Server running on http://localhost:${PORT}`);
});
