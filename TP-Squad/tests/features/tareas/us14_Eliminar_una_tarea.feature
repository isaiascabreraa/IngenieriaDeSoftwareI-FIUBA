Feature: Delete a task as leader

  Scenario: Task does not exist to be deleted
    Given the projects
      |      name           | objective                                               | deadline      | leader  | aprox_time | status      |
      | CORE_ERP_v12        | add features to configurate a flexible cost calculator  | 2024-12-31    | Isaias  | 120h       | in progress |
      | PROYECTS_SERVICE_v2 | add feature to interact with ERP to estimate costs      | 2024-07-25    | None    | 70h        | in progress |
    Given the tasks
      |     title           | objective                           | project             | assigne  | start       | end         | status     |
      | fix issue on events | project view not redirecting events | PROYECTS_SERVICE_v2 | None     | 2024-12-31  | 2024-12-31  | NEW        |
      | fix issue on jsons  | jsons are malformed on responses    | PROYECTS_SERVICE_v2 | None     | 2024-12-31  | 2024-12-31  | NEW        |
      | fix issue on jsons  | jsons are malformed on responses    | CORE_ERP_v12        | None     | 2024-10-31  | 2024-12-31  | in progress|

    When the admin deletes a task with title "fix issue on events" on project "CORE_ERP_v12"
    Then the admin is notified that the task does not exist on project

  Scenario: Task is deleted
    Given the projects
      |      name           | objective                                               | deadline      | leader  | aprox_time | status      |
      | CORE_ERP_v12        | add features to configurate a flexible cost calculator  | 2024-12-31    | Isaias  | 120h       | in progress |
      | PROYECTS_SERVICE_v2 | add feature to interact with ERP to estimate costs      | 2024-07-25    | None    | 70h        | in progress |
    Given the tasks
      |     title           | objective                           | project             | assigne  | start       | end         | status     |
      | fix issue on events | project view not redirecting events | PROYECTS_SERVICE_v2 | None     | 2024-12-31  | 2024-12-31  | NEW        |
      | fix issue on jsons  | jsons are malformed on responses    | PROYECTS_SERVICE_v2 | None     | 2024-12-31  | 2024-12-31  | NEW        |
      | fix issue on jsons  | jsons are malformed on responses    | CORE_ERP_v12        | None     | 2024-10-31  | 2024-12-31  | in progress|
      
    When the admin deletes a task with title "fix issue on jsons" on project "PROYECTS_SERVICE_v2"
    Then the task with title "fix issue on jsons" is deleted from "PROYECTS_SERVICE_v2"