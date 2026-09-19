Feature: Pet lifecycle
  The Pet API should persist and return pet records consistently.

  Background:
    Given a new pet payload

  Scenario: Create and retrieve a pet
    When I create the pet
    Then the response status should be 200
    And the response content type should be JSON
    And the created pet should match the submitted payload
    When I retrieve the pet by ID
    Then the response status should be 200
    And the response content type should be JSON
    And the retrieved pet should match the created pet

  Scenario: Update an existing pet
    Given the pet exists
    When I update the pet name and status
    Then the response status should be 200
    And the response content type should be JSON
    And the update response should match the requested changes
    When I retrieve the pet by ID
    Then the response status should be 200
    And the response content type should be JSON
    And the retrieved pet should match the updated pet

  Scenario: Delete an existing pet
    Given the pet exists
    When I delete the pet
    Then the response status should be 200
    When I retrieve the pet by ID
    Then the response status should be 404