class EventBus {
	constructor() {
		this.listeners = {};
	}

	subscribe(event, callback) {
		if (!this.listeners[event]) {
			this.listeners[event] = [];
		}
		this.listeners[event].push(callback);
	}

	unsubscribe(event, callback) {
		if (!this.listeners[event]) return;

		this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
	}

	emit(event, data) {
		if (!this.listeners[event]) return;

		this.listeners[event].forEach(callback => callback(data));
	}
}

export const eventBus = new EventBus();
