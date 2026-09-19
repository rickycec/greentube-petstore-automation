Feature: Pet request validation
  The Pet API should reject unsupported request representations.

  Background:
    Given a new pet payload

  Scenario: Reject an unsupported media type
    When I create the pet with content type "text/plain"
    Then the response status should be 415
    When I retrieve the pet by ID
    Then the response status should be 404