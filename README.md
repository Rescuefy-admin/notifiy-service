# {serviceName} Service

[![Banner-Service-Template](https://user-images.githubusercontent.com/89747340/132112734-75086eb3-32d2-4de5-b4fe-7adb1af341e7.png)](https://github.com/Rescuefy)

## Descripción

{serviceDescription}

## Configurar Router

En el archivo `vercel.json`, se pueden ir declarando y agregando funciones asi:

```
{
    "routes": [
        {
            "src": "/api/{entity}", // endpoint, example: .../api/message
            "methods": ["{method-name}"], // methods allowed, example: "GET"
            "dest": "/api/{entity}/{method-name}" // path for the js file, example: ./api/message/get.js
        },
        {
            "src": "/api/{entity}/(?<{path-parameter-id-name}>[^/]+)", // exmple: api/message/(?<id>[^/]+) === .../api/message/100
            "methods": ["{method-name}"],
            "dest": "/api/{entity}/{method-name}?{key-name-in-query}=${path-parameter-id-name}" // example: api/message/get?id=$id | Can be getted in Query, req.query.id
        },
        {
            "src": "/.*", // every-else
            "status": 403, // response this status code
            "dest": "/api/not-found/message" // where the response is taken
        }
    ]
}
```

## Código

Luego en `./api/....`

Se agregan en carpetas y archivos, es la parte de `dest: ...`.

* En la variable `req` viene todo lo de la request, tiene:
    * `url`
    * `method`
    * `body`
    * `query`
    * `cookies`
    * `headers`
* La variable `res` se usa para el response
    * `res.statusCode = 200;` para cambiar el statusCode
    * `res.json(...);` para setear la data a responder


More Info: https://vercel.com/docs/configuration

## Desarrollo en Local

* Ejecutar `npm i`
* Ejecutar `npm run start`
* En la terminar da la URL para pegarle a las APIs
