module.exports = {
  extends: [
    'angular'
  ],
  rules: {
    'angular/no-service-method': 0,
    camelcase: ['error', {properties: 'never'}],
    'max-params': [2, 10]
  }
}
