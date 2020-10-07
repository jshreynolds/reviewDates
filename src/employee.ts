export interface Rule {
    firstReviewMonthsAfterStartDate: number,
    repeatingMonthlyCadence: number
}

export interface Employee {
    id: number
    name: string
    startDate: string
}

export function calculateUpcomingReviews (
    rule: Rule,
    employees: Array<Employee>,
    timestamp: Date
  ): Array<{ employeeId: number, date: string }> {
      return []
  }

  