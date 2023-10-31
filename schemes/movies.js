const z = require('zod')

const movieSchema = z.object({
  title: z.string({
    invalid_type_error: 'Movie title must be a string',
    required_error: 'Movie title is required',
  }),
  director: z.string({
    invalid_type_error: 'Movie director must be a string',
    required_error: 'Movie director is required',
  }),
  genre: z.array(
    z.string({
      invalid_type_error: 'Movie genre must be a string',
      required_error: 'Movie genre is required',
    }).toLowerCase()
  ),
  year: z.number({
      required_error: 'Movie year is required',
      invalid_type_error: 'Movie year must be a number',
    })
    .int()
    .positive()
})

function validateMovie(obj) {
  return movieSchema.safeParse(obj)
}

function validatePartialMovie (obj) {
  return movieSchema.partial().safeParse(obj)
}

module.exports = {
  validateMovie,
  validatePartialMovie
}
