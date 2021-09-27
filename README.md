# Notify Service

[![Banner-Service-Notify](https://user-images.githubusercontent.com/89747340/132135868-755c19bf-4313-40cf-a997-1710705e6142.png)](https://github.com/Rescuefy)

## Descripción

Servicio encargado de las notificaciones 

## APIs

* Base URL: `https://notifiy-service.vercel.app`

### Send Email

API para mandar emails. Tiene pre-cargados una serie de Templates.

* Endpoint: `/api/email`
* Method: `POST`

#### Body

* `templateCode`: _string_, código del template a usar
* `message`: _object_, la información para intercambiar en el template
* `to`: _array<string>_, lista de direcciones de emails de destino

#### Template

Existen los siguientes templates.

##### Default

Es para mandar un mensaje custom

* `title`
* `mainText`
* `secondaryText`

## Para desarrollar

[Leer](https://github.com/Rescuefy-admin/template-vercel-service/wiki/Desarrollo)
