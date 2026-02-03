import React from 'react'
import type { ApiStatus } from '../api/types'

export function Alert({ status, message, onClose }: { status: ApiStatus; message: string; onClose?: () => void }) {
  const cls =
    status === 'sucesso' ? 'alert alert-success' :
    status === 'erro' ? 'alert alert-danger' :
    status === 'alerta' ? 'alert alert-warning' :
    'alert alert-info'

  if (!message) return null
  return (
    <div className={cls} role="alert">
      <div className="d-flex justify-content-between align-items-center">
        <div>{message}</div>
        {onClose ? <button className="btn btn-sm btn-outline-secondary" onClick={onClose}>x</button> : null}
      </div>
    </div>
  )
}