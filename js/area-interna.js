(() => {
  document.addEventListener("DOMContentLoaded", () => {
    const auth = globalThis.DoSimInternalAuth;
    const loginPanel = document.querySelector("[data-internal-login]");
    const hubPanel = document.querySelector("[data-internal-hub]");
    const loginForm = document.querySelector("[data-internal-login-form]");
    const passwordInput = document.querySelector("[data-internal-password]");
    const errorField = document.querySelector("[data-internal-login-error]");
    const logoutButton = document.querySelector("[data-internal-logout]");

    if (
      !auth ||
      !(loginPanel instanceof HTMLElement) ||
      !(hubPanel instanceof HTMLElement) ||
      !(loginForm instanceof HTMLFormElement) ||
      !(passwordInput instanceof HTMLInputElement)
    ) {
      return;
    }

    const showAuthenticatedView = (authenticated) => {
      loginPanel.hidden = authenticated;
      hubPanel.hidden = !authenticated;
      if (authenticated) {
        hubPanel.querySelector("a")?.focus();
        return;
      }

      passwordInput.value = "";
      passwordInput.focus();
    };

    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (errorField instanceof HTMLElement) errorField.textContent = "";

      try {
        if (!(await auth.authenticate(passwordInput.value))) {
          if (errorField instanceof HTMLElement) errorField.textContent = "Senha incorreta.";
          passwordInput.select();
          return;
        }

        auth.login();
        showAuthenticatedView(true);
      } catch (error) {
        if (errorField instanceof HTMLElement) {
          errorField.textContent = error instanceof Error ? error.message : "Não foi possível autenticar.";
        }
      }
    });

    logoutButton?.addEventListener("click", () => {
      auth.logout();
      showAuthenticatedView(false);
    });

    showAuthenticatedView(auth.isAuthenticated());
  });
})();
