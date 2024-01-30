import { ThemeConfig, extendTheme } from "@chakra-ui/react";

const config: ThemeConfig = {
    useSystemColorMode: false,
    initialColorMode: "light",
};

const theme = extendTheme({
    config: config,
    colors: {
        brand: {
            bgColor: '#1d1168',
            hoverBlueColor: '#6887fe'
        },
        blue: {
            600: '#002984',
            500: '#3f51b5'
        },
        grey: {
            200: '#f8faf9',
            300: '#f1f5f4',

        }
    },
    breakpoints: {
        hideSignUp: "980px"
    }
    // mimo jine tady muzu specifikovat colors: {} a dat tam barvy ktere chci pouzivat - potom pres color={"orange.400"} to nastavit
    // https://chakra-ui.com/docs/styled-system/customize-theme
    // kazdy chakra komponent ma size, variants a baseStyle
    // mam size u button s, m, l - kazda size ma specifikovane px 
    // kdybych toto chtel upravit, tak to upravovat tady - podivat se do odkazu
});

export default theme;