// Mock DateTimePicker
jest.mock('@react-native-community/datetimepicker', () => {
  const MockDateTimePicker = ({ testID, value, onChange }: any) => {
    return null;
  };
  return MockDateTimePicker;
});

// Mock Expo Icons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: ''
}));

// Mock navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
}));