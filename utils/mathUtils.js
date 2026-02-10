function fibonacci(n) {
  if (n < 0) return [];
  const result = [0, 1];
  for (let i = 2; i < n; i++) {
    result.push(result[i - 1] + result[i - 2]);
  }
  return result.slice(0, n);
}

function isPrime(num) {
  if (num <= 1) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
}

function lcm(arr) {
  const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
  return arr.reduce((a, b) => (a * b) / gcd(a, b));
}

function hcf(arr) {
  const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
  return arr.reduce((a, b) => gcd(a, b));
}

module.exports = { fibonacci, isPrime, lcm, hcf };
