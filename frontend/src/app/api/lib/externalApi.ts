import { RAPID_API_KEY, RAPID_API_HOST, RAPID_API_URL } from "@/lib/const"

const apiKey = RAPID_API_KEY
const apiHost = RAPID_API_HOST
const apiUrl = RAPID_API_URL

// async function fetchFootballData(endpoint: string, params) {

// }

async function fetchRecentTeamPerformance() {
    const url: string = `${apiUrl}/standings?league=39&season=2026`

    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': apiKey,
            'x-rapidapi-host': apiHost
        }
    }

    try {
        const response = await fetch(url, options)
        const data = await response.json()
        const standings = await data.response[0].league.standings[0]

        return standings
    } catch (error) {
        console.error('Error while retrieving premier league table', error)
    }
}

async function fetchTopScorers() {
    const url: string = `${apiUrl}/players/topscorers?league=39&season=2026`

    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': apiKey,
            'x-rapidapi-host': apiHost
        }
    }

    try {
        const response = await fetch(url, options)
        const data = await response.json()
        const standings = await data.response

        return standings
    } catch (error) {
        console.error('Error while retrieving premier league top goalscorers.', error)
    }
}

async function fetchTopAssisters() {
    const url: string = `${apiUrl}/players/topassists?league=39&season=2026`

    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': apiKey,
            'x-rapidapi-host': apiHost
        }
    }

    try {
        const response = await fetch(url, options)
        const data = await response.json()
        const standings = await data.response[0]

        return standings
    } catch (error) {
        console.error('Error while retrieving premier league top assisters.', error)
    }
}

export { fetchRecentTeamPerformance, fetchTopScorers, fetchTopAssisters }