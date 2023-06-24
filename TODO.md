# TODO websocket creds

- [ ] Autentificación
    - [ ] Comprobación de seteo de credenciales (...)
    - [ ] Excepción en auth inválido

- [ ] Seteo de roles de sala
    - [ ] Se setean credenciales al unirse a una sala
- [ ] Validación de credenciales en sala
    - [ ] Se comprueban credenciales en eveto de sala
- [ ] Renovación de credenciales en sala
    - [ ] Servidor manda evento de actualización
    - [ ] Cliente recibe roles y mantiene
    - [ ] Desconexión si cliente no reconoce la renovación

Comprobación de usuarios baneados en sala.
Comprobación de usuario globalmente baneado.

Un usuario puede enviar un evento dentro de una sala a la que no pertenece?

# Autorizaciones
Las salas tienen roles propios. Cada sala tiene un set de roles distintos para el mismo usario autentificado. Distintas acciones pueden estar disponibles o prohibidas para distintos usuarios con ciertos roles. Estos roles se actualizan de forma dinámica.

El parámetro ´data´ será un diccionario que, al menos tenga una clave globalRoles, y una clave por cada sala en la que esté registrado.
´´´json
data: {
    globalRoles: [admin, user],
    room_1: [silenced, user],
    room_2: [mod, admin, banned]
}
´´´

Flujos a implementar:
En autentificación, se debe devolver en data los roles globales (petición a user_roles).
La guarda de autentificación debe comprobar, al menos, que el usuario tenga una clave 
´globalRoles´ en su payload.
Gestión de fallos, gestión de baneos.

En unión a sala:
Backend debe devolver en su payload los roles obtenidos en la base de datos correspondiente al usuario y a la sala.
Gestión de baneos.

En acciones dentro de la sala:
Backend debe comprobar que el usuario dispone de roles en la sala (petición a user_room_roles). Se han de guardar los eventos con los roles permitidos.
Gestión de fallos (forbidden exception?).

En refresco de roles:
Backend emite tras cada posteo o borrado a una entidad de roles (user_roles, user_room_roles) a todas las conexiones correspondientes al usuario con los roles actualizados, cada cliente ha de reconocer este refresco y back ha de comprobar que los roles son los actualizados. En caso contrario, se desconecta.


# Actualización de usuarios en sala

# Actualización de usuarios en app

# DOCS
## SOCKET.SERVICE
Añadimos los eventos de conexión, seteamos los parámetros de intentos de conexión, autentificación, eventos fallidos, estado de autentificación y la última vez que se autentificó con éxito.

* En conexión, se emite un evento de autentificación con el token del usuario.
* En excepción, se comprueba el tipo de excepción gestionada; para casos que no sean recibidos por la autentificación, se guarda el evento fallido, si se encuentra en estado de autentificación se corta, y si no, se entra en la lógica de reautentificación.
* En authSuccess, se emiten los eventos fallidos si se ha pasado el suficiente tiempo tras la última autetificación con éxito.
* En disconnect, se intenta reconectar. (máximo tres veces)
* Emisor de joinRoom.
* Emisor de eventos genéricos.

## GAME.ROOM.GUARD
Comprobación de que los datos recibidos son válidos, y comprobación de que la room es válida.
En validateRoom: si el evento es la subscripción a la sala, se busca si el usuario está registrado en la base de datos como usuario de la sala. Si es un evento de la propia sala, se comprueba si el socket del cliente se encuentra dentro de la sala.
// en este apartado nos faltaría el hecho de que el usuario tiene los roles necesarios para emitir el evento //


Temas de sockets en servidor: por qué remote sockets en vez de estructura de sockets, por qué default events map. 