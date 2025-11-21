export const getModalLinkForUser = (username: string) => {
  const url = new URL(location.href)
  url.searchParams.set('modal', 'user')
  url.searchParams.set('name', username)

  return `${url.pathname}${url.search}`
}

export const greetingMsg = () => {
  const currentHour = new Date().getHours()

  if (currentHour >= 5 && currentHour < 12) {
    return 'Good Morning'
  } else if (currentHour >= 12 && currentHour < 18) {
    return 'Good Afternoon'
  } else {
    return 'Good Evening'
  }
}
