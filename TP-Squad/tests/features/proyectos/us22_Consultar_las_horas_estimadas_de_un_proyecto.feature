Feature: Request of aprox time
  Scenario: Project does not exist
    Given the projects
      |      name           | objective                                               | deadline      | leader  | aprox_time | status      |
      | CORE_ERP_v12        | add features to configurate a flexible cost calculator  | 2024-12-31    | None    | 120h       | in progress |
      | PROYECTS_SERVICE_v2 | add feature to interact with ERP to estimate costs      | 2024-07-25    | None    | 70h        | closed      |
    When the leader requests the project with name "CORE_PHYSICS_ENG_v2.1"
    Then the admin is notified that the project does not exist

  Scenario: Succesful request of in progress
    Given the projects
      |      name           | objective                                               | deadline      | leader  | aprox_time | status      |
      | CORE_ERP_v12        | add features to configurate a flexible cost calculator  | 2024-12-31    | None    | 120h       | in progress |
      | PROYECTS_SERVICE_v2 | add feature to interact with ERP to estimate costs      | 2024-07-25    | None    | 70h        | closed      |
    When the leader requests the project with name "CORE_ERP_v12"
    Then the project aprox time is 120h
  Scenario: Succesful request of closed
    Given the projects
      |      name           | objective                                               | deadline      | leader  | aprox_time | status      |
      | CORE_ERP_v12        | add features to configurate a flexible cost calculator  | 2024-12-31    | None    | 120h       | in progress |
      | PROYECTS_SERVICE_v2 | add feature to interact with ERP to estimate costs      | 2024-07-25    | None    | 70h        | closed      |
    When the leader requests the project with name "PROYECTS_SERVICE_v2"
    Then the project aprox time is 70h