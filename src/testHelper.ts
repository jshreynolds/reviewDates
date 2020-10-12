import { Rule, Employee, Review } from './employee'

export interface TestCase {
    testName: string
    rule: Rule
    employees: Employee[]
    timestamp: string
    expectedResults: Review[]
}