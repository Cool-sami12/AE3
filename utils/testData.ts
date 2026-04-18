import { RegistrationData } from '../pages/SignupPage';
import { CardDetails } from '../pages/PaymentPage';

/**
 * Generates a unique email using the required format:
 *   test+<3-random-digits>@yopmail.com
 */
 export function generateEmail(): string {
  const threeDigits = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
  return `test+${threeDigits}@yopmail.com`;
}


/** Static (but unique per run) registration payload */
export const registrationData: RegistrationData = {
  name: 'John Tester',
  email: generateEmail(), // generated at module load – stays constant per run
  password: 'SecurePass@123',
  day: '15',
  month: 'March',
  year: '1995',
  firstName: 'John',
  lastName: 'Tester',
  company: 'QA Labs Inc.',
  address1: '123 Automation Street',
  address2: 'Suite 456',
  country: 'United States',
  state: 'California',
  city: 'Los Angeles',
  zipcode: '90001',
  mobile: '4155550199',
};

/** Dummy card details (test environment – not real) */
export const cardDetails: CardDetails = {
  nameOnCard: 'John Tester',
  cardNumber: '4111111111111111',
  cvc: '123',
  expiryMonth: '12',
  expiryYear: '2027',
};

/** Quantity to add to cart */
export const PRODUCT_QUANTITY = 2;

/** Comment to add at checkout */
export const ORDER_COMMENT = 'Please handle with care. Automated test order.';
