Feature: Delete a project as leader

  Scenario: project does not exist to be deleted
    Given the projects
      |      name           | objective                                               | deadline      | leader  | aprox_time | status      |
      | CORE_ERP_v12        | add features to configurate a flexible cost calculator  | 2024-12-31    | None    | 120h       | in progress |
      | PROYECTS_SERVICE_v2 | add feature to interact with ERP to estimate costs      | 2024-08-25    | None    | 70h        | closed      |
      | SUPPORT_SERVICE_v2  | add feature to associate a version with a project       | 2024-08-25    | None    | 70h        | closed      |
      | PROYECTS_SERVICE_v3 | add support for fase and iterations                     | 2025-07-25    | None    | 10h        | NEW      |
    When the admin deletes the project with name "CORE_PHYSICS_ENG_v2.43"
    Then the admin is notified that the project does not exist

  Scenario: project is deleted
    Given the projects
      |      name           | objective                                               | deadline      | leader  | aprox_time | status      |
      | CORE_ERP_v12        | add features to configurate a flexible cost calculator  | 2024-12-31    | None    | 120h       | in progress |
      | PROYECTS_SERVICE_v2 | add feature to interact with ERP to estimate costs      | 2024-08-25    | None    | 70h        | closed      |
      | SUPPORT_SERVICE_v2  | add feature to associate a version with a project       | 2024-08-25    | None    | 70h        | closed      |
      | PROYECTS_SERVICE_v3 | add support for fase and iterations                     | 2025-07-25    | None    | 10h        | NEW         |
    When the admin deletes the project with name "PROYECTS_SERVICE_v3"
    Then the project with name "PROYECTS_SERVICE_v3" is deleted