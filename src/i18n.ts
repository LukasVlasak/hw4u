import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    debug: true,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {
          auth: {
            signUp: "Sign up",
            signIn: "Sign in",
            username: "Username",
            email: "E-mail",
            password: "Password",
            submit: "Submit",
            alreadyHaveAccount: "Already have an account?",
            usernameErrors: {
                1: "Username must contains at least 3 characters",
                2: "Username can contains only 15 characters",
                3: "Username contains unallowed characters"
            },
            emailErrors: {
                1: "Invalid email"
            },
            errors: {
              required: 'This is required'
            },
            passwordErrors: {
              0: "Password must contains:",
              1: "At least 8 characters",
              2: "At least 1 number",
              3: "At least 1 capital letter"
            },
            country: "Country"
          },
        },
      },
      cs: {
        translation: {
          auth: {
            signUp: "Registrovat se",
            signIn: "Přihlásit se",
            username: "Uživatelské jméno",
            email: "E-mail",
            password: "Heslo",
            submit: "Uložit",
            alreadyHaveAccount: "Už máte účet?",
            usernameErrors: {
                1: "Uživatelské jméno musí obsahovat nejméně 3 znaky",
                2: "Uživatelské jméno může obsahovat maximálně 15 znaků",
                3: "Uživatelské jméno obsahuje nepovolené znaky"
            },
            emailErrors: {
                1: "Neplatný email"
            },
            errors: {
              required: 'Toto pole je povinné'
            },
            passwordErrors: {
              0: "Heslo musí obsahovat:",
              1: "Nejméně 8 znaků",
              2: "Alespoň jednu číslici",
              3: "Alespoň jedno velké písmeno"
            },
            country: "Země"
          },
        },
      },
    },
  });

export default i18n;
