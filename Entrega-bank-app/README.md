
# memo1-bank-app
Memo1 - Backend API

1. API REST
En esta sección de la actividad deberán agregar a la ya existente API REST vista en el video “MMI-Introducción al desarrollo backend con SpringBoot”, el desarrollo de la funcionalidad que soporte transacciones del tipo extracción y depósito. Se debe agregar la capacidad de crear transacciones de ambos tipos (extracción y depósito), leer todas las transacciones dada una cuenta existente, leer una transacción en particular y, por último, poder eliminar una transacción con su correspondiente rollback.
Para realizar esto, se deberán agregar los endpoints pertinentes en la capa de controller, la lógica de negocio necesaria en la capa de service, y por último, la nueva entidad del dominio junto con su capa de data access (repositorio/DAO).
Las reglas de negocio son:
No permitir depósitos de montos nulos o negativos
No permitir extracciones mayores al saldo de la cuenta
2. BDD
Se ha agregado una nueva feature en el archivo gherkin bank_account_operations.feature.
Bank account promo, get 10% extra in your $2000+ deposits, up to $500
Esta feature posee los siguientes escenarios:
Successfully promo applied, cap not reached
Successfully promo applied, cap reached
Promo not applied

En esta sección de la actividad corresponde desarrollar (codear) las pruebas necesarias para pasar/correr estos escenarios, así como también actualizar la lógica de negocio (capa de service) para cumplir con estas nuevas reglas y que las pruebas sean satisfactorias.