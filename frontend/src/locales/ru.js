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
      modalAddRename: {
        errors: {
          notEmpty: 'Поле не должно быть пустым',
          minLength: 'Не менее 3 символов',
          maxLength: 'Не более 20 символов',
          unique: 'Должно быть уникально',
          obsceneLxicon: 'Ненормативная лексика',
        },
        label: 'Имя канала',
        btnCancel: 'Отменить',
        btnSubmit: 'Отправить',
      },
      modalRemove: {
        areYouSure: 'Уверены?',
        btnCancel: 'Отменить',
        btnSubmit: 'Удалить',
      },
      page404: {
        notFound: 'Страница не найдена',
        linkTo: 'Но вы можете перейти ',
        toMainPage: 'на главную страницу',
      },
      signupPage: {
        errors: {
          required: 'Обязательное поле',
          minLengthName: 'Не менее 3 символов',
          maxLengthName: 'Не более 20 символов',
          minLengthPassword: 'Не менее 6 символов',
          mustMatch: 'Пароли должны совпадать',
          alreadyExists: 'Такой пользователь уже существует',
          errNetwork: 'Ошибка сети',
          obsceneLxicon: 'Ненормативная лексика',
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
        addChannel: 'Добавить канал',
        renameChannel: 'Переименовать канал',
        removeChannel: 'Удалить канал',
        serverErr: 'Ошибка сервера',
        toasts: {
          createChannel: 'Канал создан',
          renameChannel: 'Канал переименован',
          deleteChannel: 'Канал удалён',
        },
        messageCount: {
          count_one: '{{count}} сообщение',
          count_few: '{{count}} сообщения',
          count_many: '{{count}} сообщений',
        },
        messagePlaceholder: 'Введите сообщение...',
        messageLabel: 'Новое сообщение',
        btnSubmit: 'Отправить',
      },
    },
  },
};

export default resources;
