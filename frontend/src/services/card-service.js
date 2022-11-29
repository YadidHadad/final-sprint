
// import { storageService } from './async-storage.service.js'
import { httpService } from './http.service.js'
import { utilService } from './util.service.js'
import { userService } from './user.service.js'


const STORAGE_KEY = 'card'

export const cardService = {
    query,
    getById,
    save,
    remove,
    getEmptyCardd,
    addCarddMsg
}
window.cs = cardService


async function query(filterBy = { txt: '', price: 0 }) {
    return httpService.get(STORAGE_KEY, filterBy)

    // var cards = await storageService.query(STORAGE_KEY)
    // if (filterBy.txt) {
    //     const regex = new RegExp(filterBy.txt, 'i')
    //     cards = cards.filter(card => regex.test(card.vendor) || regex.test(card.description))
    // }
    // if (filterBy.price) {
    //     cards = cards.filter(card => card.price <= filterBy.price)
    // }
    // return cards

}
function getById(cardId) {
    // return storageService.get(STORAGE_KEY, cardId)
    return httpService.get(`card/${cardId}`)
}

async function remove(cardId) {
    // await storageService.remove(STORAGE_KEY, cardId)
    return httpService.delete(`card/${cardId}`)
}
async function save(card) {
    var savedCardd
    if (card._id) {
        // savedCardd = await storageService.put(STORAGE_KEY, card)
        savedCardd = await httpService.put(`card/${card._id}`, card)

    } else {
        // Later, owner is set by the backend
        card.owner = userService.getLoggedinUser()
        // savedCardd = await storageService.post(STORAGE_KEY, card)
        savedCardd = await httpService.post('card', card)
    }
    return savedCardd
}

async function addCarddMsg(cardId, txt) {
    const savedMsg = await httpService.post(`card/${cardId}/msg`, { txt })
    return savedMsg
}


function getEmptyCardd() {
    return {
        vendor: 'Susita-' + (Date.now() % 1000),
        price: utilService.getRandomIntInclusive(1000, 9000),
    }
}





