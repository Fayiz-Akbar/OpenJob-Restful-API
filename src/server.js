require('dotenv').config();
const express = require('express');
const authenticate = require('./middlewares/auth.middleware'); // <- Import middleware

const usersRoutes = require('./routes/users.route');
const authenticationsRoutes = require('./routes/authentications.route');
const companiesRoutes = require('./routes/companies.route');
const categoriesRoutes = require('./routes/categories.route');
const jobsRoutes = require('./routes/jobs.route');
const applicationsRoutes = require('./routes/applications.route'); // <- Import Applications
const bookmarksRoutes = require('./routes/bookmarks.route'); // <- Import Bookmarks
const profileRoutes = require('./routes/profile.route');
const { addBookmark, getBookmarkById, deleteBookmark } = require('./controllers/bookmark.controller'); // <- Import Controller Bookmark untuk nested route

const errorMiddleware = require('./middlewares/error.middleware');

const app = express();
const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';

app.use(express.json());

app.use('/users', usersRoutes);
app.use('/authentications', authenticationsRoutes);
app.use('/companies', companiesRoutes);
app.use('/categories', categoriesRoutes);
app.use('/jobs', jobsRoutes);
app.use('/applications', applicationsRoutes); // <- Daftarkan Applications
app.use('/bookmarks', bookmarksRoutes); // <- Daftarkan Bookmarks utama
app.use('/profile', profileRoutes);

// Nested Routes untuk Bookmarks yang format URL-nya berawal dengan /jobs/:jobId/bookmark
app.post('/jobs/:jobId/bookmark', authenticate, addBookmark);
app.get('/jobs/:jobId/bookmark/:id', authenticate, getBookmarkById);
app.delete('/jobs/:jobId/bookmark', authenticate, deleteBookmark);

app.use(errorMiddleware);

app.listen(port, host, () => {
  console.log(`Server OpenJob berjalan di http://${host}:${port}`);
});