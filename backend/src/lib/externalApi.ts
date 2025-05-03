import dotenv from 'dotenv'

dotenv.config()

let apiKey = process.env.RAPID_API_KEY
let apiHost = process.env.RAPID_API_HOST
let apiUrl = process.env.RAPID_API_URL

// async function fetchFootballData(endpoint: string, params) {

// }

async function fetchRecentTeamPerformance() {
    const url: string = `${apiUrl}/standings?league=39&season=2024`

    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': apiKey as string,
            'x-rapidapi-host': apiHost as string
        }
    }

    try {
        const response = await fetch(url, options)
        const data = await response.json()
        const standings = await data.response[0].league.standings[0]

        return standings
    } catch (error) {
        console.error('Error while retrieving premier league table')
    }
}

async function fetchTopScorers() {
    const url: string = `${apiUrl}/players/topscorers?league=39&season=2024`

    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': apiKey as string,
            'x-rapidapi-host': apiHost as string
        }
    }

    try {
        const response = await fetch(url, options)
        const data = await response.json()
        const standings = await data.response

        return standings
    } catch (error) {
        console.error('Error while retrieving premier league top goalscorers.')
    }
}

async function fetchTopAssisters() {
    const url: string = `${apiUrl}/players/topassists?league=39&season=2024`

    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': apiKey as string,
            'x-rapidapi-host': apiHost as string
        }
    }

    try {
        const response = await fetch(url, options)
        const data = await response.json()
        const standings = await data.response[0]

        return standings
    } catch (error) {
        console.error('Error while retrieving premier league top assisters.')
    }
}

export { fetchRecentTeamPerformance, fetchTopScorers, fetchTopAssisters }