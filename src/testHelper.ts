import { Rule, Employee, ScheduledReview } from './employee'

export interface TestCase {
    testName: string
    rule: Rule
    employees: Employee[]
    timestamp: string
    expectedResults: ScheduledReview[]
}
