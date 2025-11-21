interface WebSocketMessage {
  type: string
  payload?: any
}

export const useWebSocket = (url: string) => {
  const socket = ref()
  const isConnected = ref(false)
  const messageQueue = ref<WebSocketMessage[]>([])
  const eventHandlers = ref<Record<string, Function[]>>({})

  const connect = () => {
    socket.value = new WebSocket(url)

    socket.value.onopen = () => {
      isConnected.value = true
      // Send any queued messages
      messageQueue.value.forEach(msg => send(msg))
      messageQueue.value = []
      emit('connect')
    }

    socket.value.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as WebSocketMessage
        emit(data.type, data.payload)
      } catch (error) {
        console.error('Error parsing WebSocket message:', error)
      }
    }

    socket.value.onclose = () => {
      isConnected.value = false
      emit('disconnect')
      // Attempt reconnection after delay
      setTimeout(connect, 3000)
    }

    socket.value.onerror = (error) => {
      console.error('WebSocket error:', error)
      emit('error', error)
    }
  }

  const send = (message: WebSocketMessage) => {
    if (!isConnected.value) {
      messageQueue.value.push(message)
      return
    }
    socket.value?.send(JSON.stringify(message))
  }

  const on = (event: string, handler: Function) => {
    if (!eventHandlers.value[event]) {
      eventHandlers.value[event] = []
    }
    eventHandlers.value[event].push(handler)
  }

  const off = (event: string, handler: Function) => {
    if (eventHandlers.value[event]) {
      eventHandlers.value[event] = eventHandlers.value[event].filter(
        h => h !== handler
      )
    }
  }

  const emit = (event: string, payload?: any) => {
    if (eventHandlers.value[event]) {
      eventHandlers.value[event].forEach(handler => handler(payload))
    }
  }

  const disconnect = () => {
    if (socket.value) {
      socket.value.close()
    }
  }

  // Auto-connect when composable is created
  onMounted(() => {
    connect()
  })

  return {
    socket,
    isConnected,
    send,
    emit,
    on,
    off,
    disconnect
  }
}
