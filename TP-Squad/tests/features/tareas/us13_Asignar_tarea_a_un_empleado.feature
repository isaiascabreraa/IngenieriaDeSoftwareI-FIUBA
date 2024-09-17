Feature: Assign worker to task

  Scenario: Task does not exist on project
    Given the projects
      |      name           | objective                                               | deadline      | leader  | aprox_time | status      |
      | CORE_ERP_v12        | add features to configurate a flexible cost calculator  | 2024-12-31    | Isaias  | 120h       | in progress |
      | PROYECTS_SERVICE_v2 | add feature to interact with ERP to estimate costs      | 2024-07-25    | None    | 70h        | in progress |
    Given the tasks
      |     title           | objective                           | project             | assigne  | start       | end         | status     |
      | fix issue on events | project view not redirecting events | PROYECTS_SERVICE_v2 | None     | 2024-12-31  | 2024-12-31  | NEW        |
      | fix issue on jsons  | jsons are malformed on responses    | PROYECTS_SERVICE_v2 | None     | 2024-12-31  | 2024-12-31  | NEW        |
      | fix issue on jsons  | jsons are malformed on responses    | CORE_ERP_v12        | None     | 2024-10-31  | 2024-12-31  | in progress|
    And the employees
      | name     | worker_number |
      | Isaias   | 1             |
      | Marcelo  | 2             |

    When the leader assigns "Marcelo" as the assigne of "refact: make new database design" on "PROYECTS_SERVICE_v2"
    Then the admin is notified that the task does not exist on project

  Scenario: Task is assigned worker succesfully
    Given the projects
      |      name           | objective                                               | deadline      | leader  | aprox_time | status      |
      | CORE_ERP_v12        | add features to configurate a flexible cost calculator  | 2024-12-31    | Isaias  | 120h       | in progress |
      | PROYECTS_SERVICE_v2 | add feature to interact with ERP to estimate costs      | 2024-07-25    | None    | 70h        | in progress |
    Given the tasks
      |     title           | objective                           | project             | assigne  | start       | end         | status     |
      | fix issue on events | project view not redirecting events | PROYECTS_SERVICE_v2 | None     | 2024-12-31  | 2024-12-31  | NEW        |
      | fix issue on jsons  | jsons are malformed on responses    | PROYECTS_SERVICE_v2 | None     | 2024-12-31  | 2024-12-31  | NEW        |
      | fix issue on jsons  | jsons are malformed on responses    | CORE_ERP_v12        | None     | 2024-10-31  | 2024-12-31  | in progress|
    And the employees
      | name     | worker_number |
      | Isaias   | 1             |
      | Marcelo  | 2             |
    When the leader assigns "Marcelo" as the assigne of "fix issue on events" on "PROYECTS_SERVICE_v2"            
    Then "Marcelo" is added as the assignee of "fix issue on events" on "PROYECTS_SERVICE_v2"

  Scenario: Task is re-assigned worker succesfully
    Given the projects
      |      name           | objective                                               | deadline      | leader  | aprox_time | status      |
      | CORE_ERP_v12        | add features to configurate a flexible cost calculator  | 2024-12-31    | Isaias  | 120h       | in progress |
      | PROYECTS_SERVICE_v2 | add feature to interact with ERP to estimate costs      | 2024-07-25    | None    | 70h        | in progress |
    Given the tasks
      |     title           | objective                           | project             | assigne  | start       | end         | status     |
      | fix issue on events | project view not redirecting events | PROYECTS_SERVICE_v2 | None     | 2024-12-31  | 2024-12-31  | NEW        |
      | fix issue on jsons  | jsons are malformed on responses    | PROYECTS_SERVICE_v2 | None     | 2024-12-31  | 2024-12-31  | NEW        |
      | fix issue on jsons  | jsons are malformed on responses    | CORE_ERP_v12        | Marcelo  | 2024-10-31  | 2024-12-31  | in progress|
    And the employees
      | name     | worker_number |
      | Isaias   | 1             |
      | Marcelo  | 2             |
    When the leader assigns "Isaias" as the assigne of "fix issue on jsons" on "CORE_ERP_v12"            
    Then "Isaias" is added as the assignee of "fix issue on jsons" on "CORE_ERP_v12"
