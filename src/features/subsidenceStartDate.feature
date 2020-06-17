Feature: FFC Demo App Start Page

Scenario: Enter a date for the start of subsidence

Given I open the url "https://ffc-demo.ffc-dev.aws-int.defra.cloud/claim/date-of-subsidence"
And I clear the inputfield "#date-of-subsidence-day"
And I add "01" to the inputfield "#date-of-subsidence-day"
And I clear the inputfield "#date-of-subsidence-month"
And I add "01" to the inputfield "#date-of-subsidence-month"
And I clear the inputfield "#date-of-subsidence-year"
And I add "1970" to the inputfield "#date-of-subsidence-year"
And I click on the button ".govuk-button"
Then  I expect that the url is "https://ffc-demo.ffc-dev.aws-int.defra.cloud/claim/mine-type"