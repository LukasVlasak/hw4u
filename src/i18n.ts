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
          admin: {
            administration: "Administration",
          },
          stars: "Stars",
          successPost: "Successfully added",
          errorPost: "There was an error",
          error: "Error",
          oneTaskPage: {
            answer: "Answer",
            category: "Category",
            willingToPay: "Willing to pay",
            createdDate: "Created date",
            assignee: "Assignee",
            creator: "Creator",
            description: "Description",
            errorPostDesc: "Answer field must not be empty and max 300 characters long",
            successPostDesc: "Your answer was successfully added"
          },
          review: "Review",
          homePage: {
            reviews: {
              noReviewsAvailable: "Sorry, no reviews available",
              successPostDesc: "Your review was successfully created",
              errorPostDesc: "Please enter valid values - stars are required and review text must be at least 10 characters long",
              reviewError: "Min 10 characters",
              averageRating: "Average rating",
              noRating: "No rating yet",
            },
            whyUs: {
              telephoneAssistance: "Telephone assistance",
              telephoneAssistanceDesc: "You can even buy phone assistance from someone who knows his field of study.",
              allInOnePlace: "All in one place",
              allInOnePlaceDesc: "Advice for your work, help with homework, help with test or just help with draw up a contract",
              moneySafety: "Money safety",
              moneySafetyDesc: "Don't worry if someone doesn't pay you after collecting your answer, everything is taken care of from our side"
            },
            howItWorks: "How it works",
            chooseAnswer: "Choose answer",
            enjoyFreeTime: "Enjoy free time",
            enterTask: "Enter a task",
            enterTaskDesc: "Easily input a task to be solved by someone else for a price you determine. Do it for free using the form",
            here: "here",
            chooseAnswerDesc: "Once someone replies to your task, you'll see a preview of their answer, so choose the one that suits you best, easily pay the solver, and we'll deliver the answer to you.",
            enjoyFreeTimeDesc: "You've just saved yourself a lot of time, Now all you have to do is enjoy the free time you have thanks to the easy resolution."
          },
          heroSection: {
            findSolution: "Find solution to your",
            superWords: "Eliminate Task Paralysis: Solve Tasks That Once Left You Struggling for Hours. End the Procrastination: Resolve Tasks That Once Stumped You for Hours. Stop Wasting Time: Solve Tasks That Once Took Hours of Contemplation.",
            getStarted: "Get Started",
            learnMore: "Learn more",
            schoolProjects: "school projects",
            termPaper: "term paper",
            onlineTests: "online tests"
          },
          nav: {
            questions: "Questions",
            findHelp: "Find Help",
            setATask: "Set a Task",
            setATaskDesc: "Set a task you're unsure about, and someone will gladly assist you",
            answeredQuestions: "View Answered Questions",
            answeredQuestionsDesc: "See who our page has already helped and maybe find a solution to your problem",
            users: "Users",
            usersDesc: "Check out what our users are knowledgeable about and you can directly ask them for help",
            home: "Home",
            pricingHowItWorks: "Pricing / How It Works",
            supportFAQ: "Support / FAQ",
            answerAQuestion: "Answer a Question",
            answerAQuestionDesc: "Answer a question and earn some money!",
            archivOfQuestions: "Archive of Questions",
            archivOfQuestionsDesc: "Previously answered and archived questions - find inspiration",
            inviteAFriend: "Invite a Friend",
            inviteAFriendDesc: "Invite a friend using a special link"
        },
          auth: {
            newPassword: "New password",
            alreadySignIn: "You are already sign in",
            firstSignIn: "First sign in please",
            redirection: "Redirection",
            signUp: "Sign up",
            signIn: "Sign in",
            username: "Username",
            email: "E-mail",
            name: "Full name",
            notAdmin: "Wrong admin credentials",
            alreadyHaveProduct: "You already have product",
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
            signOut: "Log out",
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
          deleteSuccess: "Successfully deleted",
          deleteConfirm: "Do you really want to delete the item?",
          account: {
            account: "Account",
            answeredQuestions: "Answered questions",
            addedTasks: "Added tasks",
            accountInformation: "Account information",
            name: "Name",
            username: "Username",
            actions: "Actions",
            addTask: "Add task",
            addReview: "Add review",
            editAccount: "Edit account",
            accountEditted: "Account editted",
            accountEdittedDesc: "Account was successfully editted",
            showReviews: "Show reviews",
          },
          answers: {
            answerToTask: "Answer to task",
            postedBy: "Posted by",
            description: "Description",
            files: "Files",
            withoutDocument: "Without documents",
            answers: "Answers",
            answer: "Answer",
            noAnswers: "No answers yet",
            deleteSuccessDesc: "Answer was successfully deleted",
            successEditDesc: "Answer was successfully editted",
            addEditAnswer: "Edit answer"
          },
          successEdit: "Sucess edit",
          tasks: {
            askAQuestion: "Ask a question",
            deleteSuccessDesc: "Task was successfully deleted",
            addEditTask: "Add/edit task",
            title: "Title",
            max20chars: "Max 20 chars",
            willingToPay: "Willing to pay",
            dueDate: "Due date",
            description: "Description",
            max200chars: "Max 200 chars",
            category: "Category",
            doesntChoose: "Does not choose",
            close: "Close",
            submit: "Submit",
            successEditDesc: "Task was successfully editted",
            successPostDesc: "Task was successfully added",
            task: "Task"
          },
          subscripe: {
            subscripe: "Subscripe"
          },
          feedback: {
            feedback: "Feedback",
            min: "Min 10 characters",
            max: "Max 300 characters",
            pattern: "Message contains unallowed characters",
            feedbackSent: "Feedback sent",
            addFeedback: "Add feedback",
            submit: "Submit",
            message: "Message for us",
          }
        },
      },
      cs: {
        translation: {
          admin: {
            administration: "Administrace",
          },
          review: "Recenze",
          stars: "Hvězdy",
          successPost: "Úspěšně přidáno",
          errorPost: "Vyskytla se chyba",
          error: "Chyba",
          oneTaskPage: {
            answer: "Odpovědět",
            category: "Kategorie",
            willingToPay: "Ochoten zaplatit",
            createdDate: "Vytvořeno",
            assignee: "Přiděleno",
            creator: "Zadavatel",
            description: "Popis",
            errorPostDesc: "Pole odpovědi nesmí být prázdné a maximálně 300 znaků dlouhé",
            successPostDesc: "Vaše odpověď byla úspěšně přidána"
          },
          homePage: {
            reviews: {
              noReviewsAvailable: "Nenašli jsme žádné recenze",
              successPostDesc: "Vaše recenze byla úspěšně zaevidována",
              errorPostDesc: "Prosíme zadejte platné hodnoty - hvězdy jsou povinné a obsah recenze musí být nejméně 10 písmen dlouhý",
              reviewError: "Min 10 znaků",
              averageRating: "Průměrné hodnocení",
              noRating: "Zatím bez hodnocení",
            },
            whyUs: {
              telephoneAssistance: "Telefonická pomoc",
              telephoneAssistanceDesc: "Můžete si dokonce koupit telefonickou pomoc od někoho, kdo se ve svém oboru vyzná.",
              allInOnePlace: "Všechno na jednom místě",
              allInOnePlaceDesc: "Rady pro vaši práci, pomoc s domácími úkoly, pomoc s testy nebo jen pomoc s vypracováním smlouvy",
              moneySafety: "Bezpečnost při placení",
              moneySafetyDesc: "Nemusíte se obávat, že vám někdo nezaplatí po převzetí vaší odpovědi, všechno je z naší strany opatřeno"
            },
            howItWorks: "Jak to funguje",
            enterTaskDesc: "ZDARMA zadej ukol, který ti někdo vyřeší, za částku, kterou určíš jen a zcela ty. Udělej to snadno pomocí formuláře",
            chooseAnswer: "Vyber si z odpovědí",
            enjoyFreeTime: "Užívej volného času",
            enterTask: "Zadej úkol",
            here: "zde",
            chooseAnswerDesc: "Až na tvůj úkol někdo odpoví, objeví se ti náhled jeho odpovědi, takže si vyber tu, která ti sedí nejvíce, a řešiteli snadno zaplať, a my ti odpověď doručíme.",
            enjoyFreeTimeDesc: "Právě jsi sám sobě ušetřil spoustu času, Teď už si jen stačí vychutnat volný čas, který díky snadnému vyřešení máš."
          },
          heroSection: {
            findSolution: "Najděte řešení pro svoje",
            superWords: "Eliminujte paralýzu úkolů: Řešte úkoly, které vás dříve trápily hodiny. Ukončete odkládání: Vyřešte úkoly, které vás dříve zarážely hodiny. Přestaňte plýtvat časem: Řešte úkoly, na které dříve trvalo hodiny zvažování.",
            getStarted: "Zkuste si to",
            learnMore: "Zjistěte více",
            schoolProjects: "školní projekty",
            termPaper: "semestrální práce",
            onlineTests: "online testy"
          },
          nav: {
            questions: "Otázky",
            findHelp: "Najdi pomoc",
            setATask: "Zadej úkol",
            setATaskDesc: "Zadej úkol, se kterým si nevíš rady a někdo ti rád pomůže",
            answeredQuestions: "Podívej se na zodpovězené otázky",
            answeredQuestionsDesc: "Koukni se komu už naše stránka pomohla a třeba najdeš odpověď na svůj problém",
            users: "Uživatelé",
            usersDesc: "Podívej se na to, v čem jsou naši uživatelé vzdělaní a můžeš je přímo požádat o pomoc",
            home: "Domů",
            pricingHowItWorks: "Ceník / Jak to funguje",
            supportFAQ: "Support / FAQ",
            answerAQuestion: "Odpověz na otázku",
            answerAQuestionDesc: "Odpověz na otázku a přivydělej si nějaké peníze!",
            archivOfQuestions: "Archiv otázek",
            archivOfQuestionsDesc: "Již zodpovězené a zarchivované otázky - hledej inspiraci",
            inviteAFriend: "Pozvi kámoše",
            inviteAFriendDesc: "Pozvi kámoše pomocí speciálního linku"
          },
          auth: {
            newPassword: "Nové heslo",
            alreadySignIn: "Už jste přihlášen",
            firstSignIn: "Nejdříve se přihlašte",
            redirection: "Přesměrování",
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
            notAdmin: "Nesprávné přihlašovací údaje k admin účtu",
            alreadyHaveProduct: "Již máte zakoupený produkt",
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
          deleteConfirm: "Opravdu chcete položku smazat?",
          deleteSuccess: "Úspěšně smazáno",
          account: {
            account: "Profil",
            answeredQuestions: "Zodpovězené otázky",
            addedTasks: "Přidané úkoly",
            accountInformation: "Informace o profilu",
            name: "Jméno",
            username: "Uživatelské jméno",
            actions: "Akce",
            addTask: "Přidat úkol",
            addReview: "Přidat recenzi",
            editAccount: "Upravit profil",
            accountEditted: "Profil upraven",
            accountEdittedDesc: "Profil byl úspěšně upraven",
            showReviews: "Zobrazit recenze",
          },
          answers: {
            answerToTask: "Odpověď na úkol",
            postedBy: "Přidáno uživatelem",
            description: "Popis",
            files: "Soubory",
            withoutDocument: "Bez dokumentů",
            answers: "Odpovědi",
            answer: "Odpověď",
            noAnswers: "Zatím bez odpovědí",
            deleteSuccessDesc: "Odpověď byla úspěšně vymazána",
            successEditDesc: "Odpověď byla úspěšně zeditována",
            addEditAnswer: "Upravit odpověď"
          },
          successEdit: "Úspěšně zeditováno",
          tasks: {
            askAQuestion: "Zeptejte se",
            deleteSuccessDesc: "Úkol byl úspěšně smazán",
            addEditTask: "Přidat/editovat úkol",
            title: "Titul",
            max20chars: "Maximálně 20 znaků",
            willingToPay: "Ochoten zaplatit",
            dueDate: "Do data",
            description: "Popis",
            max200chars: "Maximálně 200 znaků",
            category: "Kategorie",
            doesntChoose: "Nezvoleno",
            close: "Zavřít",
            submit: "Potvrdit",
            successEditDesc: "Úkol byl úspěšně zeditován",
            successPostDesc: "Váš úkol byl úspěšně přidán",
            task: "Úkol"
          },
          subscripe: {
            subscripe: "Odebírejte"
          },
          feedback: {
            feedback: "Zpětná vazba",
            min: "Minimálně 10 znaků",
            max: "Maximálně 300 znaků",
            pattern: "Zpráva obsahuje nepovolené znaky",
            feedbackSent: "Zpětná vazba odeslána",
            addFeedback: "Přidat zpětnou vazbu",
            submit: "Odeslat",
            message: "Zpráva pro nás",            
          }
        },
      },
    },
  });

export default i18n;
