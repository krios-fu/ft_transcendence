# Documentación de uso de ws en el proyecto
## Game Gateway
### Evento `authenticación`
Dos llamadas al servicio SocketAuthService, clearTimeout y registerUser.
LLamada a removeAllListeners sobre la conexión actual
Levanta un nuevo listener event `disconnecting`, llamada a removeUser y deleteTimeout.

### Evento `joinRoom`
Llamada a **getClientInitData**.
Llamada a **roomService.join**.
Cliente emite a evento `.ìnitScene`
Se asignan los roles de sala a la conexión.

### Evento `leaveRoom`
Llamada a **roomService.leave**. 
Llamada a **matchMakingService.updateNextPlayerRoom**.

### Evento `kickAndRemove`
Pending.

### Evento `getQueueInfo`
Llamada a **matchMakingService.emitQueuesInfo**.

### Evento `addToGameQueue`
Llamada a **matchMakingService.addToQueue**.

### Evento `addToGameHeroQueue`
Llamada a **matchMakingService.addToQueue**.

### Evento `removeFromGameQueue`
Llamada a **matchMakingService.removeFromQueue**.

### Evento `removeFromGameHeroQueue`
Llamada a **matchMakingService.removeFromQueue**.

### Evento `matchInviteResponse`
Llamada a **matchMakingService.updateNextPlayerInvite**.

### Evento `leftSelection`
Llamada a **socketHelper.getClientRoomPlayer** para obtener jugador y sala.
Llamada a **updateService.selectionInput**.
Emisión de selectionData a evento `leftSelection`

