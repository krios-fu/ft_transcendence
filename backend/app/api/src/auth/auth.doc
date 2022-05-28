# Autentificación a partir de Passport

     Tres funciones:
     1. autentificar un usuario verificando sus credenciales
     2. gestionar el estado de autentificación
        (el usuario al logearse mantiene un token de
         identificación usado para comprobar en las
         siguientes requests su identidad) -> JWT
 
## Passport strategies:
     Las estrategias personalizadas requieren de una
     configuración estandar para funcionar:

     1. El constructor ha de llamar a super() con un objeto que
     contenga una serie de opciones para configurar
     la estrategia.
 
     2. Implementación del callback de verificación: la función que implementa la
     estrategia de identificación. (validate();)
 
     Las passport strategies son proveedoras que serán usadas por Guards
     en los endpoints (tanto rutas como controladores) donde sean declaradas.
     { @UseGuards(AuthGuard('nombre de la estrategia')) }

## JWT:
     jwtService.sign(payload) es el método usado para generar una JWT única a partir
     de unas credenciales concretas.
     
     Se ha de instanciar el módulo JwtModule para hacer uso del proveedor de tokens.
     
## Auth. flow:
     Guard global implementa la estrategia jwt, que comprueba si el usuario tiene
     permiso de acceso con un token de autentificación. Hacemos pública una ruta
     de login para acceder sin autorización, aquí se podrá obtener el token que
     permitirá acceso al resto de la web.
     
     Acceso a la ruta de login -> obtención de credenciales -> .sign con las credenciales
     -> desbloqueo del acceso al resto de rutas a través del Guard que compruebe
     la validez del token resultante

### Documentación consultada
´´´
https://www.codemag.com/Article/2001081/Nest.js-Step-by-Step-Part-3-Users-and-Authentication
´´´