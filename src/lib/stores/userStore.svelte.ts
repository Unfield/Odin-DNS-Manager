type User = {
  id: string;
  username: string;
  email: string;
  avatar: string;
  token: string;
};

let user: User | null = $state(null);

export function setUser(newUser: User | null) {
  user = newUser;
}

export function getUser(): User | null {
  return user;
}

export function isAuthenticated(): boolean {
  return user !== null && user.token !== "";
}
