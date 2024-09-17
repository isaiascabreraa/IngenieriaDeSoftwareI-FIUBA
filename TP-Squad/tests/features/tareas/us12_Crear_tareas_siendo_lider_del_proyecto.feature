Feature: Create a task as leader

  Scenario: Task with same title on same project is not valid
    Given the projects
      |      name           | objective                                               | deadline      | leader  | aprox_time | status      |
      | CORE_ERP_v12        | add features to configurate a flexible cost calculator  | 2024-12-31    | Isaias  | 120h       | in progress |
      | PROYECTS_SERVICE_v2 | add feature to interact with ERP to estimate costs      | 2024-07-25    | None    | 70h        | in progress |
    Given the tasks
      |     title           | objective                           | project             | assigne  | start       | end         | status  |
      | fix issue on events | project view not redirecting events | PROYECTS_SERVICE_v2 | None     | 2024-12-31  | 2024-12-31  | NEW     |

    When the admin creates a task with title "fix issue on events" on "PROYECTS_SERVICE_v2"
    Then the admin is notified that the task already exists on the project and duplicates are not allowed

  Scenario: Task with same title on different project is fine
    Given the projects
      |      name           | objective                                               | deadline      | leader  | aprox_time | status      |
      | CORE_ERP_v12        | add features to configurate a flexible cost calculator  | 2024-12-31    | Isaias  | 120h       | in progress |
      | PROYECTS_SERVICE_v2 | add feature to interact with ERP to estimate costs      | 2024-07-25    | None    | 70h        | in progress |
    Given the tasks
      |     title           | objective                           | project             | assigne  | start       | end         | status  |
      | fix issue on events | project view not redirecting events | PROYECTS_SERVICE_v2 | None     | 2024-12-31  | 2024-12-31  | NEW     |

    When the admin creates a task with title "fix issue on events" on "CORE_ERP_v12"
    Then the task with title  "fix issue on events" is created on "CORE_ERP_v12"

  Scenario: Task with different title is created
    Given the projects
      |      name           | objective                                               | deadline      | leader  | aprox_time | status      |
      | CORE_ERP_v12        | add features to configurate a flexible cost calculator  | 2024-12-31    | Isaias  | 120h       | in progress |
      | PROYECTS_SERVICE_v2 | add feature to interact with ERP to estimate costs      | 2024-07-25    | None    | 70h        | in progress |
    Given the tasks
      |     title           | objective                           | project             | assigne  | start       | end         | status  |
      | fix issue on events | project view not redirecting events | PROYECTS_SERVICE_v2 | None     | 2024-12-31  | 2024-12-31  | NEW     |

    When the admin creates a task with title "fix issue on jsons" on "PROYECTS_SERVICE_v2"
    Then the task with title  "fix issue on jsons" is created on "PROYECTS_SERVICE_v2"



  Scenario: Task created on non existent project
    Given the projects
      |      name           | objective                                               | deadline      | leader  | aprox_time | status      |
      | CORE_ERP_v12        | add features to configurate a flexible cost calculator  | 2024-12-31    | Isaias  | 120h       | in progress |
      | PROYECTS_SERVICE_v2 | add feature to interact with ERP to estimate costs      | 2024-07-25    | None    | 70h        | in progress |
    Given the tasks
      |     title           | objective                           | project             | assigne  | start       | end         | status  |
      | fix issue on events | project view not redirecting events | PROYECTS_SERVICE_v2 | None     | 2024-12-31  | 2024-12-31  | NEW     |

    When the admin creates a task with title "fix issue on jsons" on "PROYECTS_SERVICE_v3"
    Then the admin is notified that the project does not exist

