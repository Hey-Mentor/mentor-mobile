
import Roboto from 'native-base/Fonts/Roboto.ttf';
import RobotoMedium from 'native-base/Fonts/Roboto_medium.ttf';
import { Ionicons } from '@expo/vector-icons';

const type = {
  Roboto,
  Roboto_medium: RobotoMedium,
  ...Ionicons.font
};

const fontWeight = {
  regular: 'normal',
  semibold: '500',
  bold: 'bold',
  light: '300',
};


export default {
  type,
  weight: fontWeight,
};
