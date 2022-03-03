const app = require('./index')

// api routes for users
app.use('/v1', require('./users/users.controller'));

// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
app.listen(port, () => console.log('Server listening on port ' + port));