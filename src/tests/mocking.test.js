import { vi, it, expect, describe } from 'vitest'
import {
  getDiscount,
  getPriceInCurrency,
  getShippingInfo,
  isOnline,
  login,
  renderPage,
  signUp,
  submitOrder
} from '../mocking'
import { getExchangeRate } from '../libs/currency'
import { getShippingQuote } from '../libs/shipping'
import { trackPageView } from '../libs/analytics'
import { charge } from '../libs/payment'
import { sendEmail } from '../libs/email'
import security from '../libs/security'

vi.mock('../libs/currency.js')
vi.mock('../libs/shipping.js')
vi.mock('../libs/analytics.js')
vi.mock('../libs/payment.js')
vi.mock('../libs/email.js', async (importOriginal) => {
  const originalModule = await importOriginal()

  return {
    ...originalModule,
    sendEmail: vi.fn()
  }
})

describe('getPriceInCurrency', () => {
  it('should return price in target currency', () => {
    vi.mocked(getExchangeRate).mockReturnValue(1.5)
    const price = getPriceInCurrency(10, 'AUD')
    expect(price).toBe(15)
  })
})

describe('getShippingInfo', () => {
  it('should return shipping unavailable if qoute cannot be fetched', () => {
    vi.mocked(getShippingQuote).mockReturnValue(null)
    const result = getShippingInfo('London')

    expect(result).toMatch(/Unavailable/i)
  })

  // return shipping info if qoute can be fetched
  it('should return shipping info if qoute can be fetched', () => {
    vi.mocked(getShippingQuote).mockReturnValue({
      cost: 10,
      estimatedDays: 3
    })
    const result = getShippingInfo('London')

    // expect(result).toMatch(/London/i)
    expect(result).toMatch(/10/i)
    expect(result).toMatch(/3 days/i)
    expect(result).toMatch(/cost/i)
  })
})

// Interaction test
describe('renderPage', () => {
  it('should return correct content', async () => {
    const result = await renderPage()

    expect(result).toMatch(/content/i)
  })

  // should call analytics
  it('should call analytics', async () => {
    await renderPage()

    expect(trackPageView).toHaveBeenCalledWith('/home')
  })
})

describe('submitOrder', () => {
  const order = { totalAmount: 10 }
  const creditCard = { creditCardNumber: '1234' }

  it('should charge customer', async () => {
    vi.mocked(charge).mockResolvedValue({ status: 'success' })

    await submitOrder(order, creditCard)
    expect(charge).toHaveBeenCalledWith(creditCard, order.totalAmount)
  })

  //   return success when payment sucessful
  it('should return success when payment sucessful', async () => {
    vi.mocked(charge).mockResolvedValue({ status: 'success' })

    const result = await submitOrder(order, creditCard)

    expect(result).toEqual({ success: true })
  })

  //   // return success when payment failed
  it('should return success when payment sucessful', async () => {
    vi.mocked(charge).mockResolvedValue({ status: 'failed' })

    const result = await submitOrder(order, creditCard)

    expect(result).toEqual({ success: false, error: 'payment_error' })
  })
})

describe('signUp', () => {
  const email = 'example@example.com'

  it('should return false if email is not valid', async () => {
    const result = await signUp('a')

    expect(result).toBe(false)
  })

  it('should return true if email is valid', async () => {
    const result = await signUp(email)

    expect(result).toBe(true)
  })

  it('should send welcome if email is valid', async () => {
    await signUp(email)
    expect(sendEmail).toHaveBeenCalledOnce()

    const args = vi.mocked(sendEmail).mock.calls[0]
    expect(args[0]).toBe(email)
    expect(args[1]).toMatch(/Welcome/i)
  })
})

describe('login', () => {
  const email = 'example@example.com'
  // should email the one-time login code
  it('should email the one-time login code', async () => {
    const spy = vi.spyOn(security, 'generateCode')

    await login(email)

    const securityCode = spy.mock.results[0].value.toString()

    expect(sendEmail).toHaveBeenCalledWith(email, securityCode)
  })
})

describe('isOnline', () => {
  it('should return false if current hour is outise opening hours', () => {
    vi.setSystemTime('2024-02-02 07:59')
    expect(isOnline()).toBe(false)

    vi.setSystemTime('2024-02-02 20:01')
    expect(isOnline()).toBe(false)
  })

  it('should return true if current hour is within opening hours', () => {
    vi.setSystemTime('2024-02-02 8:000')
    expect(isOnline()).toBe(true)

    vi.setSystemTime('2024-02-02 19:59')
    expect(isOnline()).toBe(true)
  })
})

describe('getDiscount', () => {
  // should return 0.2 on christmas day
  it('should return 0.2 on christmas day', () => {
    vi.setSystemTime('2024-12-25 00:01')
    expect(getDiscount()).toBe(0.2)

    vi.setSystemTime('2024-12-25 00:00')
    expect(getDiscount()).toBe(0.2)

    vi.setSystemTime('2024-12-25 23:59')
    expect(getDiscount()).toBe(0.2)
  })

  // should return 0 any other day
  it('should return 0 any other day', () => {
    vi.setSystemTime('2024-02-02 00:01')
    expect(getDiscount()).toBe(0)

    vi.setSystemTime('2024-04-02 00:00')
    expect(getDiscount()).toBe(0)
  })
})
