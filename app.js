const express = require('express')
const { validateMovie, validatePartialMovie } = require('./schemes/movies.js')

const app = express()
const PORT = process.env.PORT ?? 6969
const movies = require('./movies.json')

app.use(express.json())

//get all movies or by their genre
app.get('/movies', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')

  const { genre } = req.query

  if (genre) {
    const filteredMovies = movies.filter((movie) =>
      movie.genre.includes(genre.toLowerCase())
    )
    res.json(filteredMovies)
  }

  res.json(movies)
})

// get a specific movie
app.get('/movies/:id', (req, res) => {
  const { id } = req.params
  const movie = movies.find((movie) => movie.id === id)
  if (movie) res.json(movie)
  res.status(404).json({ message: 'Movie not found' })
})

//add
app.post('/movies', (req, res) => {
  const result = validateMovie(req.body)

  if (!result.success) {
    res.status(400).json({ error: result.error })
  }

  const newMovie = {
    id: movies.length,
    ...result.data,
  }

  movies.push(newMovie)

  res.status(201).json(movies)
})

//edit
app.patch('/movies/:id', (req, res) => {
  const result = validatePartialMovie(req.body)

  if (!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  const { id } = req.params
  const movieIndex = movies.findIndex((movie) => movie.id === id)

  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie not found' })
  }

  const updateMovie = {
    ...movies[movieIndex],
    ...result.data,
  }

  movies[movieIndex] = updateMovie

  return res.json(updateMovie)
})

//delete
app.delete('/movies/:id', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')

  const id = req.params.id
  const movieIndex = movies.findIndex((movie) => movie.id === id)

  if (movieIndex !== -1) {
    movies.splice(movieIndex, 1)
    res.json(movies)
  } else {
    res.status(404).send('Movie not found')
  }
})

app.options('/movies/:id', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, PATCH, PUT')
  res.send('papiu gome')
})

app.listen(PORT, () => console.log('listening on https://localhost:6969'))
