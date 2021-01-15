import React, { useState, useEffect } from 'react'
import { TxParameters, useTransactionParameters } from 'src/routes/safe/container/hooks/useTransactionParameters'
import EditTxParametersForm from 'src/routes/safe/components/Transactions/helpers/EditTxParametersForm'
import { ParametersStatus } from './utils'

type Props = {
  children: (txParameters: TxParameters, toggleStatus: () => void) => any
  parametersStatus: ParametersStatus
  ethGasLimit?: TxParameters['ethGasLimit']
  ethGasPrice?: TxParameters['ethGasPrice']
  safeNonce?: TxParameters['safeNonce']
  safeTxGas?: TxParameters['safeTxGas']
}

export const EditableTxParameters = ({
  children,
  ethGasLimit,
  ethGasPrice,
  safeNonce,
  safeTxGas,
  parametersStatus,
}: Props): React.ReactElement => {
  const [isEditMode, toggleEditMode] = useState(false)
  const txParameters = useTransactionParameters({ calculateSafeNonce: false })
  const { setEthGasPrice, setEthGasLimit, setSafeNonce, setSafeTxGas } = txParameters

  /* Update TxParameters */
  useEffect(() => {
    setEthGasPrice(ethGasPrice)
    setEthGasLimit(ethGasLimit)
    setSafeNonce(safeNonce)
    setSafeTxGas(safeTxGas)
  }, [ethGasLimit, ethGasPrice, safeNonce, safeTxGas, setEthGasPrice, setEthGasLimit, setSafeNonce, setSafeTxGas])

  const toggleStatus = () => {
    toggleEditMode((prev) => !prev)
  }

  return isEditMode ? (
    <EditTxParametersForm txParameters={txParameters} onClose={toggleStatus} parametersStatus={parametersStatus} />
  ) : (
    children(txParameters, toggleStatus)
  )
}
