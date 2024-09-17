Feature: Modify project deadline
  Scenario: Deadline changed succesfully
    Given the projects
      |      name           | objective                                               | deadline      | leader  | aprox_time | status      |
      | CORE_ERP_v12        | add features to configurate a flexible cost calculator  | 2024-12-31    | None    | 120h       | in progress |
      | PROYECTS_SERVICE_v2 | add feature to interact with ERP to estimate costs      | 2024-07-25    | None    | 70h        | closed      |
    When the leader modifies the deadline for "CORE_ERP_v12" to "2025-12-30"
    Then the deadline of the project "CORE_ERP_v12" is changed to "2025-12-30"

  Scenario: Project does not exist
    Given the projects
      |      name           | objective                                               | deadline      | leader  | aprox_time | status      |
      | CORE_ERP_v12        | add features to configurate a flexible cost calculator  | 2024-12-31    | None    | 120h       | in progress |
      | PROYECTS_SERVICE_v2 | add feature to interact with ERP to estimate costs      | 2024-07-25    | None    | 70h        | closed      |
    When the leader modifies the deadline for "CORE_PHYSICS_ENG_v2.1" to "2025-12-30"
    Then the admin is notified that the project does not exist


  Scenario: Time is invalid
    Given the projects
      |      name           | objective                                               | deadline      | leader  | aprox_time | status      |
      | CORE_ERP_v12        | add features to configurate a flexible cost calculator  | 2024-12-31    | None    | 120h       | in progress |
      | PROYECTS_SERVICE_v2 | add feature to interact with ERP to estimate costs      | 2024-07-25    | None    | 70h        | closed      |
    When the leader modifies the deadline for "CORE_ERP_v12" to "2022-12-30"
    Then the admin is notified that the deadline is invalid