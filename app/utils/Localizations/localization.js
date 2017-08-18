
import LocalizedStrings from 'react-native-localization';
import en from './en.js';
import zh from './zh.js';

let strings = new LocalizedStrings({
 en,zh
});

export default strings;


// eg:
// import local from '../utils/Localizations/localization.js';
// local.setLanguage('zh');
// console.warn('constructor',local.getAvailableLanguages());
// console.warn('constructor',local.formatString(local.str0,1000));
//  console.warn('constructor',local.getString('str0','zh'));
// console.warn('constructor',local.str0);
