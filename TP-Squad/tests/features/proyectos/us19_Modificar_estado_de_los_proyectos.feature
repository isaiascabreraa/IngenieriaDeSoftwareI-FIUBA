Feature: Modify status project
  Scenario: Status changed succesfully
    Given the projects
      |      name           | objective                                               | deadline      | leader  | aprox_time | status      |
      | CORE_ERP_v12        | add features to configurate a flexible cost calculator  | 2024-12-31    | None    | 120h       | in progress |
      | PROYECTS_SERVICE_v2 | add feature to interact with ERP to estimate costs      | 2024-07-25    | None    | 70h        | closed      |
    When the leader modifies the status for "CORE_ERP_v12" to "closed"
    Then the status of the project "CORE_ERP_v12" is changed to "closed"

  Scenario: Project does not exist
    Given the projects
      |      name           | objective                                               | deadline      | leader  | aprox_time | status      |
      | CORE_ERP_v12        | add features to configurate a flexible cost calculator  | 2024-12-31    | None    | 120h       | in progress |
      | PROYECTS_SERVICE_v2 | add feature to interact with ERP to estimate costs      | 2024-07-25    | None    | 70h        | closed      |
    When the leader modifies the status for "CORE_PHYSICS_ENG_v2.1" to "closed"
    Then the admin is notified that the project does not exist

  Scenario: Status is invalid
    Given the projects
      |      name           | objective                                               | deadline      | leader  | aprox_time | status      |
      | CORE_ERP_v12        | add features to configurate a flexible cost calculator  | 2024-12-31    | None    | 120h       | in progress |
      | PROYECTS_SERVICE_v2 | add feature to interact with ERP to estimate costs      | 2024-07-25    | None    | 70h        | closed      |
    When the leader modifies the status for "CORE_ERP_v12" to "in deployment"
    Then the admin is notified that the status is invalid