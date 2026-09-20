# GameTwist Registration and Login — Selected Test Flows and Test Cases

## Rationale

These ten test cases have been selected to provide risk-based coverage of the most important registration and login behaviours while keeping the scope focused (a maximum of 10 test cases were required).

Together, the cases cover core customer journeys, key business rules, account-access safeguards, validation feedback, and the main navigation paths available to a visitor. They are not an exhaustive suite, just some representative examples.

## Registration Flows

### REG-01 — Successful registration submission and email-confirmation request for an eligible new user

```gherkin
Given a visitor is on the Registration form
When the visitor enters a valid email address
And enters an available nickname
And enters a password that meets the password requirements
And selects a date of birth confirming that they are at least 18 years old
And completes the required CAPTCHA verification
And accepts the GTC and data protection guidelines
And selects "Begin Adventure"
Then the registration request is submitted successfully
And the visitor is shown the email-confirmation screen
And the visitor sees a message that a confirmation email has been sent to the entered email address
And the entered email address is displayed on the confirmation screen
And the visitor is instructed to use the confirmation link in the email to activate the gaming account
```

### REG-02 — Prevention of duplicate registration using an existing email address

```gherkin
Given a visitor is on the Registration form
And an account already exists with the email address entered by the visitor
And the visitor has entered valid information in all required fields except the email
When the visitor enters the existing email address
And selects "Begin Adventure"
Then the email confirmation screen is not shown
And the visitor sees a message under the email field stating that the email address is already in use
```

### REG-03 — Suggested alternatives for an unavailable nickname

```gherkin
Given a visitor is on the Registration form
And an account already exists with the nickname selected by the visitor
When the visitor enters the existing nickname
Then the visitor is informed that the nickname is already taken
And possible nickname alternatives available to use are shown under the nickname field
```

### REG-04 — Prevention of registration by an underage visitor

```gherkin
Given a visitor is on the Registration form
And the visitor has entered valid information in all required fields
When the visitor selects a date of birth showing that they are below 18 years old
And selects "Begin Adventure"
Then the email confirmation screen is not shown
And the visitor sees a clear message stating that the minimum legal age for using the website is 18 years
```

### REG-05 — Mandatory acceptance of GTC and data protection guidelines

```gherkin
Given a visitor is on the Registration form
And the visitor has entered valid information in all required fields
When the visitor leaves the GTC and data protection guidelines unchecked
And selects "Begin Adventure"
Then the email confirmation screen is not shown
And the visitor sees a message stating that they must agree to the General Terms and Conditions to continue
```

### REG-06 — Enforcement of password requirements during registration

```gherkin
Given a visitor is on the Registration form
When the visitor enters a password that does not meet the displayed password requirements
Then the visitor sees a clear password validation message
And the visitor cannot complete registration until a valid password is entered
```

## Login Flows

### LOG-01 — Successful authentication using valid registered credentials

```gherkin
Given a registered user is on the Login form
When the user enters a valid registered nickname
And enters the matching valid password
And selects "Log in"
Then the user is authenticated successfully
And the user is redirected to the homepage
```

### LOG-02 — Rejection of authentication with an invalid password

```gherkin
Given a registered user is on the Login form
And the user enters a valid registered nickname
When the user enters an invalid password
And selects "Log in"
Then the user is not authenticated
And the user sees a message stating an incorrect nickname/password combination
```

### LOG-03 — Successful submission of a password-recovery request for a registered user

```gherkin
Given a registered user is on the Login form
And the user selects "Forgotten your password?"
When the user is shown the Forgotten Password form
And the user enters their registered nickname
And enters the email address associated with the account
And selects "Send"
Then the password-recovery request is submitted successfully
And the user sees a message explaining that, if an account matches the submitted information, an email with a password reset link will be sent
```

### LOG-04 — Availability of the account registration path from login

```gherkin
Given a visitor is on the Login form
When the visitor selects "Register now"
Then the visitor is taken to the Registration page
And the visitor can start the new-account registration process
```

## Automation Decisions and Test Approach

The following decisions have been made by taking into consideration regression value, repeatability, reliability, test-data control, and the suitability of the behaviour for automated UI testing.

### REG-01 — Successful registration submission and email-confirmation request for an eligible new user

**Decision:** Not fully automated as an end-to-end UI test.

**Reason:** This flow contains CAPTCHA verification and delivery of a confirmation email. A real CAPTCHA is intentionally designed to prevent automated completion, while successful email delivery and activation require access to a controlled mailbox. Automating the entire flow against a live public environment is not recommended.

**Approach to ensure the application works:** Execute this flow manually using a dedicated test email address. Verify that the confirmation screen appears, that it displays the entered email address, and that the confirmation email arrives in the test mailbox. Open the confirmation link and verify that the account is activated and can log in.
If we want this test to be fully automatable in the future we need a controlled test environment where there is an approved CAPTCHA test bypass and a test mailbox/API.


### REG-02 — Prevention of duplicate registration using an existing email address

**Decision:** Automate.

**Reason:** Duplicate email validation has high regression value and the result is deterministic. The test can run with a controlled pre-existing test account and does not need to complete the full registration or create a new account.

### REG-03 — Suggested alternatives for an unavailable nickname

**Decision:** Automate.

**Reason:** This is a repeatable validation and usability behaviour. It checks both that an unavailable nickname is identified and that usable alternatives are offered. It is valuable because it supports successful registration and may be affected by changes to nickname validation or suggestion logic.

### REG-04 — Prevention of registration by an underage visitor

**Decision:** Automate.

**Reason:** Age eligibility is a deterministic and compliance requirement. The test can use a date of birth that is below the age threshold and verify that registration is prevented and the expected message is displayed. It is a strong regression test because an error in this rule carries significant product risk.

### REG-05 — Mandatory acceptance of GTC and data protection guidelines

**Decision:** Automate.

**Reason:** Acceptance of the GTC and data protection guidelines is a deterministic and compliance requirement. The test should be included in regression coverage because an missing this check can carry legal risks.

### REG-06 — Enforcement of password requirements during registration

**Decision:** Automate.

**Reason:** Password validation is a deterministic rule that can be checked efficiently with multiple representative invalid values. It is security relevant and therefore has a strong regression value.

### LOG-01 — Successful authentication using valid registered credentials

**Decision:** Automate.

**Reason:** Successful login is a critical and frequently used customer journey. It has clear inputs and expected outcomes and should be part of regular regression testing. The test should use a dedicated active account whose credentials are securely managed in the test environment.

### LOG-02 — Rejection of authentication with an invalid password

**Decision:** Automate.

**Reason:** Invalid-credential handling is a repeatable and security-relevant scenario. Verifying that the access is not granted helps prevent regressions in authentication.

### LOG-03 — Successful submission of a password-recovery request for a registered user

**Decision:** Partially automate.

**Reason:** Opening the password-recovery form, entering nickname and email, submitting the request, and verifying the generic confirmation message are deterministic UI checks with a good regression value.

But the complete recovery journey includes delivery of an email and use of a time-limited password-reset link, which introduces external dependencies.

**Approach to ensure the complete feature works:** Automate the form submission and confirmation-message checks using a dedicated test account. Then, in a controlled test environment, use a dedicated test mailbox to retrieve the reset email, open the reset link, set a new password, and verify that the user can log in with the new password.

### LOG-04 — Availability of the account registration path from login

**Decision:** Automate.

**Reason:** This is a stable and low-maintenance navigation check, even if it is a low-risk use case. It supports a conversion path and can be included in a UI smoke or regression suite.
