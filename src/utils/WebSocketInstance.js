class WebSocketInstance {
    socket = null;
    callbacks = {};
  
    connect() {
      this.socket = new WebSocket(REACT_APP_IOT_BACKEND_URL || 'ws://localhost:3001/ws/'); // WebSocket server URL
      this.socket.onopen = () => {
        console.log('WebSocket connected');
      };
      this.socket.onmessage = (e) => {
        const data = JSON.parse(e.data);
        this.callbacks[data.type](data.message);
      };
    }
  
    disconnect() {
      this.socket.close();
      console.log('WebSocket disconnected');
    }
  
    addCallbacks(callbacks) {
      this.callbacks = callbacks;
    }
  
    sendMessage(message) {
      this.socket.send(JSON.stringify(message));
    }
  }
  
  const instance = new WebSocketInstance();
  export default instance;
  