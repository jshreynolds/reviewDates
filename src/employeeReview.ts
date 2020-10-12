const SATURDAY = 6
const SUNDAY = 0
const SATURDAY_ADJUSTMENT = -1
const SUNDAY_ADJUSTMENT = -2
const FRIDAY_TO_MONDAY_ADJUSTMENT = 3
const REVIEW_DEPTH = 10

export interface Rule {
    firstReviewMonthsAfterStartDate: number
    repeatingMonthlyCadence: number
}

export interface Employee {
    id: number
    name: string
    startDate: string
}

export interface ScheduledReview {
    employeeID: number
    date: string
}

export function calculateUpcomingReviews(
    rule: Rule,
    employees: Employee[],
    timestamp: Date
): ScheduledReview[] {
    const idToReviewDates = employees.map((employee) => ({
        employeeID: employee.id,
        reviewDates: nextNReviews(
            REVIEW_DEPTH,
            reviewDates(rule, employee, timestamp)
        ),
    }))

    const scheduledReviews = idToReviewDates.flatMap(
        ({ employeeID, reviewDates }) =>
            reviewDates.map((date) => ({ employeeID, date }))
    )
    scheduledReviews.sort((a, b) => a.date.valueOf() - b.date.valueOf())

    const nextReviews = scheduledReviews.slice(0, REVIEW_DEPTH)
    const result = nextReviews.map(({ employeeID, date }) => ({
        employeeID,
        date: formatDate(date),
    }))
    return result
}

export function* reviewDates(
    rule: Rule,
    employee: Employee,
    timestamp: Date
): Generator<Date> {
    const currentDate = timestamp
    const startDate = new Date(employee.startDate)

    let monthsForward = rule.firstReviewMonthsAfterStartDate
    if (monthsForward === 0) {
        monthsForward = rule.repeatingMonthlyCadence
    }

    let currentReview = getReview(startDate, monthsForward)
    while (currentReview < currentDate) {
        monthsForward = monthsForward + rule.repeatingMonthlyCadence
        currentReview = getReview(startDate, monthsForward)
    }

    while (true) {
        yield currentReview
        monthsForward = monthsForward + rule.repeatingMonthlyCadence
        currentReview = getReview(startDate, monthsForward)
    }
}

function getReview(startDate: Date, monthsForward: number) {
    return adjustForWeekends(shiftDate(startDate, monthsForward))
}

export function nextNReviews(
    numberOfReviews: number,
    reviewDates: Generator<Date>
): Array<Date> {
    const result = []
    for (let index = 0; index < numberOfReviews; index++) {
        result.push(reviewDates.next().value)
    }
    return result
}

export function adjustForWeekends(reviewDate: Date): Date {
    const dayOfWeek = reviewDate.getUTCDay()
    const day = reviewDate.getUTCDate()

    let dayAdjustment = 0
    if (dayOfWeek == SATURDAY) {
        dayAdjustment = SATURDAY_ADJUSTMENT
    } else if (dayOfWeek == SUNDAY) {
        dayAdjustment = SUNDAY_ADJUSTMENT
    }

    const monthHasChanged = day + dayAdjustment <= 0
    if (monthHasChanged) {
        dayAdjustment = dayAdjustment + FRIDAY_TO_MONDAY_ADJUSTMENT
    }

    return shiftDay(reviewDate, dayAdjustment)
}

export function shiftDate(date: Date, monthAdjustment: number): Date {
    const utcYear = date.getUTCFullYear()
    const utcMonth = date.getUTCMonth() + monthAdjustment
    const scheduledDay = date.getUTCDate()
    const targetMonth = makeUTCDate(utcYear, utcMonth, 1)

    const latestDayToUseForMonth = Math.min(
        scheduledDay,
        daysInMonth(targetMonth)
    )

    return makeUTCDate(utcYear, utcMonth, latestDayToUseForMonth)
}

function shiftDay(date: Date, dayAdjustment: number) {
    return makeUTCDate(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate() + dayAdjustment
    )
}

export function daysInMonth(date: Date): number {
    const lastDayOfTheMonth = makeUTCDate(
        date.getUTCFullYear(),
        date.getUTCMonth() + 1,
        0
    )
    return lastDayOfTheMonth.getUTCDate()
}

function makeUTCDate(year: number, month: number, day: number): Date {
    return new Date(Date.UTC(year, month, day))
}

function formatDate(date: Date): string {
    const isoDate = date.toISOString()
    return isoDate.slice(0, isoDate.indexOf('T'))
}