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

export interface Review {
    employeeID: number
    date: string
}

export function calculateUpcomingReviews(
    rule: Rule,
    employees: Employee[],
    timestamp: Date
): Review[] {

    const idsToDates = employees.map(employee => ({ employeeID: employee.id, reviewDates: nextNReviews(reviewDates(rule, employee, timestamp), 10) }))
    const idsToReviews = idsToDates.flatMap(({ employeeID, reviewDates }) => (reviewDates.map(date => ({ employeeID, date }))))
    idsToReviews.sort((a, b) => a.date.valueOf() - b.date.valueOf())
    const ids = idsToReviews.slice(0, 10)
    const result = ids.map(({ employeeID, date }) => ({ employeeID, date: formatDate(date) }))
    return result
}

function formatDate(date: Date): string {
    const isoDate = date.toISOString()
    return isoDate.slice(0, isoDate.indexOf('T'))
}

export function nextNReviews(reviewDates: Generator<Date>, numberOfReviews: number): Array<Date> {

    let result = []

    for (let index = 0; index < numberOfReviews; index++) {
        result.push(reviewDates.next().value)
    }
    return result
}

export function* reviewDates(
    rule: Rule,
    employee: Employee,
    timestamp: Date): Generator<Date> {

    const currentDate = timestamp
    const startDate = new Date(employee.startDate)

    let reviewMonthAdjustment = rule.firstReviewMonthsAfterStartDate

    if (reviewMonthAdjustment === 0) {
        reviewMonthAdjustment = rule.repeatingMonthlyCadence
    }

    let currentReview = getReview(startDate, reviewMonthAdjustment)

    while (currentReview < currentDate) {
        reviewMonthAdjustment = reviewMonthAdjustment + rule.repeatingMonthlyCadence
        currentReview = getReview(startDate, reviewMonthAdjustment)
    }

    while (true) {
        yield currentReview
        reviewMonthAdjustment = reviewMonthAdjustment + rule.repeatingMonthlyCadence
        currentReview = getReview(startDate, reviewMonthAdjustment)
    }

}

function getReview(startDate: Date, monthsForward: number) {
    return adjustForWeekends(adjustMonth(startDate, monthsForward))
}

export function adjustMonth(date: Date, monthAdjustment: number) {
    const maxDaysInDate = Math.min(date.getUTCDate(), daysInMonth(date))
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + monthAdjustment, maxDaysInDate))
}

export function daysInMonth(date: Date): number {
    const newDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0))
    return newDate.getUTCDate()
}

function adjustDay(date: Date, dayAdjustment: number) {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + dayAdjustment))
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

    const monthHasChanged = (numericalDate + dayAdjustment) <= 0

    if (monthHasChanged) {
        dayAdjustment = dayAdjustment + FRIDAY_TO_MONDAY_ADJUSTMENT
    }

    return adjustDay(reviewDate, dayAdjustment)
}
