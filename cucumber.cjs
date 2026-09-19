module.exports = {
  default: {
    paths: ['features/**/*.feature'],
    requireModule: ['tsx/cjs'],
    require: ['features/support/**/*.ts', 'features/step-definitions/**/*.ts'],
    format: ['progress-bar', ['html', 'reports/cucumber-report.html']],
    parallel: 0,
    worldParameters: {
      baseUrl: 'https://petstore.swagger.io/v2/',
    },
  },
};
