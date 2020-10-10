const SATURDAY = 6
const SUNDAY = 0
const SATURDAY_ADJUSTMENT = -1
const SUNDAY_ADJUSTMENT = -2
const FRIDAY_TO_MONDAY_ADJUSTMENT = 3

export interface Rule {
    firstReviewMonthsAfterStartDate: number,
    repeatingMonthlyCadence: number
}

export interface Employee {
    id: number
    name: string
    startDate: string
}

export function calculateUpcomingReviews(
    rule: Rule,
    employees: Array<Employee>,
    timestamp: Date
): Array<{ employeeId: number, date: string }> {
    return []
}

export function adjustForWeekends(reviewDate: Date): Date {
    const dayOfWeek = reviewDate.getUTCDay()
    const numericalDate = reviewDate.getUTCDate()

    let dayAdjustment = 0

    if (dayOfWeek == SATURDAY) {
        dayAdjustment = SATURDAY_ADJUSTMENT
    } else if (dayOfWeek == SUNDAY) {
        dayAdjustment = SUNDAY_ADJUSTMENT
    }

    const monthChanged = (numericalDate + dayAdjustment) <= 0

    if (monthChanged) {
        dayAdjustment = dayAdjustment + FRIDAY_TO_MONDAY_ADJUSTMENT
    }

    return new Date(Date.UTC(reviewDate.getUTCFullYear(), reviewDate.getUTCMonth(), numericalDate + dayAdjustment))
}