
import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'
import { userService } from './user.service.js'

const STORAGE_KEY = 'card'

export const cardService = {
    query,
    getById,
    save,
    remove,
    getEmptyCard,
    addCardMsg
}
window.cs = cardService


async function query(filterBy = { txt: '', price: 0 }) {
    var cards = await storageService.query(STORAGE_KEY)
    if (filterBy.txt) {
        const regex = new RegExp(filterBy.txt, 'i')
        cards = cards.filter(card => regex.test(card.vendor) || regex.test(card.description))
    }
    if (filterBy.price) {
        cards = cards.filter(card => card.price <= filterBy.price)
    }
    return cards
}

function getById(cardId) {
    return storageService.get(STORAGE_KEY, cardId)
}

async function remove(cardId) {
    await storageService.remove(STORAGE_KEY, cardId)
}

async function save(card) {
    var savedCard
    if (card._id) {
        savedCard = await storageService.put(STORAGE_KEY, card)
    } else {
        // Later, owner is set by the backend
        card.owner = userService.getLoggedinUser()
        savedCard = await storageService.post(STORAGE_KEY, card)
    }
    return savedCard
}

async function addCardMsg(cardId, txt) {
    // Later, this is all done by the backend
    const card = await getById(cardId)
    if (!card.msgs) card.msgs = []

    const msg = {
        id: utilService.makeId(),
        by: userService.getLoggedinUser(),
        txt
    }
    card.msgs.push(msg)
    await storageService.put(STORAGE_KEY, card)

    return msg
}

function getEmptyCard() {
    return {
        vendor: 'Susita-' + (Date.now() % 1000),
        price: utilService.getRandomIntInclusive(1000, 9000),
    }
}


// TEST DATA
// storageService.post(STORAGE_KEY, {vendor: 'Subali Rahok 2', price: 980}).then(x => console.log(x))




