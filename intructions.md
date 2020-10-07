# Backend Challenge: Repeating Reviews

Lattice has a tool called "automated reviews". This tool allows our HR admins to setup simple "rules" which automatically launch reviews for their employees at a regular cadence.

A `rule` has two properties:

1. `firstReviewMonthsAfterStartDate` (Int) - The number of months after an employee's start date from which we launch their first review
2. `repeatingMonthlyCadence` (Int) - The number of months to wait between launching reviews

An `employee` has three properties:

1. `id` (Int) - The unique identifier for the employee
2. `name` (Text) - How the employee likes to be referred to as
3. `startDate` (Text) - The date the employee started at the company, formatted as an ISO8601 date string (YYYY-MM-DD)

For example, consider an employee "Sally" who started on "January 15, 2020". We have a rule in which `firstReviewMonthsAfterStartDate` is `2` and
`repeatingMonthlyCadence` is `1`. Sally's next 5 reviews would be launched on dates:

- 2020-03-13
- 2020-04-15
- 2020-05-15
- 2020-06-15
- 2020-07-15

You'll notice a couple things here. First, Sally's first review was launched in March, not February. This is because we needed to wait 2 months before the rule kicked in for Sally. Second, Sally's first review in March was launched on the 13th, not on the 15th. This is because automated reviews have a few rules.

1. **Reviews must launch on a weekday**. If an automated review is to launch on the weekend (Saturday or Sunday), it is instead launched on the previous Friday.
2. **Reviews must launch in the correct month**. Let's say Sally started on January 31st. Her first review is to be launched in March (because `firstReviewMonthsAfterStartDate` is `2`) -- specifically on March 31st. Her second review is to be launched in April (because `repeatingMonthlyCadence` is `1`) -- specifically April 31st. However, April doesn't have 31 days, it only has 30. Instead of launching the review in the next month on May 1st, Sally's second review should be launched on the last day of the _correct_ month, April 30th.

We now want to add a feature to this tool. We want the ability to show an HR admin the dates of the 10 upcoming reviews that will be launched by an automated rule. This will help the HR admins debug rules as they're editing them as well as prepare for reviews that will launch soon.

So here's the challenge: Write a function that takes three parameters: (1) a rule, (2) a list of employees, and (3) a timestamp, and then returns the next 10 reviews for each employee.

## Example

```js
// The following is written in JS using Flowtypes, but feel free to use whatever you know best

type Rule = {|
  +firstReviewMonthsAfterStartDate: number,
  +repeatingMonthlyCadence: number,
|};

type Employee = {|
  +id: number,
  +name: string,
  +startDate: string, // ISO 8601 date (YYYY-MM-DD)
|};

function calculateUpcomingReviews(
  rule: Rule,
  employees: Array<Employee>,
  timestamp: Date
): Array<{| +employeeId: number, +date: string }> {
  // TODO: Implement this function
}

const everyMonth: Rule = { firstReviewMonthsAfterStartDate: 2, repeatingMonthlyCadence: 1 };
const sally: Employee = { id: 1, name: 'Sally', startDate: '2020-01-15' };

calculateUpcomingReviews(everyMonth, [sally], new Date(2020, 0, 1)); /* => [
  { employeeId: 1, date: '2020-03-13' },
  { employeeId: 1, date: '2020-04-15' },
  { employeeId: 1, date: '2020-05-15' },
  { employeeId: 1, date: '2020-06-15' },
  { employeeId: 1, date: '2020-07-15' },
  etc
] */

const everyThree: Rule = { firstReviewMonthsAfterStartDate: 0, repeatingMonthlyCadence: 3 };
const bob: Employee = { id: 2, name: 'Bob', startDate: '2018-08-31' };

calculateUpcomingReviews(everyThree, [sally, bob], new Date(2020, 6, 1)); /* => [
  { employeeID: 1, date: '2020-07-15' },
  { employeeID: 2, date: '2020-08-31' },
  { employeeID: 1, date: '2020-10-15' },
  { employeeID: 2, date: '2020-11-30' },
  { employeeID: 1, date: '2021-01-15' },
  etc
] */
```

In the second file `tests.json`, you'll find a few test cases written in JSON. Please use these as unit tests for your solution.