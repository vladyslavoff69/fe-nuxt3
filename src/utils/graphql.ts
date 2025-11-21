export const getGraphqlErrorMessage = (apolloError: any): string => {
  const { message, graphQLErrors } = apolloError
  try {
    const [
      {
        extensions: { validation, debugMessage },
      },
    ] = graphQLErrors

    if (!validation && debugMessage) {
      return debugMessage
    }

    const [[key, validationMessage]] = Object.entries(validation)

    // @ts-ignore
    return validationMessage ? validationMessage[0] : key
  } catch (e) {
    return message || 'Error:: Something went wrong!'
  }
}

export const parseGraphqlError = (
  apolloError: any,
): {
  message: string;
  validation: {
    [key in string]: string;
  };
} => {
  if (!apolloError) {
    return {
      message: '',
      validation: {},
    }
  }

  try {
    const { message, graphQLErrors } = apolloError
    const [
      {
        extensions: { validation, debugMessage },
      },
    ] = graphQLErrors

    if (!validation && !debugMessage && message) {
      return {
        message,
        validation: {},
      }
    }

    const parsedValidation: { [key in string]: string } = {}

    for (const key in validation) {
      parsedValidation[key] = validation[key][0]
    }

    return {
      message: getGraphqlErrorMessage(apolloError),
      validation: parsedValidation,
    }
  } catch (e) {
    return {
      message: 'Error:: Something went wrong',
      validation: {},
    }
  }
}
