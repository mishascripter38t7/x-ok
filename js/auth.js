import { checkSafety } from './guard.js';

export class AuthManager {
  constructor() {
    this.usersKey = 'xok_db_users';
    this.sessionKey = 'xok_current_session';
  }

  getUsers() {
    return JSON.parse(localStorage.getItem(this.usersKey) || '{}');
  }

  register(displayName, username, password, avatarBase64) {
    const users = this.getUsers();
    const cleanUsername = username.startsWith('@') ? username : '@' + username;

    // Проверка через Xok Guard AI
    const safetyCheck = checkSafety(displayName + ' ' + cleanUsername);
    if (!safetyCheck.safe) return { success: false, msg: safetyCheck.reason };

    if (users[cleanUsername]) {
      return { success: false, msg: 'Этот @username уже зарегистрирован!' };
    }

    const newUser = {
      displayName,
      username: cleanUsername,
      password: btoa(password), // Простое кодирование пароля для защиты в хранилище
      avatar: avatarBase64 || `assets/avatars/default.svg`
    };

    users[cleanUsername] = newUser;
    localStorage.setItem(this.usersKey, JSON.stringify(users));
    localStorage.setItem(this.sessionKey, JSON.stringify(newUser));

    return { success: true, user: newUser };
  }

  login(username, password) {
    const users = this.getUsers();
    const cleanUsername = username.startsWith('@') ? username : '@' + username;
    const user = users[cleanUsername];

    if (user && user.password === btoa(password)) {
      localStorage.setItem(this.sessionKey, JSON.stringify(user));
      return { success: true, user };
    }
    return { success: false, msg: 'Неверный логин или пароль!' };
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem(this.sessionKey) || 'null');
  }

  logout() {
    localStorage.removeItem(this.sessionKey);
  }
}
