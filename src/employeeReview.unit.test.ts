import {
    Employee,
    Rule,
    ScheduledReview,
    adjustForWeekends,
    reviewDates,
    nextNReviews,
    daysInMonth,
} from './employeeReview'
import { TestCase, runTestCase } from './testHelper'
import testCases from './tests.json'

test('single employee gets correct values', () => {
    const everyMonth: Rule = {
        firstReviewMonthsAfterStartDate: 2,
        repeatingMonthlyCadence: 1,
    }
    const sally: Employee = { id: 1, name: 'Sally', startDate: '2020-01-15' }

    const expectedResults: ScheduledReview[] = [
        { employeeID: 1, date: '2020-03-13' },
        { employeeID: 1, date: '2020-04-15' },
        { employeeID: 1, date: '2020-05-15' },
        { employeeID: 1, date: '2020-06-15' },
        { employeeID: 1, date: '2020-07-15' },
        { employeeID: 1, date: '2020-08-14' },
        { employeeID: 1, date: '2020-09-15' },
        { employeeID: 1, date: '2020-10-15' },
        { employeeID: 1, date: '2020-11-13' },
        { employeeID: 1, date: '2020-12-15' },
    ]

    const simpleTest: TestCase = {
        testName: 'A simple Test',
        employees: [sally],
        rule: everyMonth,
        timestamp: '2020-01-01',
        expectedResults,
    }

    runTestCase(simpleTest)
})

describe('testing all of the provided test cases', () => {
    testCases.forEach((testCase) => {
        test(`test case: ${testCase.testName}`, () => {
            runTestCase(testCase)
        })
    })
})

test('employee review generator for distant reviewDate', () => {
    const everyMonth: Rule = {
        firstReviewMonthsAfterStartDate: 2,
        repeatingMonthlyCadence: 1,
    }
    const sally: Employee = { id: 1, name: 'Sally', startDate: '2020-01-15' }
    const reviewDate = new Date(2021, 0, 1, 0)

    const reviewGenerator = reviewDates(everyMonth, sally, reviewDate)

    const expectedFirstReview = new Date('2021-01-15')
    const firstReview = reviewGenerator.next().value

    expect(firstReview).toEqual(expectedFirstReview)

    const expectedSecondReview = new Date('2021-02-15')
    const secondReview = reviewGenerator.next().value

    expect(secondReview).toEqual(expectedSecondReview)
})

test('employee review generator works when start date is in the future', () => {
    const everyMonth: Rule = {
        firstReviewMonthsAfterStartDate: 2,
        repeatingMonthlyCadence: 1,
    }
    const sally: Employee = { id: 1, name: 'Sally', startDate: '2021-01-15' }
    const reviewDate = new Date(2020, 0, 1, 0)

    const reviewGenerator = reviewDates(everyMonth, sally, reviewDate)

    const expectedFirstReview = new Date('2021-03-15')
    const firstReview = reviewGenerator.next().value

    expect(firstReview).toEqual(expectedFirstReview)

    const expectedSecondReview = new Date('2021-04-15')
    const secondReview = reviewGenerator.next().value

    expect(secondReview).toEqual(expectedSecondReview)
})

test('weekend adjustments stay in the same month', () => {
    const tuesdayReview = new Date('2020-10-05')
    const adjustedTuesday = adjustForWeekends(tuesdayReview)

    expect(adjustedTuesday).toEqual(tuesdayReview)

    const saturdayReviewDate = new Date('2020-10-10')
    const expectedFriday = new Date('2020-10-09')

    const adjustedReview = adjustForWeekends(saturdayReviewDate)
    expect(adjustedReview).toEqual(expectedFriday)

    const sundayTheFirstReview = new Date('2020-11-01')
    const expectedMonday = new Date('2020-11-02')

    const adjustedSundayReview = adjustForWeekends(sundayTheFirstReview)
    expect(adjustedSundayReview).toEqual(expectedMonday)

    const saturdayTheFirstReview = new Date('2021-05-01')
    const expectedMonday2 = new Date('2021-05-03')

    const adjustedSaturdayReview = adjustForWeekends(saturdayTheFirstReview)
    expect(adjustedSaturdayReview).toEqual(expectedMonday2)
})

test('take next N values', () => {
    const everyMonth: Rule = {
        firstReviewMonthsAfterStartDate: 2,
        repeatingMonthlyCadence: 1,
    }
    const sally: Employee = { id: 1, name: 'Sally', startDate: '2020-01-15' }
    const reviewDate = new Date(2020, 0, 1, 0)

    const reviewGenerator = reviewDates(everyMonth, sally, reviewDate)
    const expectedFirstReview = new Date('2020-03-13')
    const expectedSecondReview = new Date('2020-04-15')

    const next2dates = nextNReviews(2, reviewGenerator)
    expect(next2dates.length).toBe(2)
    expect(next2dates[0]).toEqual(expectedFirstReview)
    expect(next2dates[1]).toEqual(expectedSecondReview)
})

test('reviews with zero start date use monthly cadence as the "first review"', () => {
    const everyMonth: Rule = {
        firstReviewMonthsAfterStartDate: 0,
        repeatingMonthlyCadence: 1,
    }
    const sally: Employee = { id: 1, name: 'Sally', startDate: '2020-01-15' }
    const reviewDate = new Date('2020-01-01')

    const reviewGenerator = reviewDates(everyMonth, sally, reviewDate)

    const expectedFirstReview = new Date('2020-02-14')
    const firstReview = reviewGenerator.next().value

    expect(firstReview).toEqual(expectedFirstReview)
})

test('Ending month days should shift themselves to the last "possible" day in the current month', () => {
    const everyMonth: Rule = {
        firstReviewMonthsAfterStartDate: 0,
        repeatingMonthlyCadence: 3,
    }
    const bob: Employee = { id: 2, name: 'Bob', startDate: '2019-08-31' }
    const reviewDate = new Date('2020-01-01')

    const reviewGenerator = reviewDates(everyMonth, bob, reviewDate)

    const expectedFirstReview = new Date('2020-02-28')
    const firstReview = reviewGenerator.next().value

    expect(firstReview).toEqual(expectedFirstReview)
})

test('days in month calculation', () => {
    const january = new Date('2020-01-15')
    expect(daysInMonth(january)).toBe(31)

    const february = new Date('2020-02-01')
    expect(daysInMonth(february)).toBe(29)
})
