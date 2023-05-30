// let spy;
global.beforeAll(async () => {
  jest.spyOn(Date, 'now').mockImplementation(() => 1682632800000); // '2022-04-28'
  const mockedDate = new Date(2023, 3, 28);

  jest.useFakeTimers({
    now: 1682632800000,
  });
  jest.setSystemTime(mockedDate);
});

global.afterAll(() => {
  jest.useRealTimers();
});
