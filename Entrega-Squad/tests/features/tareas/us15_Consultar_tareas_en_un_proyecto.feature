Feature: Request project tasks

  Scenario: Project does not exist
    Given the projects
      |      name           | objective                                               | deadline      | leader  | aprox_time | status      |
      | CORE_ERP_v12        | add features to configurate a flexible cost calculator  | 2024-12-31    | Isaias  | 120h       | in progress |
      | PROYECTS_SERVICE_v2 | add feature to interact with ERP to estimate costs      | 2024-07-25    | None    | 70h        | in progress |
    Given the tasks
      |     title           | objective                           | project             | assigne  | start       | end         | status     |
      | fix issue on events | project view not redirecting events | PROYECTS_SERVICE_v2 | None     | 2024-12-31  | 2024-12-31  | NEW        |
      | fix issue on jsons  | jsons are malformed on responses    | PROYECTS_SERVICE_v2 | None     | 2024-12-31  | 2024-12-31  | NEW        |
      | fix issue on jsons  | jsons are malformed on responses    | CORE_ERP_v12        | None     | 2024-10-31  | 2024-12-31  | in progress|

    When the leader requests the tasks from the project "CORE_PHYSICS_ENG_v2"
    Then the admin is notified that the project does not exist

  Scenario: Project has no tasks 
    Given the projects
      |      name           | objective                                               | deadline      | leader  | aprox_time | status      |
      | CORE_ERP_v12        | add features to configurate a flexible cost calculator  | 2024-12-31    | Isaias  | 120h       | in progress |
      | PROYECTS_SERVICE_v2 | add feature to interact with ERP to estimate costs      | 2024-07-25    | None    | 70h        | in progress |
      | PROYECTS_SERVICE_v3 | refactor of db scheme to optimize at scale              | 2024-12-25    | None    | 70h        | in progress |
    Given the tasks
      |     title           | objective                           | project             | assigne  | start       | end         | status     |
      | fix issue on events | project view not redirecting events | PROYECTS_SERVICE_v2 | None     | 2024-12-31  | 2024-12-31  | NEW        |
      | fix issue on jsons  | jsons are malformed on responses    | PROYECTS_SERVICE_v2 | None     | 2024-12-31  | 2024-12-31  | NEW        |
      | fix issue on jsons  | jsons are malformed on responses    | CORE_ERP_v12        | None     | 2024-10-31  | 2024-12-31  | in progress|

    When the leader requests the tasks from the project "PROYECTS_SERVICE_v3"
    Then the admin is notified that the project has no tasks

  Scenario: Project has multiple tasks
    Given the projects
      |      name           | objective                                               | deadline      | leader  | aprox_time | status      |
      | CORE_ERP_v12        | add features to configurate a flexible cost calculator  | 2024-12-31    | Isaias  | 120h       | in progress |
      | PROYECTS_SERVICE_v2 | add feature to interact with ERP to estimate costs      | 2024-07-25    | None    | 70h        | in progress |
      | PROYECTS_SERVICE_v3 | refactor of db scheme to optimize at scale              | 2024-12-25    | None    | 70h        | in progress |
    Given the tasks
      |     title           | objective                           | project             | assigne  | start       | end         | status     |
      | fix issue on events | project view not redirecting events | PROYECTS_SERVICE_v2 | None     | 2024-12-31  | 2024-12-31  | NEW        |
      | fix issue on jsons  | jsons are malformed on responses    | PROYECTS_SERVICE_v2 | None     | 2024-12-31  | 2024-12-31  | NEW        |
      | fix issue on jsons  | jsons are malformed on responses    | CORE_ERP_v12        | None     | 2024-10-31  | 2024-12-31  | in progress|

    When the leader requests the tasks from the project "PROYECTS_SERVICE_v2"
    Then the systems shows the tasks
      |     title           | objective                           | project             | assigne  | start       | end         | status     |
      | fix issue on events | project view not redirecting events | PROYECTS_SERVICE_v2 | None     | 2024-12-31  | 2024-12-31  | NEW        |
      | fix issue on jsons  | jsons are malformed on responses    | PROYECTS_SERVICE_v2 | None     | 2024-12-31  | 2024-12-31  | NEW        |