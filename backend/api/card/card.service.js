const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const utilService = require('../../services/util.service')
const ObjectId = require('mongodb').ObjectId

module.exports = {
    remove,
    query,
    getById,
    add,
    update,
    addCardMsg,
    removeCardMsg,
}

async function query(filterBy, sortBy) {
    console.log('filterBy', filterBy)
    console.log('sortBy', sortBy)
    try {
        const collection = await dbService.getCollection('cards')
        var cards = await collection.find(filterBy).sort(sortBy).toArray()
        // console.log(`cards:`, cards)
        return cards
    }
    catch (err) {
        logger.error('cannot find cards', err)
        throw err
    }
}

async function getById(cardId) {
    try {
        const collection = await dbService.getCollection('cards')
        const card = collection.findOne({ _id: ObjectId(cardId) })
        return card
    } catch (err) {
        logger.error(`while finding card ${cardId}`, err)
        throw err
    }
}

async function remove(cardId) {
    try {
        const collection = await dbService.getCollection('cards')
        await collection.deleteOne({ _id: ObjectId(cardId) })
        return cardId
    } catch (err) {
        logger.error(`cannot remove card ${cardId}`, err)
        throw err
    }
}

async function add(card) {
    try {
        const collection = await dbService.getCollection('cards')
        const addedCard = await collection.insertOne(card)
        await collection.find().sort({ _id: -1 })
        // console.log(`addedCard:`, addedCard)
        return addedCard
    } catch (err) {
        logger.error('cannot insert card', err)
        throw err
    }
}

async function update(card) {
    // console.log('UPDATE', card)
    try {
        var cardId = ObjectId(card._id)
        delete card._id
        const collection = await dbService.getCollection('cards')
        const updatedCard = await collection.updateOne({ _id: cardId }, { $set: { ...card } })
        // console.log(`updatedCard:`, updatedCard)
        return updatedCard
    } catch (err) {
        logger.error(`cannot update card ${cardId}`, err)
        throw err
    }
}


async function addCardMsg(cardId, msg) {
    try {
        msg.id = utilService.makeId()
        const collection = await dbService.getCollection('card')
        await collection.updateOne(
            { _id: ObjectId(cardId) },
            { $push: { msgs: msg } }
        )
        return msg
    } catch (err) {
        logger.error(`cannot add card msg ${cardId}`, err)
        throw err
    }
}

async function removeCardMsg(cardId, msgId) {
    try {
        const collection = await dbService.getCollection('card')
        await collection.updateOne(
            { _id: ObjectId(cardId) },
            { $pull: { msgs: { id: msgId } } }
        )
        return msgId
    } catch (err) {
        logger.error(`cannot add card msg ${cardId}`, err)
        throw err
    }
}
