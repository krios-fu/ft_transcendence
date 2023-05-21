<<<<<<< HEAD
# TODO para la Gran Pull Request de Autentificación

- [ ] Build de casi dos GB en front en produccion
- [ ] Variables de entorno sin gestionar en issuer y provider de la configuracion de JWT
- [ ] Carpeta app furtiva en front
- [ ] Editar  el entorno en prod de angular en runtime para la pet. en login
- [ ] Comprobar la eliminacion de la cookie
- [ ] Capar refresco desde webapp sin usuario
- [ ] No setear la cabecera de autorizacion si no hay token
- [ ] Cabecera de allow headers repe
- [ ] No meter la carpeta de config en dev
- [ ] Mover flow a login
- [ ] Mover referencias a otp_session en back a /2fa/auth
- [ ] Setear nuevas credenciales tras 2fa 
=======
# Tareas pendientes
<hr>

- [ ] Escenario de redirección desde backend (302) en producción, con back bajo proxy, levantando endpoints
públicos

#### Resultados
La nueva petición a la ruta redirigida tiene una cabecera que acepta respuestas JSON, lo cual impide el parseo de HTML y lanza error. Se intenta implementar un interceptor que rediriga manualmente los 302.

<hr>

- [ ] Escenario de redirección desde backend modificando nginx para eliminar el proxy a backend.

#### Resultados

<hr>

- [ ] Monitorización de peticiones y respuestas en backend tanto en dev como en prod y comparación entre ellas.

#### Resultados
>>>>>>> scenario-1
