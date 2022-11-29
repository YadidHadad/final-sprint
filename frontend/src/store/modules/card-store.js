import { cardService } from '../../services/cardd-service.local'

export function getActionRemoveCard(cardId) {
    return {
        type: 'removeCard',
        cardId
    }
}
export function getActionAddCard(card) {
    return {
        type: 'addCard',
        card
    }
}
export function getActionUpdateCard(card) {
    return {
        type: 'updateCard',
        card
    }
}

export function getActionAddCardMsg(cardId) {
    return {
        type: 'addCardMsg',
        cardId,
        txt: 'Stam txt'
    }
}

export const cardStore = {
    state: {
        cards: []
    },
    getters: {
        cards({ cards }) { return cards },
    },
    mutations: {
        setCards(state, { cards }) {
            state.cards = cards
        },
        addCard(state, { card }) {
            state.cards.push(card)
        },
        updateCard(state, { card }) {
            const idx = state.cards.findIndex(c => c.id === card._id)
            state.cards.splice(idx, 1, card)
        },
        removeCard(state, { cardId }) {
            state.cards = state.cards.filter(card => card._id !== cardId)
        },
        addCardMsg(state, { cardId, msg }) {
            const card = state.cards.find(card => card._id === cardId)
            if (!card.msgs) card.msgs = []
            card.msgs.push(msg)
        },
    },
    actions: {
        async addCard(context, { card }) {
            try {
                card = await cardService.save(card)
                context.commit(getActionAddCard(card))
                return card
            } catch (err) {
                console.log('cardStore: Error in addCard', err)
                throw err
            }
        },
        async updateCard(context, { card }) {
            try {
                card = await cardService.save(card)
                context.commit(getActionUpdateCard(card))
                return card
            } catch (err) {
                console.log('cardStore: Error in updateCard', err)
                throw err
            }
        },
        async loadCards(context) {
            try {
                const cards = await cardService.query()
                context.commit({ type: 'setCards', cards })
            } catch (err) {
                console.log('cardStore: Error in loadCards', err)
                throw err
            }
        },
        async removeCard(context, { cardId }) {
            try {
                await cardService.remove(cardId)
                context.commit(getActionRemoveCard(cardId))
            } catch (err) {
                console.log('cardStore: Error in removeCard', err)
                throw err
            }
        },
        async addCardMsg(context, { cardId, txt }) {
            try {
                const msg = await cardService.addCardMsg(cardId, txt)
                context.commit({ type: 'addCardMsg', cardId, msg })
            } catch (err) {
                console.log('cardStore: Error in addCardMsg', err)
                throw err
            }
        },

    }
}