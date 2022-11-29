const toyService = require('./toy.service.js')
const logger = require('../../services/logger.service')

module.exports = {
  getToys,
  getToyById,
  addToy,
  updateToy,
  removeToy,
  addToyMsg,
  removeToyMsg
}

// GET LIST
async function getToys(req, res) {
  try {
    logger.debug('Getting toys')
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
    const toys = await toyService.query(filterBy, sortBy)
    res.json(toys)

  } catch (err) {
    logger.error('Failed to get toys', err)
    res.status(500).send({ err: 'Failed to get toys' })
  }
}

// READ ( GET BY ID )
async function getToyById(req, res) {
  try {
    const toyId = req.params.id
    const toy = await toyService.getById(toyId)
    res.json(toy)
  } catch (err) {
    logger.error('Failed to get toy', err)
    res.status(500).send({ err: 'Failed to get toy' })
  }
}

// POST (add toy)
async function addToy(req, res) {
  console.log(req)
  try {
    const { name, price, inStock, createdAt, labels, reviews } = req.body
    const toy = {
      name,
      price,
      inStock,
      createdAt,
      labels,
      reviews,
    }
    const addedToy = await toyService.add(toy)
    res.json(addedToy)
  } catch (err) {
    logger.error('Failed to add toy', err)
    res.status(500).send({ err: 'Failed to add toy' })
  }
}

// PUT (Update toy)
async function updateToy(req, res) {
  // console.log('UPDATE', req.body)
  try {
    const toy = req.body
    // const { name, price, _id, inStock, createdAt, labels, reviews, idx, imgUrl } = req.body
    // const toy = {
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
    const updatedToy = await toyService.update(toy)
    res.json(updatedToy)
  } catch (err) {
    logger.error('Failed to update toy', err)
    res.status(500).send({ err: 'Failed to update toy' })

  }
}

// DELETE (Remove toy)
async function removeToy(req, res) {
  try {
    const toyId = req.params.id
    const removedId = await toyService.remove(toyId)
    res.send(removedId)
  } catch (err) {
    logger.error('Failed to remove toy', err)
    res.status(500).send({ err: 'Failed to remove toy' })
  }
}


async function addToyMsg(req, res) {
  const { loggedinUser } = req
  try {
    const toyId = req.params.id
    const msg = {
      txt: req.body.txt,
      by: loggedinUser
    }
    const savedMsg = await toyService.addToyMsg(toyId, msg)
    res.json(savedMsg)
  } catch (err) {
    logger.error('Failed to update toy', err)
    res.status(500).send({ err: 'Failed to update toy' })

  }
}

async function removeToyMsg(req, res) {
  const { loggedinUser } = req
  try {
    const toyId = req.params.id
    const { msgId } = req.params

    const removedId = await toyService.removeToyMsg(toyId, msgId)
    res.send(removedId)
  } catch (err) {
    logger.error('Failed to remove toy msg', err)
    res.status(500).send({ err: 'Failed to remove toy msg' })

  }
}
