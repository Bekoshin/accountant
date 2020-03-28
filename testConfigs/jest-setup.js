jest.autoMockOff();
jest.mock('react-native-localize', () => ({
  getLocales: () => [
    {countryCode: 'US', languageTag: 'en-US', languageCode: 'en', isRTL: false},
    {countryCode: 'RU', languageTag: 'ru-RU', languageCode: 'ru', isRTL: false},
  ],
}));
