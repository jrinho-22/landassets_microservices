export const convertMoneyFormat = (value: string | number) => {
    if (typeof value == 'number') {
      return value
    }
    value = String(value)
    return parseFloat(value.replace("$", "").replaceAll(",", "").trim())
  }