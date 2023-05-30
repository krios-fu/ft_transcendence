# ft_transcendence dev guide

## Configuración de las variables de entorno
### .env.development
```
FORTYTWO_APP_ID=${your app id}
FORTYTWO_APP_SECRET=${your app secret}
WEBAPP_IP=http://localhost:4200
CALLBACK_URL=${yout callback URL from your app}
```
### .env.production
```
FORTYTWO_APP_ID=${your app id}
FORTYTWO_APP_SECRET=${your app secret}
WEBAPP_IP=${your prod. ip}
CALLBACK_URL=${your callback URL from your app}
```
### .env.database
```
POSTGRES_USER=${your pg user}
POSTGRES_PASSWORD=${your pg passwd}
POSTGRES_DB=${your pg db}
DB_HOST=${your db host}
PGADMIN_DEFAULT_EMAIL=${your pgadmin mail}
PGADMIN_DEFAULT_PASSWORD=${your pgadmin pw}
```

## TROUBLESHOOTING

>  _back no me compila / la base de datos me lanza errores sobre columnas no nulas, ¿qué hago?_

Elimina la carpeta del código fuente transpilado **dist** y/o reinstala los módulos de la aplicación.
```bash
rm -r ./backend/dist ./backend/node_modules
cd ./backend && npm i
```

> _la app no me deja loggearme con 42 / backend me lanza errores de tokens inválidos_

Actualiza las variables de entorno correspondientes a la ID y el secreto de la app, comprueba que la url de
redirección en la API corresponde a la url local y la url de petición a la API de 42 es válida.


