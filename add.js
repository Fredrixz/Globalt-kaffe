export function add(num1, num2) {
  if (typeof num1 !== 'number' || typeof num2 !== 'number') {
    throw new Error('add kräver två siffror');
  }

  return num1 + num2;
}
