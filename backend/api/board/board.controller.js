const boardService = require('./board.service.js')
const logger = require('../../services/logger.service')

module.exports = {
  getBoards,
  getBoardById,
  addBoard,
  updateBoard,
  removeBoard,
  addBoardMsg,
  removeBoardMsg
}

// GET LIST
async function getBoards(req, res) {
  try {
    logger.debug('Getting boards')
    var { name, label, sort, inStock } = req.query
    console.log(`sort:`, sort)
    // console.log(`res.query:`, req.query)
    var filterBy

    if (!name && !label && (inStock === 'false')) filterBy = {}

    else {
      filterBy = { $and: [] }

      if (name) filterBy.$and.push({ name: { $regex: name, $options: 'i' } })
      if (inStock !== 'false') filterBy.$and.push({ 'inStock': true })
      if (label) filterBy.$and.push({ 'labels': { $all: label } })
    }

    const sortBy = {}
    sortBy[sort] = 1
    const boards = await boardService.query(filterBy, sortBy)
    res.json(boards)

  } catch (err) {
    logger.error('Failed to get boards', err)
    res.status(500).send({ err: 'Failed to get boards' })
  }
}

// READ ( GET BY ID )
async function getBoardById(req, res) {
  try {
    const boardId = req.params.id
    const board = await boardService.getById(boardId)
    res.json(board)
  } catch (err) {
    logger.error('Failed to get board', err)
    res.status(500).send({ err: 'Failed to get board' })
  }
}

// POST (add board)
async function addBoard(req, res) {
  console.log(req)
  try {
    const { name, price, inStock, createdAt, labels, reviews } = req.body
    const board = {
      name,
      price,
      inStock,
      createdAt,
      labels,
      reviews,
    }
    const addedBoard = await boardService.add(board)
    res.json(addedBoard)
  } catch (err) {
    logger.error('Failed to add board', err)
    res.status(500).send({ err: 'Failed to add board' })
  }
}

// PUT (Update board)
async function updateBoard(req, res) {
  // console.log('UPDATE', req.body)
  try {
    const board = req.body
    // const { name, price, _id, inStock, createdAt, labels, reviews, idx, imgUrl } = req.body
    // const board = {
    //   _id,
    //   name,
    //   price,
    //   inStock,
    //   createdAt,
    //   labels,
    //   reviews,
    //   idx,
    //   imgUrl,
    // }
    const updatedBoard = await boardService.update(board)
    res.json(updatedBoard)
  } catch (err) {
    logger.error('Failed to update board', err)
    res.status(500).send({ err: 'Failed to update board' })

  }
}

// DELETE (Remove board)
async function removeBoard(req, res) {
  try {
    const boardId = req.params.id
    const removedId = await boardService.remove(boardId)
    res.send(removedId)
  } catch (err) {
    logger.error('Failed to remove board', err)
    res.status(500).send({ err: 'Failed to remove board' })
  }
}


async function addBoardMsg(req, res) {
  const { loggedinUser } = req
  try {
    const boardId = req.params.id
    const msg = {
      txt: req.body.txt,
      by: loggedinUser
    }
    const savedMsg = await boardService.addBoardMsg(boardId, msg)
    res.json(savedMsg)
  } catch (err) {
    logger.error('Failed to update board', err)
    res.status(500).send({ err: 'Failed to update board' })

  }
}

async function removeBoardMsg(req, res) {
  const { loggedinUser } = req
  try {
    const boardId = req.params.id
    const { msgId } = req.params

    const removedId = await boardService.removeBoardMsg(boardId, msgId)
    res.send(removedId)
  } catch (err) {
    logger.error('Failed to remove board msg', err)
    res.status(500).send({ err: 'Failed to remove board msg' })

  }
}
