(() => {
  const AUTH_KEY = "dosim_internal_authenticated_v1";
  const AUTH_HASH = "5b33003a928495b97792ac286d477b54dd20eb773c74ae2fb3653bc5950ad6dd";

  async function digest(value) {
    if (!globalThis.crypto?.subtle) {
      throw new Error("Autenticação indisponível neste navegador.");
    }

    const bytes = new TextEncoder().encode(value);
    const hashBuffer = await globalThis.crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(hashBuffer))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  }

  globalThis.DoSimInternalAuth = Object.freeze({
    async authenticate(password) {
      return (await digest(password)) === AUTH_HASH;
    },
    isAuthenticated() {
      return sessionStorage.getItem(AUTH_KEY) === "true";
    },
    login() {
      sessionStorage.setItem(AUTH_KEY, "true");
    },
    logout() {
      sessionStorage.removeItem(AUTH_KEY);
    },
  });
})();
