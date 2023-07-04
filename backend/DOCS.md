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
Transmite a partir de emisión a los eventos `classic` y `hero` las longitudes actuales de las colas.
La obtención de las longitudes de cola es un acceso al mapa de colas a través del id del juego.

Llamada a queueService.getAllQueuesLength con la id del juego.
Llamadas a emitQueueUpdate con los dos gameTypes disponibles.

### emitQueuesInfo
Emite la información sobre los tamaños de cola para una sala, y a continuación emite a todas las conexiones de un único 
usuario el evento `userQueue` con el id de la sala.
(socketHelper.emitToRoom := emite un evento en una sala concreta con un payload.)

Llamada a emitAllQueuesLength.
Llamada a queueService.findUser para obtener userQueueUpdate.
Llamada a _emitUserQueueUpdate.

### isNextPlayer

---
Estructura NextPlayerPair: Par de dos elementos INextPlayer,
cuyo formato consta de 
* queueElement: IQueueElement { user: UserEntity, insertTime: number },
* gametype: GameType { "classic" | "hero" },
* inRoom: boolean,
* accepted: boolean,
* declined: boolean
---
Comprueba si el jugador a comprobar si es siguente jugador está dentro del par de la cola.


Llamada a queueService.getNextPlayer.
Si no recibimos un array completo de nextPlayer, devolvemos error.
Si encontramos en el array un user con nuestro nombre, retornamos true;

### _canAttemptPairing
Comprueba si dentro de la estructura de siguientes jugadores existe información válida y suficiente para iniciar un
emparejamiento.

Llamada a queueService.getNextPlayer.
Devuelve aserción de que no se encuentra en la cola.

### _canStartGame

Llamada a gameDataService.getGameData, retorna true si devuelve false.

### addToQueue
Emite información sobre las colas, también emite info sobre el usuario en las colas,
por último intenta el emparejamiento.

Inicializa lengthUpdate con llamada a queueService.add.
Si no retorna un valor válido, terminamos.
Llamada a _emitQueueUpdate.
Llamada a _emitUserQueueUpdate.
Si lengthUpdate es mayor a 1, _canAttemptPairing y _canStartGame retornan true,
llamada a aattemptPlayerPairing.

### removeFromQueue
Eliminamos de la cola el usuario. RemoveFromQueue puede devolver undefined si no existe el usuario o la cola, o si el usuario no se encuentra en la cola. Emite al evento que actualiza a la sala del usuario el tamaño de la cola.

Inicializa lengthUpdate con llamada a queueService.removeFromQueue.
Si no devuelve valor válido, terminamos.
Llamada a _emitQueueUpdate.
Llamada a _emitUserQueueUpdate (queued como false).

### removeFromAllQueues
Elimina al usuario de las dos colas.

Inicializamos gameId con llamada a queueService.findUser.
Inicializamos lengthUpdate con llamada a queueService.removeAll.
Si recibimos un valor válido, llamamos a _emitQueueUpdate y salimos.
Llamada a updateNextPlayerInvite.

### EVENT HANDLER `game.ended`
Llamada a attemptPlayerPairing.

### _emitQueueUpdate
Emite a la sala correspondiente el evento `userQueue` con la longitud de la cola.

Llamada a socketHelper.emitToRoom.
Eventos a emitir: "queueClassicLength" : "queueHeroLength",

### _emitUserQueueUpdate
Emite al evento de cola dentro de la sala propia del usuario en la conexión.

Llamada a socketHelper.emitToRoom (esta vez, roomId es la sala de usuario).
Evento a emitir: userQueue.

### _emitCancelNotification
Emite en la sala del usuario de la conexión el evento `gameCancel` con la id de la sala.

Llamada a socketHelper.emitToRoom.
Evento a emitir: gameCancel.

### _initInRoom
Recibe el par de siguientes jugadores. Comprueba en cada uno que tenga validado el parámetro de inRoom, y si es el caso...

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

## queueService
### _getNextQueue
Recibimos todas las colas con llamada a _getAllQueues.
Comprobamos longitudes de cola y actuamos:
* Menos de 2, retornamos undefined.
* Devolvemos cola según la condición de qué cola tiene más de dos jugadores y cuál lleva más tiempo activa.

