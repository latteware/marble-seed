import { toast } from 'react-toastify'

export function success (message = '¡Operación exitosa!', opt = {}) {
  toast.success(message, {
    position: toast.POSITION.TOP_RIGHT,
    ...opt
  })
}

export function error (message = '¡Oops algo salió mal!', opt = {}) {
  toast.error(message, {
    position: toast.POSITION.TOP_RIGHT,
    ...opt
  })
}

export function info (message, opt = {}) {
  toast.success(message, {
    position: toast.POSITION.TOP_RIGHT,
    ...opt
  })
}