### Evento `rightSelection`
Llamada a **socketHelper.getClientRoomPlayer** para obtener jugador y sala.
Llamada a **updateService.selectionInput**.
Emisión de selectionData a evento `rightSelection

### Evento `confirmSelection`
Llamada a **socketHelper.getClientRoomPlayer** para obtener jugador y sala.
Llamada a **updateService.selectionInput**.
Emisión de selectionData a evento `confirmSelection`
Llamada a **updateService.attemptSelectionFinish**.

### Evento `paddleUp`
Llamada a **socketHelper.getClientRoomPlayer** para obtener jugador y sala.
Llamada a **updateService.paddleInput**.

### Evento `paddleDown`
Llamada a **socketHelper.getClientRoomPlayer** para obtener jugador y sala.
Llamada a **updateService.paddleInput**.

### Evento `heroUp`
Llamada a **socketHelper.getClientRoomPlayer** para obtener jugador y sala.
Llamada a **updateService.heroInput**.

### Evento `heroDown`
Llamada a **socketHelper.getClientRoomPlayer** para obtener jugador y sala.
Llamada a **updateService.paddleInput**.

### Evento `recover`
Llamada a **recoveryService.recover**.

## MatchMaking Service
### emitAllQueuesLength
Llamada a queueService.getAllQueuesLength con la id del juego.
Llamadas a emitQueueUpdate con los dos gameTypes disponibles.

### emitQueuesInfo
Llamada a emitAllQueuesLength.
Llamada a queueService.findUser para obtener userQueueUPdate.
Llamada a _emitUserQueueUpdate.

### isNextPlayer
Llamada a queueService.getNextPlayer.
Si no recibimos un array completo de nextPlayer, devolvemos error.
Si encontramos en el array un user con nuestro nombre, retornamos true;

### _canAttemptPairing
Llamada a queueService.getNextPlayer.
Devuelve aserción de que no se encuentra en la cola.

### _canStartGame
Llamada a gameDataService.getGameData, retorna true si devuelve false.

### addToQueue
Inicializa lengthUpdate con llamada a queueService.add.
Si no retorna un valor válido, terminamos.
Llamada a _emitQueueUpdate.
Llamada a _emitUserQueueUpdate.
Si lengthUpdate es mayor a 1, _canAttemptPairing y _canStartGame retornan true,
llamada a aattemptPlayerPairing.

### removeFromQueue
Inicializa lengthUpdate con llamada a queueService.removeFromQueue.
Si no devuelve valor válido, terminamos.
Llamada a _emitQueueUpdate.
Llamada a _emitUserQueueUpdate (queued como false).

### removeFromAllQueues
Inicializamos gameId con llamada a queueService.findUser.
Inicializamos lengthUpdate con llamada a queueService.removeAll.
Si recibimos un valor válido, llamamos a _emitQueueUpdate y salimos.
Llamada a updateNextPlayerInvite.

### EVENT HANDLER `game.ended`
Llamada a attemptPlayerPairing.

### _emitQueueUpdate
Llamada a socketHelper.emitToRoom.
Eventos a emitir: "queueClassicLength" : "queueHeroLength",

### _emitUserQueueUpdate
Llamada a socketHelper.emitToRoom (esta vez, roomId es la sala de usuario).
Evento a emitir: userQueue.

### _emitCancelNotification
Llamada a socketHelper.emitToRoom.
Evento a emitir: gameCancel.

### _initInRoom
Iteración sobre lista de jugadores.
Comprobamos con llamada a socketHelper.checkUserInRoom que se encuentran en la sala en la que van a jugar.
Por cada coincidencia, llamada a updateNextPlayerRoom.

### _sendInvites
Iteración sobre lista de jugadores
Si el atributo accepted es true, se ignora.
Llamada a socketHelper.emitToRoom, evento `matchInvite`.

### _removeInvalidNextPlayers
Llamada a queueService.removeInvalidNextPlayers para alimentar input removedUsernames.
Iteramos sobre input, si la iteración existe se llama a socketHelper.emitToRoom, evento `unqueue`.

### _getInviteData
Tres iteraciones.
Llamada a roomService para obtener entidad de sala. Si existe, retornar info de sala.

### _pairPlayers
Llamada a _getInviteData (recibimos id y nombre de sala).
Si no devuelve nada (sala borrada), llamada a queueService.deleteGameQueues.
Else, llamada a _sendInvites, _setPairingTimeout, _initInRoom.

### _setPairingTimeout
Llamada a _pairingTimeouts.get, si devuleve válido, limpia timeouts.
SetTimeout con llamadas a _removeInvalidNextPlayers, _removePairingTimeout, attempltPlayerPairing.
Llamada a _pairingTimeouts.set.

### _extractRemainingNextPlayerUsername
Iteración nextPlayers.
Si existe, devuelve nombre de usuario.

### attemptPlayerPairing
Inicializa nextPlayers con queueService.getNextPlayers.
Si existe valor, retornamos.
Inicializa cancelNotificationUsername con extractRemainingNextPlayerUsername.
Inicializa nextPlayers con queueService.selectNextPlayers.
Si no recibe valor válido, llamada a emitAllQueuesLength, y si recibe valor válido en cancelNot..., llamada a _emitCancelNotification.
Retorna.
Else, llamada a _pairPlayers.

### _removePairingTimeout
Llamada a _pairingTimeouts.get.
clearTimeout si existe, return si no.
Llamada a _pairingTimeouts.delete.

### _initGame
Llamada a gameDataService.setGameData.
Llamada a setGameData.setPlayers.
Emisión event `game.start`.

### _confirmNextPlayer
Llamada a queueService.confirmNextPlayers para alimentar confirmResult.
Si retorna inválido, return false.
Llamada a _removePairingTimeout.
Llamada a _emitQueueUpdate.

### updateNextPlayerInvite
Llamada a queueService.updateNextPlayerInvite para alimentar nextPlayers.
Inválida, return.
Si alguien declinó, llamada a _removePairingTimeout, _removeInvalidNextPlayers, attemptPlayerPairing.
Si los dos aceptaron y se encuentran en sala, llamada a _confirmNextPlayers, retorno negativo es llamada a attemptPlayerPairing.
Retorno positivo, llamada a _initGame.

### updateNextPlayerRoom
Llamada a queueService.updateNextPlayerRoom para alimentar nextPlayers.
Llamada a queueService.findUser para alimentar registeredRoom.
Llamada a updateNextPlayerRoom si registeredRoom no coincide con game id y join es true.
Si no existe nextPlayers, return.
Si lso dos jugadores aceptan y están en sala, llamada a confirmNextPlayers.
Si devuelve false, llamada a aattemptPlayerPairing, else llamada a _initGame.
Nada fuera del condicional.

## Flujo de trabajo ws en colas de juego
Al inicializar la vista de colas, se llama a la función `subscribe`, que
monta cuatro observables en los atributos del componente:
* classicSubscription (evento 'queueClassicLength')
* heroSubscription (evento 'queueHeroLength')
* unqueueSubscription (evento 'unqueue')
* userQueueSubscription (evento 'userQueue')

Llamada a socketService para emitir en el evento `getQUeueInfo` con el id de la sala.

### addToQueue
Condiciones de subscripción en sala.
### addToHeroQueue