### _getQueue
Llamada a _gameQueues.get para obtener las colas de un juego.
Devolvemos la cola según el tipo queryado.

### _setQueues
Retorna si ya hay una cola existente (_gameQueues.get)
Setea con gameQueues.set (condición inicial: array de undefineds para nextPlayers).

### _setNextPlayers
Setea en el array de nextPlayers de la cola queryada.

### _pruneGameQueues
Elimina las colas vacías o inválidas del objeto global _gameQueues.

Obtenemos cola de juego (_gameQueues.get)
Comprobamos que la cola tiene longitud, y los siguientes jugadores están definidos, si no es el caso se llama a _gameQueues.delete.

### getAllQueuesLength
Llamada a _getAllQueues, devuelve array con longitud de las dos colas.

### _generateNextPlayer
Devuelve objeto nextPlayer a partir de un elemento de cola y el tipo de juego.

### _selectplayerB
Iteración en logitud de la cola, se implementa la lógica de matchmaking para setear el jugador B a emparejar.
Retorna el jugador encontrado.

### _selectPlayerA
Llamada a _getNextQueue.
Retornamos si no hay cola.
Devolvemos objeto PlayerQueueType.

### _existingNextPlayer
Llamada a getNextPlayers para obener lista de jugadores en sala.
Si no hay juagores, retornamos.
Iteramos sobre jugadores, llamada a _getQueue (parámetros id del juego y tipo del juego).
Si no hay cola, llamada a _reInsertToQueue y a _setNextPlayers.
Si hay elementos en cola, devolvemos jugador y tipo de juego.
Por default, devolevmos jugador indefinido y juego clásico.

### selectNextPlayers
Llamada a _existingNextPlayers para obtener el siguiente jugador A.
Si no existe, llamada a _selectPlayerA para obtener el jugador.
Devolvemos undefined si los dos métodos fallan.
Llamada a _selectPlayerB para obtener el jugador B.
Montamos array de siguientes jugadores; _generateNextPlayer si la primera llamada a obtener nextPlayerA no funcionó,
_generateNextPlayer para playerB.
Llamada a _setNextPlayers con el array construído.

### getNextPlayers
Llamada a _gameQueues.get para obtener la cola de un juego, extraemos los siguientes jugadores.

### updateNextPayerInvite
Llamada a getNextPlayers para obtener los siguientes jugadores. Si devuelve indefinido retornamos.
Iteramos por lista de siguientes jugadores, si el jugador no ha aceptado ni declinado el juego se le setea como target (seleccionado como potencial siguiente jugador).
Se trabaja sobre el target, se setean los parámetros declined y accepted según el parámetro de entrada accept, y se devuelve la lista de nextPlayers.

### updateNextPlayerRoom
Obtenemos la lista de siguientes jugadores con llamada a getNextPlayers.
Iteramos sobre lista de jugadores, el primero existente se selecciona y se setea su atributo de inRoom como join.

### confirmNextPlayers
Obtención de colas con _gameQueues.get
Si no existe o no contiene elementos en la lista de siguientes jugadores, sale.
Se obtiene la cola según el tipo de juego, se obtiene su longitud y se devuelve.
Llamada a _pruneGameQueues y se setea el atributo nextPlayers de la cola como undefined.

### remmoveInvalidNextPlayers
Obtenemos colas con _gameQueues.get.
Iteramos array de jugadores, si el jugador no tiene atributo aceptado o atributo en sala, se le elimina de la cola (aquí el undefined).
Llamada a _pruneGameQueues.
Retorna lista de usuarios eliminados.

### _findByUsername
Devuelve la posición del usuario por su nombre en la cola.

### _setUserQueueUpdate
Devuelve objeto UserQueueUpdate con attributps cola, id de sala y tipo de juego.

