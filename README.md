# ITMAC Future - Sistema de Microservicios

Sistema de gestión empresarial y ecommerce para una tienda de herramientas, equipos y maquinaria automotriz, desarrollado bajo una arquitectura de microservicios.

**Curso:** Desarrollo de Aplicaciones Distribuidas

---

## 📑 Tabla de Contenidos

- [Descripción del Proyecto](#descripción-del-proyecto)
- [Arquitectura del Sistema](#arquitectura-del-sistema)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Estructura del Repositorio](#estructura-del-repositorio)
- [Requisitos Previos](#requisitos-previos)
- [Configuración de Variables de Entorno](#configuración-de-variables-de-entorno)
- [Bases de Datos](#bases-de-datos)
- [Ejecución con Docker Compose](#ejecución-con-docker-compose)
- [Ejecución Manual](#ejecución-manual)
- [Endpoints Principales](#endpoints-principales)
- [Seguridad](#seguridad)
- [Resiliencia](#resiliencia)
- [Funcionalidades](#funcionalidades)
- [Evidencias del Proyecto](#evidencias-del-proyecto)
- [Autores](#autores)

---

## Descripción del Proyecto

ITMAC Future es un sistema de gestión empresarial y ecommerce para una tienda de herramientas, equipos y maquinaria automotriz. El proyecto permite gestionar usuarios, autenticación, productos, inventario, órdenes de compra/venta y pagos mediante una arquitectura de microservicios con Spring Boot y Spring Cloud.

---

## Arquitectura del Sistema

El sistema sigue el modelo C4 para su documentación arquitectónica:

| Nivel | Diagrama | Descripción |
|-------|----------|-------------|
| 1 | Contexto | Usuarios (Cliente/Administrador) e integración con la Pasarela de Pagos |
| 2 | Contenedores | Microservicios, bases de datos y comunicación entre ellos |
| 3 | Componentes | Estructura interna del Order Service |
| 4 | Código | Clases del flujo de creación de una orden |

> 📂 Los diagramas en formato `.puml` (PlantUML/C4-PlantUML) se encuentran en la carpeta `/docs/diagramas`.

El sistema está compuesto por los siguientes servicios:

- **`api-gateway`**: punto de entrada único del sistema. Valida JWT, aplica CORS y enruta las peticiones.
- **`auth-service`**: autenticación y generación de tokens JWT.
- **`usuario-service`**: gestión de usuarios y roles (ADMIN / CLIENTE).
- **`product-service`**: gestión de productos y precios.
- **`inventory-service`**: control de stock por producto.
- **`order-service`**: gestión de órdenes, cálculo de subtotal, IGV y total.
- **`payment-service`**: procesamiento simulado de pagos.
- **`config-server`**: configuración centralizada (Spring Cloud Config).
- **`service-registry`**: registro y descubrimiento de servicios con Eureka.
- **`frontend-V`**: frontend Angular del sistema.

---

## Tecnologías Utilizadas

- Java 21
- Spring Boot
- Spring Cloud Gateway
- Spring Cloud Config
- Netflix Eureka
- OpenFeign
- Resilience4j
- JWT
- MySQL
- Angular
- Docker
- Docker Compose

---

## Estructura del Repositorio

```text
Examen1_Proyecto/
├── Infraestructura/
│   ├── api-gateway/
│   ├── auth-service/
│   ├── config-server/
│   ├── service-registry/
│   └── usuario-service/
├── Services/
│   ├── product-service/
│   ├── inventory-service/
│   ├── order-service/
│   └── payment-service/
├── frontend-V/
├── docs/
│   └── diagramas/
└── docker-compose.yml
```

---

## Requisitos Previos

Antes de ejecutar el proyecto, instalar:

- Java 21
- Maven
- Node.js
- Angular CLI
- Docker Desktop
- MySQL

---

## Configuración de Variables de Entorno

Antes de ejecutar el proyecto, crear un archivo `.env` en la raíz basado en `.env.example`:

```bash
DB_HOST=localhost
DB_PORT=3307
DB_USER=root
DB_PASSWORD=changeme
JWT_SECRET=changeme
```

> ⚠️ No subir el archivo `.env` al repositorio. Asegúrate de que esté incluido en `.gitignore`.

---

## Bases de Datos

Crear las siguientes bases de datos en MySQL:

```sql
CREATE DATABASE usuario_db;
CREATE DATABASE product_db;
CREATE DATABASE inventory_db;
CREATE DATABASE orders_db;
CREATE DATABASE payments_db;
```

Puerto por defecto: `3307`

---

## Ejecución con Docker Compose

Desde la raíz del proyecto ejecutar:

```bash
docker compose up --build
```

Servicios principales:

| Servicio | URL |
|----------|-----|
| Frontend | http://localhost |
| API Gateway | http://localhost:8061 |
| Eureka Server | http://localhost:8762 |
| Config Server | http://localhost:8089 |

---

## Ejecución Manual

Orden recomendado para iniciar los servicios:

1. `service-registry`
2. `config-server`
3. `api-gateway`
4. `usuario-service`
5. `auth-service`
6. `product-service`
7. `inventory-service`
8. `order-service`
9. `payment-service`
10. `frontend-V`

Para ejecutar un microservicio Spring Boot:

```bash
mvn spring-boot:run
```

Para ejecutar el frontend:

```bash
cd frontend-V
npm install
ng serve
```

---

## Endpoints Principales

### Autenticación
POST   /api/v1/auth/login
### Usuarios
POST   /api/v1/usuarios/register
GET    /api/v1/usuarios/{id}
### Productos
GET    /api/v1/products
GET    /api/v1/products/{id}
POST   /api/v1/products
PUT    /api/v1/products/{id}
DELETE /api/v1/products/{id}
### Inventario
GET    /api/v1/inventory
GET    /api/v1/inventory/{productId}
PUT    /api/v1/inventory/{productId}
### Órdenes
POST   /api/v1/orders
GET    /api/v1/orders/{id}
GET    /api/v1/orders
### Pagos
POST   /api/v1/payments
GET    /api/v1/payments/{orderId}

---

## Seguridad

El sistema utiliza **JWT** para autenticación. El API Gateway valida el token en las rutas protegidas y restringe rutas administrativas según el rol del usuario.

Roles principales:

- `ADMIN`
- `CLIENTE`

---

## Resiliencia

El sistema implementa **Resilience4j** para tolerancia a fallos en las siguientes ubicaciones:

- **API Gateway**: Circuit Breaker en el enrutamiento a microservicios.
- **Order Service**: Circuit Breaker, Retry y fallback en las llamadas a Product, Inventory y Payment Service.
- **Inventory Service**: Circuit Breaker y Retry.

---

## Funcionalidades

- Login de usuarios
- Registro de usuarios
- Gestión de productos
- Gestión de inventario
- Carrito de compras
- Creación de órdenes
- Cálculo de subtotal, IGV (18%) y total
- Procesamiento de pagos (simulado)
- Protección de rutas con JWT
- Registro de servicios con Eureka
- Configuración centralizada
- Dockerización del sistema

---

## Evidencias del Proyecto

Para la sustentación se incluyen evidencias de:

- Repositorio GitHub
- Diagramas de arquitectura (C4)
- Swagger / OpenAPI
- Eureka Dashboard
- Docker Compose
- Frontend Angular
- Pruebas funcionales
- Seguridad JWT
- Resiliencia
- Balanceo de carga

---

## Autores

Equipo de Desarrollo - ITMAC Future
Curso: Desarrollo de Aplicaciones Distribuidas
