import {
  StatusBar,
  StyleSheet
} from 'react-native';
import {RkTheme} from 'react-native-ui-kitten';
import {KittenTheme} from './theme';
import {SocialBarTypes} from '../components/socialBar/types';
import {scale, scaleModerate, scaleVertical, scaleHonrizontal} from '../utils/scale';

export let bootstrap = () => {
  RkTheme.setTheme(KittenTheme, null);

  RkTheme.setType('RkCard', 'horizontal', {
    container: {
      flexDirection: 'row',
      height: 102
    },
    content: {
      flex: 1,
    },
    img: {
      height: null,
      flex: -1,
      width: 120
    }
  });

  RkTheme.setType('RkCard', 'horizontal-vide', {
    container: {
      flexDirection: 'row',
      height: 60,
      justifyContent: 'center',
      alignItems : 'center'
    },
    content: {
      flex: 1,
    },
  });


  RkTheme.setType('RkCard', 'entretien', {
    container: {
      flexDirection: 'row',
      height: 100,
      width : scaleHonrizontal(150),
      justifyContent: 'center',
      alignItems : 'center'
    },
    content: {
      flex: 1,
    },
  });

  RkTheme.setType('RkCard', 'horizontal-ajout', {
    container: {
      height: 250,
    },
    content: {
      flex: 1,
    },
  });
 
  /*
   RkText types
   */

  RkTheme.setType('RkText', 'basic', {
    fontFamily: theme => theme.fonts.family.bold,
    backgroundColor: 'transparent'
  });

  RkTheme.setType('RkText', 'regular', {
    fontFamily: theme => theme.fonts.family.bold,
  });

  RkTheme.setType('RkText', 'light', {
    fontFamily: theme => theme.fonts.family.light,
  });

  RkTheme.setType('RkText', 'logo', {
    fontFamily: theme => theme.fonts.family.logo,
  });

  RkTheme.setType('RkText', 'moon', {
    fontFamily: 'icomoon',
  });

  RkTheme.setType('RkText', 'awesome', {
    fontFamily: 'fontawesome',
  });

  RkTheme.setType('RkText', 'hero', {
    fontSize: scale(33)
  });

  RkTheme.setType('RkText', 'menuIcon', {
    fontSize: 44
  });

  //all font sizes
  for (let key in RkTheme.current.fonts.sizes) {
    RkTheme.setType('RkText', key, {
      fontSize: theme => theme.fonts.sizes[key]
    });
  }

  //all text colors
  for (let key in RkTheme.current.colors.text) {
    RkTheme.setType('RkText', `${key}Color`, {
      color: theme => theme.colors.text[key]
    });
  }

  //all text line heights
  for (let key in RkTheme.current.fonts.lineHeights) {
    RkTheme.setType('RkText', `${key}Line`, {
      text: {
        lineHeight: theme => theme.fonts.lineHeights[key]
      }
    });
  }

  //theme text styles
  RkTheme.setType('RkText', 'header1', {
    fontSize: theme => theme.fonts.sizes.h1,
    fontFamily: theme => theme.fonts.family.bold
  });
  RkTheme.setType('RkText', 'header2', {
    fontSize: theme => theme.fonts.sizes.h2,
    fontFamily: theme => theme.fonts.family.bold
  });
  RkTheme.setType('RkText', 'header3', {
    fontSize: theme => theme.fonts.sizes.h3,
    fontFamily: theme => theme.fonts.family.bold
  });
  RkTheme.setType('RkText', 'header4', {
    fontSize: theme => theme.fonts.sizes.h4,
    fontFamily: theme => theme.fonts.family.bold
  });
  RkTheme.setType('RkText', 'header5', {
    fontSize: theme => theme.fonts.sizes.h5,
    fontFamily: theme => theme.fonts.family.bold
  });
  RkTheme.setType('RkText', 'header6', {
    fontSize: theme => theme.fonts.sizes.h6,
    fontFamily: theme => theme.fonts.family.bold
  });
  RkTheme.setType('RkText', 'secondary1', {
    fontSize: theme => theme.fonts.sizes.s1,
    fontFamily: theme => theme.fonts.family.light
  });
  RkTheme.setType('RkText', 'secondary2', {
    fontSize: theme => theme.fonts.sizes.s2,
    fontFamily: theme => theme.fonts.family.light
  });
  RkTheme.setType('RkText', 'secondary3', {
    fontSize: theme => theme.fonts.sizes.s3,
    fontFamily: theme => theme.fonts.family.regular
  });
  RkTheme.setType('RkText', 'secondary4', {
    fontSize: theme => theme.fonts.sizes.s4,
    fontFamily: theme => theme.fonts.family.regular
  });
  RkTheme.setType('RkText', 'secondary5', {
    fontSize: theme => theme.fonts.sizes.s5,
    fontFamily: theme => theme.fonts.family.light
  });
  RkTheme.setType('RkText', 'secondary6', {
    fontSize: theme => theme.fonts.sizes.s6,
    fontFamily: theme => theme.fonts.family.light
  });
  RkTheme.setType('RkText', 'secondary7', {
    fontSize: theme => theme.fonts.sizes.s7,
    fontFamily: theme => theme.fonts.family.regular
  });
  RkTheme.setType('RkText', 'primary1', {
    fontSize: theme => theme.fonts.sizes.p1,
    fontFamily: theme => theme.fonts.family.light
  });
  RkTheme.setType('RkText', 'primary2', {
    fontSize: theme => theme.fonts.sizes.p2,
    fontFamily: theme => theme.fonts.family.regular
  });
  RkTheme.setType('RkText', 'primary3', {
    fontSize: theme => theme.fonts.sizes.p3,
    fontFamily: theme => theme.fonts.family.light
  });
  RkTheme.setType('RkText', 'primary4', {
    fontSize: theme => theme.fonts.sizes.p4,
    fontFamily: theme => theme.fonts.family.regular
  });

  RkTheme.setType('RkText', 'center', {
    text: {
      textAlign: 'center'
    }
  });

  RkTheme.setType('RkText', 'chat', {
    color: theme => theme.colors.chat.text
  });


  RkTheme.setType('RkButton', 'save', {
    width: scaleHonrizontal(280),
    hitSlop: {top: 5, left: 5, bottom: 5, right: 5},
  
  });

  /*
   RkButton types
   */

  RkTheme.setType('RkButton', 'basic', {
    container: {
      alignSelf: 'auto',
    }
  });

  RkTheme.setType('RkButton', 'square', {
    borderRadius: 3,
    backgroundColor: theme => theme.colors.button.back,
    container: {
      flexDirection: 'column',
      margin: 8
    },
  });

  RkTheme.setType('RkButton', 'tile', {
    borderRadius: 0,
    backgroundColor: 'transparent',
    borderWidth: 0.5,
    borderColor: theme => theme.colors.border.base,
    container: {
      flexDirection: 'column'
    }
  });

  RkTheme.setType('RkButton', 'link', {
    color: theme => theme.colors.primary,
  });

  RkTheme.setType('RkButton', 'contrast', {
    color: theme => theme.colors.text.base,
  });

  RkTheme.setType('RkButton', 'icon', {
    height: scale(56),
    width: scale(56),
    borderColor: theme => theme.colors.border.base,
    backgroundColor: theme => theme.colors.control.background,
    borderWidth: 1
  });

  RkTheme.setType('RkButton', 'highlight', {
    backgroundColor: theme => theme.colors.button.highlight
  });

  RkTheme.setType('RkButton', 'social', {
    height: scale(62),
    width: scale(62),
    borderRadius: scale(31),
    borderColor: theme => theme.colors.border.accent,
    borderWidth: 1,
    backgroundColor: theme => theme.colors.control.background
  });
  /*
   RkModalImg types
   */

  RkTheme.setType('RkModalImg', 'basic', {
    img: {
      margin: 1.5,
    },
    modal: {
      backgroundColor: theme => theme.colors.screen.base
    },
    footer: {
      backgroundColor: theme => theme.colors.screen.base,
      height: 50
    },
    header: {
      backgroundColor: theme => theme.colors.screen.base,
      paddingBottom: 6
    },
  });

  RkTheme.registerComponent('SocialBar', SocialBarTypes);
};