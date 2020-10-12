import {
    Rule,
    Employee,
    ScheduledReview,
    calculateUpcomingReviews,
} from './employee'

export interface TestCase {
    testName: string
    rule: Rule
    employees: Employee[]
    timestamp: string
    expectedResults: ScheduledReview[]
}

export function runTestCase(testCase: TestCase): void {
    const expectedResults = testCase.expectedResults

    const timestamp = new Date(testCase.timestamp)
    const receivedResults = calculateUpcomingReviews(
        testCase.rule,
        testCase.employees,
        timestamp
    )

    expect(receivedResults.length).toBe(expectedResults.length)

    for (let i = 0; i < receivedResults.length; i++) {
        const review = receivedResults[i]
        const expectedReview = expectedResults[i]
        expect(review).toEqual(expectedReview)
    }
}
