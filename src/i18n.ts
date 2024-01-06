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
            name: "Full name",
            password: "Password",
            submit: "Submit",
            alreadyHaveAccount: "Already have an account?",
            stillDoNotHaveAccount: "Do not have account yet?",
            emailDoesNotExists: "This e-mail does not exists. Sign up first",
            accountCreated: "Account created",
            yourAccountWasCreated: "Your account was successfully created",
            successSignIn: "Success",
            successSignInDesc: "You have been logged in",
            badPassword: "Bad password",
            signOut: "Sign out",
            successSignOutDesc: "You have been logged out",
            successSignOut: "Success",
            rememberMe: "Remember me",
            usernameErrors: {
                1: "Username must contains at least 3 characters",
                2: "Username can contains only 15 characters",
                3: "Username contains unallowed characters"
            },
            emailErrors: {
                1: "Invalid email"
            },
            passwordErrors: {
              0: "Password must contains:",
              1: "At least 8 characters",
              2: "At least 1 number",
              3: "At least 1 capital letter"
            },
            nameErrors: {
              1: "Name must contains at least 3 characters",
              2: "Name can contains only 30 characters",
              3: "Name contains unallowed characters",
            },
            country: "Country",
            signInWithEmail: "You are going to sign in with this e-mail",
            justDisplayUsername: "This is what will be displayed in your public profile",
            emailAlreadyExists: "This e-mail is already taken",
            usernameAlreadyExists: "This username is already taken"
          },
          errors: {
            required: 'This is required'
          },
          account: {
            account: "Account"
          },
          tasks: {
            askAQuestion: "Ask a question"
          },
          subscripe: {
            subscripe: "Subscripe"
          }
        },
      },
      cs: {
        translation: {
          auth: {
            signUp: "Registrovat se",
            signIn: "Přihlásit se",
            username: "Uživatelské jméno",
            email: "E-mail",
            name: "Celé jméno",
            password: "Heslo",
            submit: "Uložit",
            alreadyHaveAccount: "Už máte účet?",
            stillDoNotHaveAccount: "Ještě nemáte účet?",
            emailDoesNotExists: "Tento e-mail neexistuje. Zaregistrujte se",
            badPassword: "Špatné heslo",
            accountCreated: "Účet vytvořen",
            yourAccountWasCreated: "Váš účet byl úspěšně vytvořen",
            successSignIn: "Úspěch",
            successSignInDesc: "Byl jste přihlášen",
            signOut: "Odhlásit se",
            successSignOutDesc: "Byl jste úspěšně odhlášen",
            successSignOut: "Úspěšné odhlášení",
            rememberMe: "Zapamatuj si mě",
            usernameErrors: {
                1: "Uživatelské jméno musí obsahovat nejméně 3 znaky",
                2: "Uživatelské jméno může obsahovat maximálně 15 znaků",
                3: "Uživatelské jméno obsahuje nepovolené znaky"
            },
            emailErrors: {
                1: "Neplatný email"
            },
            passwordErrors: {
              0: "Heslo musí obsahovat:",
              1: "Nejméně 8 znaků",
              2: "Alespoň jednu číslici",
              3: "Alespoň jedno velké písmeno"
            },
            nameErrors: {
              1: "Jméno musí obsahovat minimálně 3 znaky",
              2: "Jméno může obsahovat maximálně 30 znaků",
              3: "Jméno obsahuje nepovolené znaky",
            },
            country: "Země",
            signInWithEmail: "Tímto e-mailem se budete přihlašovat",
            justDisplayUsername: "Uživatelské jméno bude zobrazeno ve Vašem veřejném profilu",
            emailAlreadyExists: "Tento e-mail již existuje",
            usernameAlreadyExists: "Toto uživatelské jméno již existuje"
          },
          errors: {
            required: "Toto pole je povinné"
          },
          account: {
            account: "Profil"
          },
          tasks: {
            askAQuestion: "Zeptejte se"
          },
          subscripe: {
            subscripe: "Odebírejte"
          }
        },
      },
    },
  });

export default i18n;
