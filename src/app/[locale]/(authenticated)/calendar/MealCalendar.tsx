import Calendar from 'react-calendar'

export default function MealCalendar({ mealPlans }) {
  return (
    <Calendar
      tileContent={({ date, view }) =>
        view === 'month' &&
        mealPlans.some((plan) => new Date(plan.date).toDateString() === date.toDateString()) ? (
          <p>
            {
              mealPlans.find((plan) => new Date(plan.date).toDateString() === date.toDateString())
                .meal
            }
          </p>
        ) : null
      }
    />
  )
}
