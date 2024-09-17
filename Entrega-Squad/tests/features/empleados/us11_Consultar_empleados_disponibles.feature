Feature: Request of employees

  Scenario: succesful request  of employees
    Given the employees
      | name    | worker_number |
      | Isaias  | 1             |
      | Marcelo | 2             |
    When the user requests the employees
    Then the system shows the employees
      | name    | worker_number |
      | Isaias  | 1             |
      | Marcelo | 2             |

  Scenario: succesful request  of employees, no employees
    Given no employees
    When the user requests the employees
    Then the system notifies there is no employees 

  Scenario: failed request  of employees
    Given the employees
      | name    | worker_number |
      | Isaias  | 1             |
      | Marcelo | 2             |
    And the system is experiencing problems
    When the user requests the employees
    Then the system notifies there is something wrong and to try it later
