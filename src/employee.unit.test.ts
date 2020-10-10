import {Employee, Rule, calculateUpcomingReviews, adjustForWeekends} from './employee'

test('single employee gets correct values', () => {

    const everyMonth: Rule = { firstReviewMonthsAfterStartDate: 2, repeatingMonthlyCadence: 1 };
    const sally: Employee = { id: 1, name: 'Sally', startDate: '2020-01-15' };
    const reviewDate = new Date(2020, 0, 1)

    const expectedReviews = [
        { employeeId: 1, date: '2020-03-13' },
        { employeeId: 1, date: '2020-04-15' },
        { employeeId: 1, date: '2020-05-15' },
        { employeeId: 1, date: '2020-06-15' },
        { employeeId: 1, date: '2020-07-15' },
        { employeeId: 1, date: '2020-08-13' },
        { employeeId: 1, date: '2020-09-15' },
        { employeeId: 1, date: '2020-10-15' },
        { employeeId: 1, date: '2020-11-15' },
        { employeeId: 1, date: '2020-12-15' },    
    ]

    const receivedReviews = calculateUpcomingReviews(everyMonth, [sally], reviewDate)

    expect(receivedReviews.length).toBe(10)

})

test('valid review date', () => {
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