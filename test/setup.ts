global.beforeAll(async () => {
  jest.spyOn(Date, 'now').mockImplementation(() => 1682632800000); // '2022-04-27'
});
