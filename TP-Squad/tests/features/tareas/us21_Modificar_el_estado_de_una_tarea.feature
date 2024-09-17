Feature: Modify status task
  Scenario: Status changed succesfully
    Given the projects
      |      name           | objective                                               | deadline      | leader  | aprox_time | status      |
      | CORE_ERP_v12        | add features to configurate a flexible cost calculator  | 2024-12-31    | Isaias  | 120h       | in progress |
      | PROYECTS_SERVICE_v2 | add feature to interact with ERP to estimate costs      | 2024-07-25    | None    | 70h        | in progress |
    Given the tasks
      |     title           | objective                           | project             | assigne  | start       | end         | status     |
      | fix issue on events | project view not redirecting events | PROYECTS_SERVICE_v2 | None     | 2024-12-31  | 2024-12-31  | NEW        |
      | fix issue on jsons  | jsons are malformed on responses    | PROYECTS_SERVICE_v2 | None     | 2024-12-31  | 2024-12-31  | NEW        |
      | fix issue on jsons  | jsons are malformed on responses    | CORE_ERP_v12        | None     | 2024-10-31  | 2024-12-31  | in progress|
    When the user modifies the status for "fix issue on jsons" on "CORE_ERP_v12" to "closed"
    Then the status of the task "fix issue on jsons" on "CORE_ERP_v12" is changed to "closed"

  Scenario: Task does not exist
    Given the projects
      |      name           | objective                                               | deadline      | leader  | aprox_time | status      |
      | CORE_ERP_v12        | add features to configurate a flexible cost calculator  | 2024-12-31    | Isaias  | 120h       | in progress |
      | PROYECTS_SERVICE_v2 | add feature to interact with ERP to estimate costs      | 2024-07-25    | None    | 70h        | in progress |
    Given the tasks
      |     title           | objective                           | project             | assigne  | start       | end         | status     |
      | fix issue on events | project view not redirecting events | PROYECTS_SERVICE_v2 | None     | 2024-12-31  | 2024-12-31  | NEW        |
      | fix issue on jsons  | jsons are malformed on responses    | PROYECTS_SERVICE_v2 | None     | 2024-12-31  | 2024-12-31  | NEW        |
      | fix issue on jsons  | jsons are malformed on responses    | CORE_ERP_v12        | None     | 2024-10-31  | 2024-12-31  | in progress|
    When the user modifies the status for "fix issue on events" on "CORE_ERP_v12" to "closed"
    Then the admin is notified that the task does not exist on project


  Scenario: Status is invalid
    Given the projects
      |      name           | objective                                               | deadline      | leader  | aprox_time | status      |
      | CORE_ERP_v12        | add features to configurate a flexible cost calculator  | 2024-12-31    | Isaias  | 120h       | in progress |
      | PROYECTS_SERVICE_v2 | add feature to interact with ERP to estimate costs      | 2024-07-25    | None    | 70h        | in progress |
    Given the tasks
      |     title           | objective                           | project             | assigne  | start       | end         | status     |
      | fix issue on events | project view not redirecting events | PROYECTS_SERVICE_v2 | None     | 2024-12-31  | 2024-12-31  | NEW        |
      | fix issue on jsons  | jsons are malformed on responses    | PROYECTS_SERVICE_v2 | None     | 2024-12-31  | 2024-12-31  | NEW        |
      | fix issue on jsons  | jsons are malformed on responses    | CORE_ERP_v12        | None     | 2024-10-31  | 2024-12-31  | in progress|
    When the user modifies the status for "fix issue on jsons" on "CORE_ERP_v12" to "in review"
    Then the admin is notified that the status of task is invalid