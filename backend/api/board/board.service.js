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
    addBoardMsg,
    removeBoardMsg,
}

async function query(filterBy, sortBy) {
    console.log('filterBy', filterBy)
    console.log('sortBy', sortBy)
    try {
        const collection = await dbService.getCollection('boards')
        var boards = await collection.find(filterBy).sort(sortBy).toArray()
        // console.log(`boards:`, boards)
        return boards
    }
    catch (err) {
        logger.error('cannot find boards', err)
        throw err
    }
}

async function getById(boardId) {
    try {
        const collection = await dbService.getCollection('boards')
        const board = collection.findOne({ _id: ObjectId(boardId) })
        return board
    } catch (err) {
        logger.error(`while finding board ${boardId}`, err)
        throw err
    }
}

async function remove(boardId) {
    try {
        const collection = await dbService.getCollection('boards')
        await collection.deleteOne({ _id: ObjectId(boardId) })
        return boardId
    } catch (err) {
        logger.error(`cannot remove board ${boardId}`, err)
        throw err
    }
}

async function add(board) {
    try {
        const collection = await dbService.getCollection('boards')
        const addedBoard = await collection.insertOne(board)
        await collection.find().sort({ _id: -1 })
        // console.log(`addedBoard:`, addedBoard)
        return addedBoard
    } catch (err) {
        logger.error('cannot insert board', err)
        throw err
    }
}

async function update(board) {
    // console.log('UPDATE', board)
    try {
        var boardId = ObjectId(board._id)
        delete board._id
        const collection = await dbService.getCollection('boards')
        const updatedBoard = await collection.updateOne({ _id: boardId }, { $set: { ...board } })
        // console.log(`updatedBoard:`, updatedBoard)
        return updatedBoard
    } catch (err) {
        logger.error(`cannot update board ${boardId}`, err)
        throw err
    }
}


async function addBoardMsg(boardId, msg) {
    try {
        msg.id = utilService.makeId()
        const collection = await dbService.getCollection('board')
        await collection.updateOne(
            { _id: ObjectId(boardId) },
            { $push: { msgs: msg } }
        )
        return msg
    } catch (err) {
        logger.error(`cannot add board msg ${boardId}`, err)
        throw err
    }
}

async function removeBoardMsg(boardId, msgId) {
    try {
        const collection = await dbService.getCollection('board')
        await collection.updateOne(
            { _id: ObjectId(boardId) },
            { $pull: { msgs: { id: msgId } } }
        )
        return msgId
    } catch (err) {
        logger.error(`cannot add board msg ${boardId}`, err)
        throw err
    }
}
