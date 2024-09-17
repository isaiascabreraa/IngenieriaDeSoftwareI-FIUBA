Feature: Filter by state
  Scenario: Filter by state succesful closed, multiple
    Given the projects
      |      name           | objective                                               | deadline      | leader  | aprox_time | status      |
      | CORE_ERP_v12        | add features to configurate a flexible cost calculator  | 2024-12-31    | None    | 120h       | in progress |
      | PROYECTS_SERVICE_v2 | add feature to interact with ERP to estimate costs      | 2024-08-25    | None    | 70h        | closed      |
      | SUPPORT_SERVICE_v2  | add feature to associate a version with a project       | 2024-08-25    | None    | 70h        | closed      |
      | PROYECTS_SERVICE_v3 | add support for fase and iterations                     | 2025-07-25    | None    | 10h        | NEW      |
    When the leader filters by state "closed"
    Then the systems shows the projects
      |      name           | objective                                               | deadline      | leader  | aprox_time | status      |
      | PROYECTS_SERVICE_v2 | add feature to interact with ERP to estimate costs      | 2024-08-25    | None    | 70h        | closed      |
      | SUPPORT_SERVICE_v2  | add feature to associate a version with a project       | 2024-08-25    | None    | 70h        | closed      |
  Scenario: Filter by state succesful in progress
    Given the projects
      |      name           | objective                                               | deadline      | leader  | aprox_time | status      |
      | CORE_ERP_v12        | add features to configurate a flexible cost calculator  | 2024-12-31    | None    | 120h       | in progress |
      | PROYECTS_SERVICE_v2 | add feature to interact with ERP to estimate costs      | 2024-08-25    | None    | 70h        | closed      |
      | SUPPORT_SERVICE_v2  | add feature to associate a version with a project       | 2024-08-25    | None    | 70h        | closed      |
      | PROYECTS_SERVICE_v3 | add support for fase and iterations                     | 2025-07-25    | None    | 10h        | NEW      |
    When the leader filters by state "in progress"
    Then the systems shows the projects
      |      name           | objective                                               | deadline      | leader  | aprox_time | status      |
      | CORE_ERP_v12        | add features to configurate a flexible cost calculator  | 2024-12-31    | None    | 120h       | in progress |
  Scenario: Filter by state new does not have projects
    Given the projects
      |      name           | objective                                               | deadline      | leader  | aprox_time | status      |
      | CORE_ERP_v12        | add features to configurate a flexible cost calculator  | 2024-12-31    | None    | 120h       | in progress |
      | PROYECTS_SERVICE_v2 | add feature to interact with ERP to estimate costs      | 2024-08-25    | None    | 70h        | closed      |
      | SUPPORT_SERVICE_v2  | add feature to associate a version with a project       | 2024-08-25    | None    | 70h        | closed      |
    When the leader filters by state "new"
    Then the systems notifies that there is no results