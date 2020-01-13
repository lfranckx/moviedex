require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const movielist = require('./movies-small-data')
const app = express()

app.use(morgan('dev'))
app.use(helmet())
app.use(cors())


// The endpoint only responds when given a valid Authorization header with a 
// Bearer API token value. The endpoint should have general security in place 
// such as best practice headers and support for CORS.

app.use(function validatorBearerToken(req, res, next) {
    console.log(process.env.API_Token)
    const apiToken = process.env.API_Token
    const authToken = req.get('Authorization')
    // Authentication token must be present and bearerToken must match apiToken
    if(!authToken || req.get('Authorization').split(' ') !== apiToken) {
        return res.status(401).json({ error: 'Unauthorized request' })
    }
    console.log('validate bearer token middleware');
    next()
})

// endpoint is GET /movie
// search query parameters for genre, country, and/or average vote

// When searching by genre, users are searching for whether the Movie's 
// genre includes a specified string. The search should be case insensitive.

// When searching by country, users are searching for whether the Movie's 
// country includes a specified string. The search should be case insensitive.

// When searching by average vote, users are searching for Movies with an 
// avg_vote that is greater than or equal to the supplied number. The API 
// responds with an array of full movie entries for the search results

app.get('/movie', function handleGetMovies(req, res) {
    let response = movielist;
    // console.log(response);
    // filter by genre
    if (req.query.genre) {
        response = response.filter(movie =>
            // case insensitive searching
            movie.genre.toLowerCase().includes(req.query.genre.toLowerCase())    
        )
    }
    // filter by country
    if (req.query.country) {
        response = response.filter(movie => 
            movie.country.toLowerCase().includes(req.query.country.toLowerCase())
        )
    }
    // filter avg vote scores less than or equal to provided avg vote score
    if (req.query.avgVote) {
        response = response.filter(movie =>
            Number(movie.avg_vote) >= Number(req.query.avgVote) // turn string into number
        )
    }
    res.json(response)
})

const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Server listening to http://localhost:${PORT}`)
})