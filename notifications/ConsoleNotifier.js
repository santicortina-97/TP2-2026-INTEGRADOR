// Interfaz de todo notificador: notify(mensaje) -> Promise
export class ConsoleNotifier {
    async notify(mensaje) {
      console.log(`[NOTIFICACIÓN ${new Date().toISOString()}] ${mensaje}`);
    }
  }