### findUser
Iteramos sobre la lista de colas en _gameQueues.
Llamada a _findByUsername, si es válida (usuario en cola), devuelve _setUserQueueUpdate.
Llamada a _findByUsername (cola hero), si es válida, devuelve tal.
Si no se cumplen esas condiciones, iteramos sobre nextPlayers, si encontramos un nextPlayer con el nombre se usuario,
se devuelve un objeto con éste.
Si no cumple ninguna condición, devuelve false (queried == false).

### add
Query entidad usuario en base a username. Buscamos query de juego con _getQueue.
Si no existe cola, _setQueue y trabajamos con la nueva cola.
Llamada a findUser, miramos su atributo de queued. Si el usuario no está en cola, se pushea el usuario en la cola y se devuelve la longitud de la cola. Si el usuario está en la cola, devuelve undefined. (CHECKTHIS)

### deleteGameQueues
Llamdada a _gameQueues.delete con el id del juego.

### _reinsertToQueue
Inserta jugador según su timestamp, elimina elementos repetidos.

### _removeFromQueue
Si la cola pasada como parámetro existe, llamada a _findByUsername.
Si el usuario se encuentra en la cola, se elimina de esta.

### removeFromQueue
No existen colas o usuario, devuelve undefined.
Selecciona tipo de juego.
Si _removeFromQueue devuelve falso (el usuario no se encuentra en la cola), devuelve undefined.
Obtiene longitud de cola.
Llama a _pruneGameQueues.
Devuelve longitud de la cola previa.

### removeAll
Llamada a removeFromQueue para cola clásica.
Si la eliminación fue válida (la cola existe, el usuario estaba en la cola), se devuelve la nueva longitud.
Llamada a removeFromQueue para la cola hero.
Eliminación válida, retorna nueva longitud. (CHECKTHIS -- uso de splice para eliminar usuarios en cola)
El usuario no estaba en ninguna cola, devuelve undefined.

## UpdateService
### EVENTO `game.start`
Llamada a startGame con id del juego y tipo de juego.

### getGameSelectionData
Obtención la selección de juego con llamada de gameDataService.getSelection.
Si existe y no tiene el atributo de cancelado activo, se devuelve el atributo data, si no devuelve undefined.

### getGameClientStartData
Obtención del juego con llamada a gameDataService.getGame.
Si existe, su atributo es Running o es Finished con llamada getGameResult falsa, devuelve game.clientStartData.

### getGameResult
Devuelve llamda a gameDataService.getResult.

### getClientInitData



## Flujo de trabajo ws en colas de juego
Al inicializar la vista de colas, se llama a la función `subscribe`, que
monta cuatro observables en los atributos del componente:
* classicSubscription (evento 'queueClassicLength')
* heroSubscription (evento 'queueHeroLength')
* unqueueSubscription (evento 'unqueue')
* userQueueSubscription (evento 'userQueue')

Llamada a socketService para emitir en el evento `getQueueInfo` con el id de la sala.
Gateway en backend va a recibir el evento y va a llamar a la función `matchMakingService.emitQueuesInfo`.
Esta función va a emitir a dos eventos distintos, emite a la sala en los 
dos eventos `queueClassicLength` y `queueHeroLength` con la longitud de las colas,
y emite a la sala del usuario el evento `userQueue` con la información del usuario en la cola (queued, roomId, type);

* Por el momento, userQueueData solo lo hemos obtenido al iniciar el componente.

### addToQueue
Condiciones de subscripción en sala: el atributo userQueueData (obtenido tras recepción del evento) tiene que tener
seteado a true el elemento queued, ha de comprobarse que las ids de la sala coinciden y que se está suscrito al tipo de
cola correcto.
Si está en cola pero no cumple el resto de condiciones, se elimina de la cola con `queueService.removeFromQueue`, que
emite un evento a `removeFromQueue`.
En caso exitoso, emite evento a `addToGameQueue`, que a su vez emitirá a los eventos en sala y en usuario de
actualización de cola (longitud para sala, queued val. para usuario);

Se intenta emparejar jugadores en el momento en que se añaden a la cola y se comprueba que son válidos.


### Notas
A la hora de iterar por la lista de siguientes jugadores, se comprueba si uno de esos elementos es indefinido, ¿se permiten elementos indefinidos dentro de un array de elementos definidos de jugadores?
