import get from 'lodash.get'
import { createSelector } from 'reselect'

import { StoreStructure, Transaction } from 'src/logic/safe/store/models/types/gateway.d'
import { GATEWAY_TRANSACTIONS_ID } from 'src/logic/safe/store/reducer/gatewayTransactions'
import { safeParamAddressFromStateSelector } from 'src/logic/safe/store/selectors'
import { AppReduxState } from 'src/store'
import { sameString } from 'src/utils/strings'

const getTransactions = (state: AppReduxState): AppReduxState['gatewayTransactions'] => state[GATEWAY_TRANSACTIONS_ID]

const getSafeTransactions = createSelector(
  getTransactions,
  safeParamAddressFromStateSelector,
  (transactionsBySafe, safeAddress) => transactionsBySafe[safeAddress],
)

export const getTransactionById = createSelector(
  getSafeTransactions,
  (_, transactionId: Transaction['id'], txLocation: 'history' | 'queued.next' | 'queued.queued') => ({
    transactionId,
    txLocation,
  }),
  (transactions, { transactionId, txLocation }): Transaction | undefined => {
    if (transactions && transactionId) {
      for (const [, txs] of Object.entries(
        get(transactions, txLocation) as StoreStructure['history'] | StoreStructure['queued']['next' | 'queued'],
      )) {
        const foundTx = txs.find(({ id }) => sameString(id, transactionId))

        if (foundTx) {
          return foundTx
        }
      }
    }
  },
)

export const getTransactionDetails = createSelector(
  getSafeTransactions,
  (_, transactionId: Transaction['id'], txLocation: 'history' | 'queued.next' | 'queued.queued') => ({
    transactionId,
    txLocation,
  }),
  (transactions, { transactionId, txLocation }): Transaction['txDetails'] | undefined => {
    if (transactions && transactionId) {
      for (const [, txs] of Object.entries(
        get(transactions, txLocation) as StoreStructure['history'] | StoreStructure['queued']['next' | 'queued'],
      )) {
        const txDetails = txs.find(({ id }) => sameString(id, transactionId))?.txDetails

        if (txDetails) {
          return txDetails
        }
      }
    }
  },
)

export const getQueuedTransactionsByNonceAndLocation = createSelector(
  getSafeTransactions,
  (_, nonce: number, txLocation: 'queued.next' | 'queued.queued') => ({ nonce, txLocation }),
  (transactions, { nonce, txLocation }): Transaction[] => {
    if (nonce && transactions) {
      return get(transactions, txLocation)[nonce]
    }

    return []
  },
)