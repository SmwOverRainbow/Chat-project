 const resources = {
  ru: {
    translation: {
      layout: {
        logIn: 'Войти',
        logOut: 'Выйти',
        chatName: 'Hexlet Chat',
      },
      loginPage: {
        errors: {
          notExist: 'Неверные имя пользователя или пароль',
          required: 'Обязательное поле',
        },
        logIn: 'Войти',
        username: 'Ваш ник',
        password: 'Пароль',
        noAcc: 'Нет аккаунта? ',
        toSignup: 'Регистрация',
      },
      modal: {
        addChannelTitle: 'Добавить канал',
        renameChannelTitle: 'Переименовать канал',
        removeChannelTitle: 'Удалить канал',
        errors: {
          notEmpty: 'Поле не должно быть пустым',
          minLength: 'От 3 до 20 символов',
          maxLength: 'От 3 до 20 символов',
          unique: 'Должно быть уникально',
          obsceneLexicon: 'Ненормативная лексика',
        },
        label: 'Имя канала',
        btnCancel: 'Отменить',
        btnSubmit: 'Отправить',
        areYouSure: 'Уверены?',
        btnDelete: 'Удалить',
      },
      page404: {
        notFound: 'Страница не найдена',
        linkTo: 'Но вы можете перейти ',
        toMainPage: 'на главную страницу',
      },
      signupPage: {
        errors: {
          required: 'Обязательное поле',
          minLengthName: 'От 3 до 20 символов',
          maxLengthName: 'От 3 до 20 символов',
          minLengthPassword: 'Не менее 6 символов',
          mustMatch: 'Пароли должны совпадать',
          alreadyExists: 'Такой пользователь уже существует',
          errNetwork: 'Ошибка соединения',
          obsceneLexicon: 'Ненормативная лексика',
        },
        signup: 'Регистрация',
        usernameLabel: 'Имя пользователя',
        passwordLabel: 'Пароль',
        repeatPassword: 'Подтвердите пароль',
        btnSignup: 'Зарегистрироваться',
      },
      chatPage: {
        channels: 'Каналы',
        labelManage: 'Управление каналом',
        deleteDropdownBtn: 'Удалить',
        renameDropdownBtn: 'Переименовать',
        messageCount: {
          count_one: '{{count}} сообщение',
          count_few: '{{count}} сообщения',
          count_many: '{{count}} сообщений',
        },
        messagePlaceholder: 'Введите сообщение...',
        messageLabel: 'Новое сообщение',
        btnSubmit: 'Отправить',
      },
      toasts: {
        createChannel: 'Канал создан',
        renameChannel: 'Канал переименован',
        deleteChannel: 'Канал удалён',
        serverErr: 'Ошибка соединения',
      },
    },
  },
};

export default resources;
